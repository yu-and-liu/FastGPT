import { GET, POST, DELETE, PUT } from '@/web/common/api/request';
import { FlowNodeTemplateType } from '@fastgpt/global/core/module/type';
import {
  CreateOnePluginParams,
  PluginListItemType,
  UpdatePluginParams
} from '@fastgpt/global/core/plugin/controller';
import { PluginItemSchema } from '@fastgpt/global/core/plugin/type';

export const postCreatePlugin = (data: CreateOnePluginParams) =>
  POST<string>('/core/plugin/create', data);
export const putUpdatePlugin = (data: UpdatePluginParams) => PUT('/core/plugin/update', data);
export const getUserPlugins = () => GET<PluginListItemType[]>('/core/plugin/list');

/* work flow */
export const getTeamPlugTemplates = () =>
  GET<FlowNodeTemplateType[]>('/core/plugin/getTeamPluginTemplates');
export const getSystemPlugTemplates = () =>
  GET<FlowNodeTemplateType[]>('/core/plugin/getSystemPluginTemplates');

export const getPreviewPluginModule = (id: string) =>
  GET<FlowNodeTemplateType>('/core/plugin/getPreviewModule', { id });
export const getOnePlugin = (id: string) => GET<PluginItemSchema>('/core/plugin/detail', { id });
export const delOnePlugin = (id: string) => DELETE('/core/plugin/delete', { id });
