/* 
  list tool choice data
*/
import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { authCert } from '@fastgpt/service/support/permission/auth/common';
import { MongoTool } from '@fastgpt/service/core/tool/schema';
import { ToolsChoiceItemType } from '@fastgpt/global/core/tool/type';
import { ToolSourceEnum } from '@fastgpt/global/core/tool/constants';
import { splitFlows2IO } from '@fastgpt/service/core/tool/controller';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    await connectToDatabase();
    const { teamId } = await authCert({ req, authToken: true });

    const systemTools = global.systemTools.map((item) => ({
      ...item,
      flows: undefined
    }));
    const teamTools = await MongoTool.find({
      teamId
    }).lean();
    const formatTeamTools = teamTools.map<ToolsChoiceItemType>((item) => ({
      id: String(item._id),
      author: '',
      name: item.name,
      avatar: item.avatar,
      desc: item.intro,
      source: ToolSourceEnum.team,
      ...splitFlows2IO(item.modules)
    }));

    jsonRes(res, {
      data: [...systemTools, ...formatTeamTools]
    });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
