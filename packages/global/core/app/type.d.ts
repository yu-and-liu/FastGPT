import type { AppTTSConfigType, ModuleItemType, VariableItemType } from '../module/type.d';
import { AppTypeEnum } from './constants';
import { PermissionTypeEnum } from '../../support/permission/constant';
import type { AIChatModuleProps, DatasetModuleProps } from '../module/node/type.d';
import { VariableInputEnum } from '../module/constants';
import { SelectedDatasetType } from '../module/api';
import { DatasetSearchModeEnum } from '../dataset/constants';

export interface AppSchema {
  _id: string;
  userId: string;
  teamId: string;
  tmbId: string;
  name: string;
  avatar: string;
  intro: string;
  updateTime: number;
  permission: `${PermissionTypeEnum}`;

  tools: { id: string; name: string; desc: string; avatar?: string; config: Record<string, any> }[];
  welcomeText: string;
  variables: {
    id: string;
    key: string;
    label: string;
    type: `${VariableInputEnum}`;
    required: boolean;
    maxLen: number;
    enums: {
      value: string;
    }[];
  }[];
  questionGuide: boolean;
  tts: {
    type: 'none' | 'web' | 'model';
    model?: string | undefined;
    voice?: string | undefined;
    speed?: number | undefined;
  };

  inited?: boolean;

  // abandon
  type: `${AppTypeEnum}`;
  simpleTemplateId: string;
  modules: ModuleItemType[];
}

export type AppListItemType = {
  _id: string;
  name: string;
  avatar: string;
  intro: string;
  isOwner: boolean;
  permission: `${PermissionTypeEnum}`;
};

export type AppDetailType = AppSchema & {
  isOwner: boolean;
  canWrite: boolean;
};

// Since useform cannot infer enumeration types, all enumeration keys can only be undone manually
export type AppEditFormType = {
  tools: AppSchema['tools'];
  // aiSettings: {
  //   model: string;
  //   systemPrompt?: string | undefined;
  //   temperature: number;
  //   maxToken: number;
  //   isResponseAnswerText: boolean;
  //   quoteTemplate?: string | undefined;
  //   quotePrompt?: string | undefined;
  // };
  welcomeText: AppSchema['welcomeText'];
  variables: AppSchema['variables'];
  questionGuide: AppSchema['questionGuide'];
  tts: AppSchema['tts'];
};

/* simple mode template*/
export type AppSimpleEditConfigTemplateType = {
  id: string;
  name: string;
  desc: string;
  systemForm: {
    aiSettings?: {
      model?: boolean;
      systemPrompt?: boolean;
      temperature?: boolean;
      maxToken?: boolean;
      quoteTemplate?: boolean;
      quotePrompt?: boolean;
    };
    dataset?: {
      datasets?: boolean;
      similarity?: boolean;
      limit?: boolean;
      searchMode: `${DatasetSearchModeEnum}`;
      usingReRank: boolean;
      searchEmptyText?: boolean;
    };
    cfr?: {
      background?: boolean;
    };
    userGuide?: {
      welcomeText?: boolean;
      variables?: boolean;
      questionGuide?: boolean;
      tts?: boolean;
    };
  };
};
