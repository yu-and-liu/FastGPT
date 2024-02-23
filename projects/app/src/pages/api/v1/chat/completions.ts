import type { NextApiRequest, NextApiResponse } from 'next';
import { authApp } from '@fastgpt/service/support/permission/auth/app';
import { authCert } from '@fastgpt/service/support/permission/auth/common';
import { sseErrRes, jsonRes } from '@fastgpt/service/common/response';
import { addLog } from '@fastgpt/service/common/system/log';
import { withNextCors } from '@fastgpt/service/common/middle/cors';
import { ChatRoleEnum, ChatSourceEnum } from '@fastgpt/global/core/chat/constants';
import { sseResponseEventEnum } from '@fastgpt/service/common/response/constant';
import { dispatchModules } from '@/service/moduleDispatch';
import type { ChatCompletionCreateParams } from '@fastgpt/global/core/ai/type.d';
import type { ChatMessageItemType } from '@fastgpt/global/core/ai/type.d';
import { gptMessage2ChatType, textAdaptGptResponse } from '@/utils/adapt';
import { getChatItems } from '@fastgpt/service/core/chat/controller';
import { saveChat } from '@/service/utils/chat/saveChat';
import { responseWrite } from '@fastgpt/service/common/response';
import { pushChatUsage } from '@/service/support/wallet/usage/push';
import { authOutLinkChatStart } from '@/service/support/permission/auth/outLink';
import { pushResult2Remote, addOutLinkUsage } from '@fastgpt/service/support/outLink/tools';
import requestIp from 'request-ip';
import { getUsageSourceByAuthType } from '@fastgpt/global/support/wallet/usage/tools';

import { selectShareResponse } from '@/utils/service/core/chat';
import { updateApiKeyUsage } from '@fastgpt/service/support/openapi/tools';
import { connectToDatabase } from '@/service/mongo';
import { getUserChatInfoAndAuthTeamPoints } from '@fastgpt/service/support/user/controller';
import { AuthUserTypeEnum } from '@fastgpt/global/support/permission/constant';
import { MongoApp } from '@fastgpt/service/core/app/schema';
import { autChatCrud } from '@/service/support/permission/auth/chat';

type FastGptWebChatProps = {
  chatId?: string; // undefined: nonuse history, '': new chat, 'xxxxx': use history
  appId?: string;
};
type FastGptShareChatProps = {
  shareId?: string;
  outLinkUid?: string;
};
type FastGptTeamShareChatProps = {
  teamId?: string;
  outLinkUid?: string;
};
export type Props = ChatCompletionCreateParams &
  FastGptWebChatProps &
  FastGptShareChatProps &
  FastGptTeamShareChatProps & {
    messages: ChatMessageItemType[];
    stream?: boolean;
    detail?: boolean;
    variables: Record<string, any>;
  };
export type ChatResponseType = {
  newChatId: string;
  quoteLen?: number;
};

