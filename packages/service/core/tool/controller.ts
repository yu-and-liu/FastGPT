import { MongoTool } from './schema';
import { FlowModuleTemplateType, ModuleItemType } from '@fastgpt/global/core/module/type';
import { FlowNodeTypeEnum } from '@fastgpt/global/core/module/node/constant';
import { plugin2ModuleIO } from '@fastgpt/global/core/module/utils';
import { ToolSourceEnum } from '@fastgpt/global/core/tool/constants';
import type { ToolRuntimeItemType, ToolTemplateType } from '@fastgpt/global/core/tool/type.d';
import { ModuleTemplateTypeEnum } from '@fastgpt/global/core/module/constants';

export const splitFlows2IO = (flows: ModuleItemType[]) => {
  const input = flows.find((item) => item.flowType === FlowNodeTypeEnum.pluginInput);
  const output = flows.find((item) => item.flowType === FlowNodeTypeEnum.pluginOutput);
  return {
    input: input as ModuleItemType,
    output: output as ModuleItemType
  };
};

/* 
  plugin id rule:
  team: id
  system: system-id
  commercial: commercial-id
*/

export async function splitCombinePluginId(id: string) {
  const splitRes = id.split('-');
  if (splitRes.length === 1) {
    return {
      source: ToolSourceEnum.team,
      pluginId: id
    };
  }

  const [source, pluginId] = id.split('-') as [`${ToolSourceEnum}`, string];
  if (!source || !pluginId) return Promise.reject('pluginId not found');

  return { source, pluginId: id };
}

const getPluginTemplateById = async (id: string): Promise<ToolTemplateType> => {
  const { source, pluginId } = await splitCombinePluginId(id);
  if (source === ToolSourceEnum.system) {
    const item = global.communityPlugins?.find((plugin) => plugin.id === pluginId);
    if (!item) return Promise.reject('plugin not found');

    return item;
  }
  if (source === ToolSourceEnum.team) {
    const item = await MongoTool.findById(id).lean();
    if (!item) return Promise.reject('plugin not found');
    return {
      id: String(item._id),
      teamId: String(item.teamId),
      name: item.name,
      avatar: item.avatar,
      intro: item.intro,
      showStatus: true,
      source: ToolSourceEnum.team,
      modules: item.modules,
      templateType: ModuleTemplateTypeEnum.personalPlugin
    };
  }
  return Promise.reject('plugin not found');
};

/* format plugin modules to plugin preview module */
export async function getPluginPreviewModule({
  id
}: {
  id: string;
}): Promise<FlowModuleTemplateType> {
  const plugin = await getPluginTemplateById(id);

  return {
    id: plugin.id,
    templateType: plugin.templateType,
    flowType: FlowNodeTypeEnum.pluginModule,
    avatar: plugin.avatar,
    name: plugin.name,
    intro: plugin.intro,
    showStatus: plugin.showStatus,
    ...plugin2ModuleIO(plugin.id, plugin.modules)
  };
}

/* run plugin time */
export async function getPluginRuntimeById(id: string): Promise<ToolRuntimeItemType> {
  const plugin = await getPluginTemplateById(id);

  return {
    teamId: plugin.teamId,
    name: plugin.name,
    avatar: plugin.avatar,
    showStatus: plugin.showStatus,
    modules: plugin.modules
  };
}
