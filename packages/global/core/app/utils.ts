import type { AppDetailType, AppEditFormType } from '../app/type';
import { FlowNodeTypeEnum } from '../module/node/constant';
import { ModuleOutputKeyEnum, ModuleInputKeyEnum } from '../module/constants';
import type { FlowNodeInputItemType } from '../module/node/type.d';
import { getGuideModule, splitGuideModule } from '../module/utils';
import { ModuleItemType } from '../module/type.d';
import { DatasetSearchModeEnum } from '../dataset/constants';

export const getDefaultAppForm = (): AppEditFormType => {
  return {
    tools: [],
    // aiSettings: {
    //   model: 'gpt-3.5-turbo',
    //   systemPrompt: '',
    //   temperature: 0,
    //   isResponseAnswerText: true,
    //   quotePrompt: '',
    //   quoteTemplate: '',
    //   maxToken: 4000
    // },
    welcomeText: '',
    variables: [],
    questionGuide: false,
    tts: {
      type: 'web'
    }
  };
};

/* format app modules to edit form */
export const appModules2Form = (app: AppDetailType) => {
  const defaultApp = getDefaultAppForm();
  return {
    tools: app.tools || defaultApp.tools,
    // aiSettings: {
    //   model: 'gpt-3.5-turbo',
    //   systemPrompt: '',
    //   temperature: 0,
    //   isResponseAnswerText: true,
    //   quotePrompt: '',
    //   quoteTemplate: '',
    //   maxToken: 4000
    // },
    welcomeText: app.welcomeText || defaultApp.welcomeText,
    variables: app.variables || defaultApp.variables,
    questionGuide: app.questionGuide || defaultApp.questionGuide,
    tts: app.tts || defaultApp.tts
  };
};
