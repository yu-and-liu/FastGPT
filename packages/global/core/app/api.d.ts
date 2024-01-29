import type { ChatModelItemType } from '../ai/model.d';
import { AppTypeEnum } from './constants';
import { AppSchema, AppEditFormType } from './type';

export type CreateAppParams = {
  name?: string;
  avatar?: string;
  type?: `${AppTypeEnum}`;
  modules: AppSchema['modules'];
};

export type AppUpdateParams = {
  name?: string;
  type?: `${AppTypeEnum}`;
  avatar?: string;
  intro?: string;
  permission?: AppSchema['permission'];

  tools?: AppSchema['tools'];
  welcomeText?: AppSchema['welcomeText'];
  variables?: AppSchema['variables'];
  questionGuide?: AppSchema['questionGuide'];
  tts?: AppSchema['tts'];
};

export type FormatForm2ModulesProps = {
  formData: AppEditFormType;
  chatModelMaxToken: number;
  chatModelList: ChatModelItemType[];
};
