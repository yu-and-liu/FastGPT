import { AppDetailType } from '@fastgpt/global/core/app/type.d';
import type {
  OutLinkEditType,
  OutLinkConfigEditType
} from '@fastgpt/global/support/outLink/type.d';

export const defaultApp: AppDetailType = {
  _id: '',
  userId: 'userId',
  name: '应用加载中',
  type: 'simple',
  avatar: '/icon/logo.svg',
  intro: '',
  updateTime: Date.now(),
  modules: [],
  teamId: '',
  tmbId: '',
  permission: 'private',
  isOwner: false,
  canWrite: false,
  teamTags: ['']
};

export const defaultOutLinkForm: OutLinkEditType = {
  name: '',
  responseDetail: false,
  limit: {
    QPM: 100,
    maxUsagePoints: -1
  }
};

export const defaultWecomOutLinkForm: OutLinkConfigEditType = {
  name: '',
  wecomConfig: {
    ReplyLimit: false,
    defaultResponse: '',
    immediateResponse: false,
    WXWORK_TOKEN: '',
    WXWORK_AESKEY: '',
    WXWORK_SECRET: '',
    WXWORD_ID: ''
  },
  limit: {
    QPM: 100,
    maxUsagePoints: -1
  }
};

export const defaultFeishuOutLinkForm: OutLinkConfigEditType = {
  name: '',
  limit: {
    QPM: 100,
    maxUsagePoints: -1
  },
  feiShuConfig: {
    appId: '',
    appSecret: ''
  }
};
export enum TTSTypeEnum {
  none = 'none',
  web = 'web',
  model = 'model'
}
