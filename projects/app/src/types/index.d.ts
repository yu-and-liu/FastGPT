import {
  AudioSpeechModelType,
  ChatModelItemType,
  FunctionModelItemType,
  LLMModelItemType,
  ReRankModelItemType,
  VectorModelItemType,
  WhisperModelType
} from '@fastgpt/global/core/ai/model.d';
import { TrackEventName } from '@/constants/common';
import { AppSimpleEditConfigTemplateType } from '@fastgpt/global/core/app/type';
import { FastGPTFeConfigsType, SystemEnvType } from '@fastgpt/global/common/system/types';
import { SubPlanType } from '@fastgpt/global/support/wallet/sub/type';
import { SystemToolItemType } from '@fastgpt/global/core/tool/type.d';

export type PagingData<T> = {
  pageNum: number;
  pageSize: number;
  data: T[];
  total?: number;
};

export type RequestPaging = { pageNum: number; pageSize: number; [key]: any };

declare global {
  var feConfigs: FastGPTFeConfigsType;
  var systemEnv: SystemEnvType;
  var systemInitd: boolean;
  var subPlans: SubPlanType | undefined;

  var qaQueueLen: number;
  var vectorQueueLen: number;

  var chatModels: ChatModelItemType[];
  var vectorModels: VectorModelItemType[];
  var qaModels: LLMModelItemType[];
  var cqModels: FunctionModelItemType[];
  var extractModels: FunctionModelItemType[];
  var qgModels: LLMModelItemType[];
  var audioSpeechModels: AudioSpeechModelType[];
  var whisperModel: WhisperModelType;
  var reRankModels: ReRankModelItemType[];

  var systemVersion: string;

  var simpleModeTemplates: AppSimpleEditConfigTemplateType[];
  var systemTools: SystemToolItemType[];

  interface Window {
    grecaptcha: any;
    QRCode: any;
    umami?: {
      track: (event: `${TrackEventName}`, data: any) => void;
    };
  }
}
