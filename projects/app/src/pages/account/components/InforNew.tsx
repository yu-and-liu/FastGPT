import React, { useCallback, useMemo, useRef } from 'react';
import {
  Box,
  Flex,
  Button,
  useDisclosure,
  useTheme,
  Divider,
  Select,
  Input,
  Link,
  Progress
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { UserUpdateParams } from '@/types/user';
import { useToast } from '@fastgpt/web/hooks/useToast';
import { useUserStore } from '@/web/support/user/useUserStore';
import type { UserType } from '@fastgpt/global/support/user/type.d';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useSelectFile } from '@/web/common/file/hooks/useSelectFile';
import { compressImgFileAndUpload } from '@/web/common/file/controller';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import { useTranslation } from 'next-i18next';
import { timezoneList } from '@fastgpt/global/common/time/timezone';
import Avatar from '@/components/Avatar';
import MyIcon from '@fastgpt/web/components/common/Icon';
import MyTooltip from '@/components/MyTooltip';
import { langMap, setLngStore } from '@/web/common/utils/i18n';
import { useRouter } from 'next/router';
import MySelect from '@/components/Select';
import { formatStorePrice2Read } from '@fastgpt/global/support/wallet/usage/tools';
import { putUpdateMemberName } from '@/web/support/user/team/api';
import { getDocPath } from '@/web/common/system/doc';
import { getTeamDatasetValidSub } from '@/web/support/wallet/sub/api';
import { MongoImageTypeEnum } from '@fastgpt/global/common/file/image/constants';

const TeamMenu = dynamic(() => import('@/components/support/user/team/TeamMenu'));
const PayModal = dynamic(() => import('./PayModal'));
const UpdatePswModal = dynamic(() => import('./UpdatePswModal'));
const OpenAIAccountModal = dynamic(() => import('./OpenAIAccountModal'));
const SubDatasetModal = dynamic(() => import('@/components/support/wallet/SubDatasetModal'));

const UserInfo = () => {
  const theme = useTheme();
  const router = useRouter();
  const { feConfigs, systemVersion } = useSystemStore();
  const { t, i18n } = useTranslation();
  const { userInfo, updateUserInfo, initUserInfo } = useUserStore();
  const timezones = useRef(timezoneList());
  const { reset } = useForm<UserUpdateParams>({
    defaultValues: userInfo as UserType
  });

  const { toast } = useToast();
  const {
    isOpen: isOpenPayModal,
    onClose: onClosePayModal,
    onOpen: onOpenPayModal
  } = useDisclosure();
  const {
    isOpen: isOpenUpdatePsw,
    onClose: onCloseUpdatePsw,
    onOpen: onOpenUpdatePsw
  } = useDisclosure();
  const { isOpen: isOpenOpenai, onClose: onCloseOpenai, onOpen: onOpenOpenai } = useDisclosure();
  const {
    isOpen: isOpenSubDatasetModal,
    onClose: onCloseSubDatasetModal,
    onOpen: onOpenSubDatasetModal
  } = useDisclosure();

  const { File, onOpen: onOpenSelectFile } = useSelectFile({
    fileType: '.jpg,.png',
    multiple: false
  });

  const onclickSave = useCallback(
    async (data: UserType) => {
      await updateUserInfo({
        avatar: data.avatar,
        timezone: data.timezone,
        openaiAccount: data.openaiAccount
      });
      reset(data);
      toast({
        title: '更新数据成功',
        status: 'success'
      });
    },
    [reset, toast, updateUserInfo]
  );

  const onSelectFile = useCallback(
    async (e: File[]) => {
      const file = e[0];
      if (!file || !userInfo) return;
      try {
        const src = await compressImgFileAndUpload({
          type: MongoImageTypeEnum.userAvatar,
          file,
          maxW: 300,
          maxH: 300
        });

        onclickSave({
          ...userInfo,
          avatar: src
        });
      } catch (err: any) {
        toast({
          title: typeof err === 'string' ? err : t('common.error.Select avatar failed'),
          status: 'warning'
        });
      }
    },
    [onclickSave, t, toast, userInfo]
  );

  useQuery(['init'], initUserInfo, {
    onSuccess(res) {
      reset(res);
    }
  });

  const {
    data: teamSubPlan = { totalPoints: 0, usedPoints: 0, datasetMaxSize: 800, usedDatasetSize: 0 }
  } = useQuery(['getTeamDatasetValidSub'], getTeamDatasetValidSub);
  const datasetUsageMap = useMemo(() => {
    const rate = teamSubPlan.usedDatasetSize / teamSubPlan.datasetMaxSize;

    const colorScheme = (() => {
      if (rate < 0.5) return 'green';
      if (rate < 0.8) return 'yellow';
      return 'red';
    })();

    return {
      colorScheme,
      value: rate * 100,
      maxSize: teamSubPlan.datasetMaxSize || t('common.Unlimited'),
      usedSize: teamSubPlan.usedDatasetSize
    };
  }, [teamSubPlan.usedDatasetSize, teamSubPlan.datasetMaxSize, t]);

  return (
    
  );
};

export default React.memo(UserInfo);
