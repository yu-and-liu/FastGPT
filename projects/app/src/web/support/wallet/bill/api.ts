import { RequestPaging } from '@/types';
import { GET, POST } from '@/web/common/api/request';
import { GetPayQRCodeProps, GetPayQRCodeResponse } from '@fastgpt/global/support/wallet/bill/api';
import { BillTypeEnum } from '@fastgpt/global/support/wallet/bill/constants';
import type { BillSchemaType } from '@fastgpt/global/support/wallet/bill/type.d';

export const getBills = (
  data: RequestPaging & {
    type?: `${BillTypeEnum}`;
  }
) => POST<BillSchemaType[]>(`/proApi/support/wallet/bill/list`, data);

export const getWxPayQRCode = (data: GetPayQRCodeProps) =>
  POST<GetPayQRCodeResponse>(`/proApi/support/wallet/bill/getWxPayCode`, data);

export const checkBalancePayResult = (payId: string) =>
  GET<string>(`/proApi/support/wallet/bill/checkPayResult`, { payId }).then((data) => {
    try {
      GET('/common/system/unlockTask');
    } catch (error) {}
    return data;
  });
