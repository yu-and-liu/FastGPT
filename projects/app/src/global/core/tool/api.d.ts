import { ToolSourceEnum } from '@fastgpt/global/core/tool/constants';
import { ToolsChoiceItemType } from '@fastgpt/global/core/tool/type';

export type getToolsChoiceListResponse = Record<`${ToolSourceEnum}`, ToolsChoiceItemType[]>;