export default withNextCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.on('close', () => {
    res.end();
  });
  res.on('error', () => {
    console.log('error: ', 'request error');
    res.end();
  });

  const {
    chatId,
    appId,
    teamId,
    shareId,
    outLinkUid,
    stream = false,
    detail = false,
    messages = [],
    variables = {}
  } = req.body as Props;

  try {
    const originIp = requestIp.getClientIp(req);

    await connectToDatabase();
    // body data check
    if (!messages) {
      throw new Error('Prams Error');
    }
    if (!Array.isArray(messages)) {
      throw new Error('messages is not array');
    }
    if (messages.length === 0) {
      throw new Error('messages is empty');
    }

    let startTime = Date.now();

    const chatMessages = gptMessage2ChatType(messages);
    if (chatMessages[chatMessages.length - 1].obj !== ChatRoleEnum.Human) {
      chatMessages.pop();
    }

    // user question
    const question = chatMessages.pop();
    if (!question) {
      throw new Error('Question is empty');
    }

    /* auth app permission */
    const { teamId, tmbId, user, app, responseDetail, authType, apikey, canWrite, outLinkUserId } =
      await (async () => {
        if (shareId && outLinkUid) {
          const { teamId, tmbId, user, appId, authType, responseDetail, uid } =
            await authOutLinkChatStart({
              shareId,
              ip: originIp,
              outLinkUid,
              question: question.value
            });
          const app = await MongoApp.findById(appId);

          if (!app) {
            return Promise.reject('app is empty');
          }

          return {
            teamId,
            tmbId,
            user,
            app,
            responseDetail,
            apikey: '',
            authType,
            canWrite: false,
            outLinkUserId: uid
          };
        }

        const {
          appId: apiKeyAppId,
          teamId,
          tmbId,
          authType,
          apikey
        } = await authCert({
          req,
          authToken: true,
          authApiKey: true
        });

        const user = await getUserChatInfoAndAuthTeamPoints(tmbId);

        // openapi key
        if (authType === AuthUserTypeEnum.apikey) {
          if (!apiKeyAppId) {
            return Promise.reject(
              'Key is error. You need to use the app key rather than the account key.'
            );
          }
          const app = await MongoApp.findById(apiKeyAppId);

          if (!app) {
            return Promise.reject('app is empty');
          }

          return {
            teamId,
            tmbId,
            user,
            app,
            responseDetail: detail,
            apikey,
            authType,
            canWrite: true
          };
        }

        // token auth
        if (!appId) {
          return Promise.reject('appId is empty');
        }
        const { app, canWrite } = await authApp({
          req,
          authToken: true,
          appId,
          per: 'r'
        });

        return {
          teamId,
          tmbId,
          user,
          app,
          responseDetail: detail,
          apikey,
          authType,
          canWrite: canWrite || false
        };
      })();

    // auth chat permission
    await autChatCrud({
      req,
      authToken: true,
      authApiKey: true,
      appId: app._id,
      chatId,
      shareId,
      outLinkUid,
      per: 'w'
    });

    // get and concat history
    const { history } = await getChatItems({
      appId: app._id,
      chatId,
      limit: 30,
      field: `dataId obj value`
    });

    const concatHistories = history.concat(chatMessages);
    const responseChatItemId: string | undefined = messages[messages.length - 1].dataId;

    /* start flow controller */
    const { responseData, moduleDispatchBills, answerText } = await dispatchModules({
      res,
      mode: 'chat',
      user,
      teamId: String(teamId),
      tmbId: String(tmbId),
      appId: String(app._id),
      chatId,
      responseChatItemId,
      modules: app.modules,
      variables,
      histories: concatHistories,
      startParams: {
        userChatInput: question.value
      },
      stream,
      detail
    });
    console.log('af');

    // save chat
    if (chatId) {
      await saveChat({
        chatId,
        appId: app._id,
        teamId: teamId,
        tmbId: tmbId,
        variables,
        updateUseTime: !shareId && String(tmbId) === String(app.tmbId), // owner update use time
        shareId,
        outLinkUid: outLinkUserId,
        source: (() => {
          if (shareId) {
            return ChatSourceEnum.share;
          }
          if (authType === 'apikey') {
            return ChatSourceEnum.api;
          }
          return ChatSourceEnum.online;
        })(),
        content: [
          question,
          {
            dataId: responseChatItemId,
            obj: ChatRoleEnum.AI,
            value: answerText,
            responseData
          }
        ],
        metadata: {
          originIp
        }
      });
    }

    addLog.info(`completions running time: ${(Date.now() - startTime) / 1000}s`);

    /* select fe response field */
    const feResponseData = canWrite ? responseData : selectShareResponse({ responseData });

    if (stream) {
      responseWrite({
        res,
        event: detail ? sseResponseEventEnum.answer : undefined,
        data: textAdaptGptResponse({
          text: null,
          finish_reason: 'stop'
        })
      });
      responseWrite({
        res,
        event: detail ? sseResponseEventEnum.answer : undefined,
        data: '[DONE]'
      });

      if (responseDetail && detail) {
        responseWrite({
          res,
          event: sseResponseEventEnum.appStreamResponse,
          data: JSON.stringify(feResponseData)
        });
      }

      res.end();
    } else {
      res.json({
        ...(detail ? { responseData: feResponseData } : {}),
        id: chatId || '',
        model: '',
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 1 },
        choices: [
          {
            message: { role: 'assistant', content: answerText },
            finish_reason: 'stop',
            index: 0
          }
        ]
      });
    }

    // add record
    const { totalPoints } = pushChatUsage({
      appName: app.name,
      appId: app._id,
      teamId: teamId,
      tmbId: tmbId,
      source: getUsageSourceByAuthType({ shareId, authType }),
      moduleDispatchBills
    });

    if (shareId) {
      pushResult2Remote({ outLinkUid, shareId, responseData });
      addOutLinkUsage({
        shareId,
        totalPoints
      });
    }
    if (apikey) {
      updateApiKeyUsage({
        apikey,
        totalPoints
      });
    }
  } catch (err) {
    if (stream) {
      sseErrRes(res, err);
      res.end();
    } else {
      jsonRes(res, {
        code: 500,
        error: err
      });
    }
  }
});

export const config = {
  api: {
    responseLimit: '20mb'
  }
};
