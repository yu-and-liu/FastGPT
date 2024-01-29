import { ModuleTemplateTypeEnum } from 'core/module/constants';
import type { FlowModuleTemplateType, ModuleItemType } from '../module/type.d';
import { ToolSourceEnum } from './constants';

export type ToolItemSchema = {
  _id: string;
  userId: string;
  teamId: string;
  tmbId: string;
  name: string;
  avatar: string;
  intro: string;
  updateTime: Date;
  modules: ModuleItemType[];
};

export type SystemToolItemType = {
  id: string;
  author: string;
  name: string;
  avatar: string;
  desc: string;
  source: `${ToolSourceEnum}`;

  // type: string;
  input: ModuleItemType;
  output: ModuleItemType;
  flows: ModuleItemType[];
};

export type ToolsChoiceItemType = {
  id: string;
  author: string;
  name: string;
  avatar: string;
  desc: string;
  source: `${ToolSourceEnum}`;

  input: ModuleItemType;
  output: ModuleItemType;
};

/* tool template */
export type ToolTemplateType = ToolRuntimeItemType & {
  author?: string;
  id: string;
  source: `${ToolSourceEnum}`;
  templateType: FlowModuleTemplateType['templateType'];
  intro: string;
  modules: ModuleItemType[];
};

export type ToolRuntimeItemType = {
  teamId?: string;
  name: string;
  avatar: string;
  showStatus?: boolean;
  modules: ModuleItemType[];
};
