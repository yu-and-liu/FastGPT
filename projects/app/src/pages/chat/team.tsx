import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { getInitChatInfo } from '@/web/core/chat/api';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  IconButton,
  useTheme
} from '@chakra-ui/react';
import MyIcon from '@fastgpt/web/components/common/Icon';
import Avatar from '@/components/Avatar';
import { useToast } from '@/web/common/hooks/useToast';
import { useQuery } from '@tanstack/react-query';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import SideBar from '@/components/SideBar';
import PageContainer from '@/components/PageContainer';
import { getChatListById } from '@/web/core/chat/api';
import ChatHistorySlider from './components/ChatHistorySlider';
import ChatHeader from './components/ChatHeader';
import { serviceSideProps } from '@/web/common/utils/i18n';
import { useTranslation } from 'next-i18next';
import { checkChatSupportSelectFileByChatModels } from '@/web/core/chat/utils';
import { useChatStore } from '@/web/core/chat/storeChat';
import { customAlphabet } from 'nanoid';
import { useLoading } from '@/web/common/hooks/useLoading';
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 12);
import ChatBox, { type ComponentRef, type StartChatFnProps } from '@/components/ChatBox';
import { streamFetch } from '@/web/common/api/fetch';
import { useShareChatStore } from '@/web/core/chat/storeShareChat';
import type { ChatHistoryItemType } from '@fastgpt/global/core/chat/type.d';
import { chatContentReplaceBlock } from '@fastgpt/global/core/chat/utils';
import { ChatStatusEnum } from '@fastgpt/global/core/chat/constants';
import { POST } from '@/web/common/api/request';
const OutLink = ({
  teamId,
  appId,
  chatId,
  authToken
}: {
  teamId: string;
  appId: string;
  chatId: string;
  authToken?: string;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const theme = useTheme();
  const [myApps, setMyApps] = useState<Array<any>>([]);
  const { isPc } = useSystemStore();
  const ChatBoxRef = useRef<ComponentRef>(null);
  const [teamInfo, setTeamInfo] = useState();
  const { Loading, setIsLoading } = useLoading();
  const forbidRefresh = useRef(false);

  const { isOpen: isOpenSlider, onClose: onCloseSlider, onOpen: onOpenSlider } = useDisclosure();
  const {
    histories,
    loadHistories,
    lastChatAppId,
    setLastChatAppId,
    lastChatId,
    setLastChatId,
    pushHistory,
    updateHistory,
    delOneHistory,
    chatData,
    setChatData,
    delOneHistoryItem,
    clearHistories
  } = useChatStore();
  const {
    localUId,
    shareChatHistory, // abandon
    clearLocalHistory // abandon
  } = useShareChatStore();

  const outLinkUid: string = authToken || localUId;

  // 纯网络获取流程
  const loadApps = useCallback(async () => {
    // 根据teamId 获取教研token以及用户tags，然后通过是否为
    // 根据获取历史记录列表
    const res = await getChatListById({ teamId, authToken, appId });
    const { apps = [], teamInfo } = res;
    setMyApps(apps);
    setTeamInfo(teamInfo);
    if (apps.length <= 0) {
      toast({
        status: 'error',
        title: t('core.chat.You need to a chat app')
      })
    }
    //
    return null;
  }, [outLinkUid, router, t, toast]);

  const startChat = useCallback(
    async ({ messages, controller, generatingMessage, variables }: StartChatFnProps) => {
      const prompts = messages.slice(-2);
      const completionChatId = chatId ? chatId : nanoid();

      const { responseText, responseData } = await streamFetch({
        data: {
          messages: prompts,
          variables,
          appId,
          chatId: completionChatId
        },
        onMessage: generatingMessage,
        abortSignal: controller
      });

      const newTitle =
        chatContentReplaceBlock(prompts[0].content).slice(0, 20) ||
        prompts[1]?.value?.slice(0, 20) ||
        t('core.chat.New Chat');

      // new chat
      if (completionChatId !== chatId) {
        const newHistory: ChatHistoryItemType = {
          chatId: completionChatId,
          updateTime: new Date(),
          title: newTitle,
          appId,
          top: false
        };
        pushHistory(newHistory);
        if (controller.signal.reason !== 'leave') {
          forbidRefresh.current = true;
          router.replace({
            query: {
              chatId: completionChatId,
              appId,
              teamId: teamId,
              authToken: authToken
            }
          });
        }
      } else {
        // update chat
        const currentChat = histories.find((item) => item.chatId === chatId);
        currentChat &&
          updateHistory({
            ...currentChat,
            updateTime: new Date(),
            title: newTitle
          });
      }
      // update chat window
      setChatData((state) => ({
        ...state,
        title: newTitle,
        history: ChatBoxRef.current?.getChatHistories() || state.history
      }));

      return { responseText, responseData, isNewChat: forbidRefresh.current };
    },
    [appId, chatId, histories, pushHistory, router, setChatData, updateHistory]
  );

  const { isFetching } = useQuery(['init', appId, teamId], async () => {
    if (!teamId) {
      return null;
    }
    return teamId && loadApps();
  });

  useQuery(['loadHistories', appId], () => (appId ? loadHistories({ appId }) : null));
  // 初始化聊天框
  useQuery(['init', { appId, chatId }], () => {
    // pc: redirect to latest model chat
    if (!appId && lastChatAppId) {
      return router.replace({
        query: {
          appId: lastChatAppId,
          chatId: lastChatId,
          teamId: teamId,
          authToken: authToken
        }
      });
    }
    if (!appId && myApps[0]) {
      return router.replace({
        query: {
          appId: myApps[0]._id,
          chatId: lastChatId,
          teamId: teamId,
          authToken: authToken
        }
      });
    }
    if (!appId) {
      (async () => {
        const { apps = [] } = await getChatListById({ teamId, authToken, appId });
        setMyApps(apps);
        if (apps.length === 0) {
          toast({
            status: 'error',
            title: t('core.chat.You need to a chat app')
          });
          router.replace('/longin');
        } else {
          router.replace({
            query: {
              appId: apps[0]._id,
              chatId: lastChatId
            }
          });
        }
      })();
      return;
    }

    // store id
    appId && setLastChatAppId(appId);
    setLastChatId(chatId);

    if (forbidRefresh.current) {
      forbidRefresh.current = false;
      return null;
    }

    return loadChatInfo({
      appId,
      chatId,
      loading: appId !== chatData.appId
    });
  });

  // get chat app info
  const loadChatInfo = useCallback(
    async ({
      appId,
      chatId,
      loading = false
    }: {
      appId: string;
      chatId: string;
      loading?: boolean;
    }) => {
      try {
        loading && setIsLoading(true);
        const res = await getInitChatInfo({ appId, chatId });
        const history = res.history.map((item) => ({
          ...item,
          status: ChatStatusEnum.finish
        }));

        setChatData({
          ...res,
          history
        });

        // have records.
        ChatBoxRef.current?.resetHistory(history);
        ChatBoxRef.current?.resetVariables(res.variables);
        if (res.history.length > 0) {
          setTimeout(() => {
            ChatBoxRef.current?.scrollToBottom('auto');
          }, 500);
        }
      } catch (e: any) {
        // reset all chat tore
        setLastChatAppId('');
        setLastChatId('');
        toast({
          title: t('core.chat.Failed to initialize chat'),
          status: 'error'
        });
        if (e?.code === 501) {
          router.replace('/app/list');
        } else if (chatId) {
          router.replace({
            query: {
              ...router.query,
              chatId: ''
            }
          });
        }
      }
      setIsLoading(false);
      return null;
    },
    [setIsLoading, setChatData, router, setLastChatAppId, setLastChatId, toast]
  );
  // 监测路由改变
  // todo:4.6.4 init: update local chat history, add outLinkUid
  useEffect(() => {
    const activeHistory = shareChatHistory.filter((item) => !item.delete);
    if (!localUId || !teamId || activeHistory.length === 0) return;
    (async () => {
      try {
        await POST('/core/chat/initLocalShareHistoryV464', {
          outLinkUid: localUId,
          chatIds: shareChatHistory.map((item) => item.chatId)
        });
        clearLocalHistory();
        // router.reload();
      } catch (error) {
        toast({
          status: 'warning',
          title: t('core.shareChat.Init Error')
        });
      }
    })();
  }, [clearLocalHistory, localUId, router, shareChatHistory, teamId, t, toast]);

  return (
    <Flex h={'100%'}>
      <Head>
        <title>{teamInfo}</title>
      </Head>
      {/* pc show myself apps */}
      <Box borderRight={theme.borders.base} w={'220px'} flexShrink={0}>
        <Flex flexDirection={'column'} h={'100%'}>
          <Box flex={'1 0 0'} h={0} px={5} py={4} overflow={'overlay'}>
            {myApps.map((item) => (
              <Flex
                key={item._id}
                py={2}
                px={3}
                mb={3}
                cursor={'pointer'}
                borderRadius={'md'}
                alignItems={'center'}
                {...(item._id === appId
                  ? {
                    bg: 'white',
                    boxShadow: 'md'
                  }
                  : {
                    _hover: {
                      bg: 'myGray.200'
                    },
                    onClick: () => {
                      router.replace({
                        query: {
                          appId: item._id,
                          teamId: teamId,
                          authToken: authToken
                        }
                      });
                    }
                  })}
              >
                <Avatar src={item.avatar} w={'24px'} />
                <Box ml={2} className={'textEllipsis'}>
                  {item.name}
                </Box>
              </Flex>
            ))}
          </Box>
        </Flex>
      </Box>
      <PageContainer flex={'1 0 0'} w={0} p={[0, '16px']} position={'relative'}>
        <Flex h={'100%'} flexDirection={['column', 'row']} bg={'white'}>
          {((children: React.ReactNode) => {
            return isPc || !appId ? (
              <SideBar>{children}</SideBar>
            ) : (
              <Drawer
                isOpen={isOpenSlider}
                placement="left"
                autoFocus={false}
                size={'xs'}
                onClose={onCloseSlider}
              >
                <DrawerOverlay backgroundColor={'rgba(255,255,255,0.5)'} />
                <DrawerContent maxWidth={'250px'}>{children}</DrawerContent>
              </Drawer>
            );
          })(
            <ChatHistorySlider
              appId={appId}
              appName={chatData.app.name}
              appAvatar={chatData.app.avatar}
              activeChatId={chatId}
              onClose={onCloseSlider}
              history={histories.map((item, i) => ({
                id: item.chatId,
                title: item.title,
                customTitle: item.customTitle,
                top: item.top
              }))}
              onChangeChat={(chatId) => {
                router.replace({
                  query: {
                    chatId: chatId || '',
                    appId,
                    teamId: teamId,
                    authToken: authToken
                  }
                });
                if (!isPc) {
                  onCloseSlider();
                }
              }}
              onDelHistory={(e) => delOneHistory({ ...e, appId })}
              onClearHistory={() => {
                clearHistories({ appId });
                router.replace({
                  query: {
                    appId,
                    teamId: teamId,
                    authToken: authToken
                  }
                });
              }}
              onSetHistoryTop={(e) => {
                updateHistory({ ...e, appId });
              }}
              onSetCustomTitle={async (e) => {
                updateHistory({
                  appId,
                  chatId: e.chatId,
                  title: e.title,
                  customTitle: e.title
                });
              }}
            />
          )}
          {/* chat container */}
          <Flex
            position={'relative'}
            h={[0, '100%']}
            w={['100%', 0]}
            flex={'1 0 0'}
            flexDirection={'column'}
          >
            {/* header */}
            <ChatHeader
              appAvatar={chatData.app.avatar}
              appName={chatData.app.name}
              history={chatData.history}
              showHistory={true}
              onOpenSlider={onOpenSlider}
            />
            {/* chat box */}
            <Box flex={1}>
              <ChatBox
                active={!!chatData.app.name}
                ref={ChatBoxRef}
                appAvatar={chatData.app.avatar}
                userAvatar={chatData.userAvatar}
                userGuideModule={chatData.app?.userGuideModule}
                showFileSelector={checkChatSupportSelectFileByChatModels(chatData.app.chatModels)}
                feedbackType={'user'}
                onUpdateVariable={(e) => { }}
                onStartChat={startChat}
                onDelMessage={(e) =>
                  delOneHistoryItem({ ...e, appId: chatData.appId, chatId, outLinkUid })
                }
                appId={chatData.appId}
                chatId={chatId}
                outLinkUid={outLinkUid}
              />
            </Box>
          </Flex>
        </Flex>
      </PageContainer>
    </Flex>
  );
};

export async function getServerSideProps(context: any) {
  const teamId = context?.query?.teamId || '';
  const appId = context?.query?.appId || '';
  const chatId = context?.query?.chatId || '';
  const authToken = context?.query?.authToken || '';

  return {
    props: {
      teamId,
      appId,
      chatId,
      authToken,
      ...(await serviceSideProps(context))
    }
  };
}

export default OutLink;
