import { GET, POST, PUT, DELETE } from '@/web/common/api/request';
import {
  StandardSubPlanParams,
  StandardSubPlanUpdateResponse
} from '@fastgpt/global/support/wallet/sub/api';
import { SubStatusEnum, SubTypeEnum } from '@fastgpt/global/support/wallet/sub/constants';
<<<<<<< HEAD
import { FeTeamPlanStatusType } from '@fastgpt/global/support/wallet/sub/type';

=======
import { FeTeamSubType, TeamSubSchema } from '@fastgpt/global/support/wallet/sub/type';
>>>>>>> f3f1bea7 (feat 新增套餐详情弹窗)
export const putTeamDatasetSubStatus = (data: {
  status: `${SubStatusEnum}`;
  type: `${SubTypeEnum}`;
}) => POST('/proApi/support/wallet/sub/updateStatus', data);

<<<<<<< HEAD
export const getTeamPlanStatus = () =>
  GET<FeTeamPlanStatusType>(`/support/wallet/sub/getTeamSubStatus`);
=======
export const getTeamDatasetValidSub = () =>
  GET<FeTeamSubType>(`/support/wallet/sub/getTeamSubStatus`);
export const getUserStandDardList = () =>
  GET<TeamSubSchema>(`/support/wallet/sub/getUserStandard`);
>>>>>>> f3f1bea7 (feat 新增套餐详情弹窗)

export const postCheckStandardSub = (data: StandardSubPlanParams) =>
  POST<StandardSubPlanUpdateResponse>('/proApi/support/wallet/sub/standard/preCheck', data);
export const postUpdateStandardSub = (data: StandardSubPlanParams) =>
  POST<StandardSubPlanUpdateResponse>('/proApi/support/wallet/sub/standard/update', data);
