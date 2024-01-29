import { getSystemTime } from '@fastgpt/global/common/time/timezone';
import { ChatDispatchProps, ModuleItemType } from '@fastgpt/global/core/module/type';

export const runAgent = async ({
  res,
  modules,
  histories = [],
  startParams = {},
  variables = {},
  user,
  stream = false,
  detail = false,
  ...props
}: ChatDispatchProps & {
  modules: ModuleItemType[];
  startParams?: Record<string, any>;
}) => {
  if (stream) {
    res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Accel-Buffering', 'no');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
  }

  variables = {
    ...getSystemVariable({ timezone: user.timezone }),
    ...variables
  };
};

export const getSystemVariable = ({ timezone }: { timezone: string }) => {
  return {
    cTime: getSystemTime(timezone)
  };
};
