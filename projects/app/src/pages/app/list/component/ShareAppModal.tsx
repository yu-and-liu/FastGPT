import React, { useCallback, useState, useMemo, useEffect } from 'react';
import {
  Flex,
  Box,
  Button,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  ModalFooter,
  ModalBody,
  Input,
  Switch,
  Link
} from '@chakra-ui/react';
import { useUserStore } from '@/web/support/user/useUserStore';
import {
  getShareChatList,
  delShareChatById,
  createShareChat,
  putShareChat
} from '@/web/support/outLink/api';
import { useForm } from 'react-hook-form';
import type { OutLinkEditType, OutLinkSchema } from '@fastgpt/global/support/outLink/type.d';
import { useRequest } from '@/web/common/hooks/useRequest';
import { OutLinkTypeEnum } from '@fastgpt/global/support/outLink/constant';
import { useTranslation } from 'next-i18next';
import { useToast } from '@/web/common/hooks/useToast';
import { feConfigs } from '@/web/common/system/staticData';
import MyTooltip from '@/components/MyTooltip';
import MyModal from '@/components/MyModal';
import dayjs from 'dayjs';
import { getDocPath } from '@/web/common/system/doc';
// edit link modal
export default function EditLinkModal({
  type,
  onClose,
  onCreate,
  onEdit
}: {
  appId: string;
  type: `${OutLinkTypeEnum}`;
  defaultData: OutLinkEditType;
  onClose: () => void;
  onCreate: (id: string) => void;
  onEdit: () => void;
}) {
  const { t } = useTranslation();
  const {
    register,
    setValue,
    handleSubmit: submitShareChat
  } = useForm({
    defaultValues: {}
  });

  const { mutate: onclickCreate, isLoading: creating } = useRequest({
    mutationFn: async (e: OutLinkEditType) =>
      createShareChat({
        ...e,
        type
      }),
    errorToast: t('common.Create Failed'),
    onSuccess: onCreate
  });
  const { mutate: onclickUpdate, isLoading: updating } = useRequest({
    mutationFn: (e: OutLinkEditType) => {
      return putShareChat(e);
    },
    errorToast: t('common.Update Failed'),
    onSuccess: onEdit
  });

  return (
    <MyModal isOpen={true} iconSrc="/imgs/modal/shareFill.svg" title={t('outlink.Create Link')}>
      <ModalBody>
        <Flex alignItems={'center'}>
          <Box flex={'0 0 90px'}>{t('Name')}</Box>
          <Input
            placeholder={t('outlink.Link Name') || 'Link Name'}
            maxLength={20}
            {...register('name', {
              required: t('common.Name is empty') || 'Name is empty'
            })}
          />
        </Flex>
        {feConfigs?.isPlus && (
          <>
            <Flex alignItems={'center'} mt={4}>
              <Flex flex={'0 0 90px'} alignItems={'center'}>
                QPM
              </Flex>
              <Input
                max={1000}
                {...register('limit.QPM', {
                  min: 0,
                  max: 1000,
                  valueAsNumber: true,
                  required: t('outlink.QPM is empty') || ''
                })}
              />
            </Flex>
            <Flex alignItems={'center'} mt={4}>
              <Flex flex={'0 0 90px'} alignItems={'center'}>
                {t('common.Max credit')}
              </Flex>
              <Input
                {...register('limit.credit', {
                  min: -1,
                  max: 1000,
                  valueAsNumber: true,
                  required: true
                })}
              />
            </Flex>
            <Flex alignItems={'center'} mt={4}>
              <Flex flex={'0 0 90px'} alignItems={'center'}>
                {t('common.Expired Time')}
              </Flex>
              <Input
                type="datetime-local"
                onChange={(e) => {
                  setValue('limit.expiredTime', new Date(e.target.value));
                }}
              />
            </Flex>
            <Flex alignItems={'center'} mt={4}>
              <Flex flex={'0 0 90px'} alignItems={'center'}>
                {t('outlink.token auth')}
              </Flex>
              <Input
                placeholder={t('outlink.token auth Tips') || ''}
                fontSize={'sm'}
                {...register('limit.hookUrl')}
              />
            </Flex>
            <Link
              href={getDocPath('/docs/development/openapi/share')}
              target={'_blank'}
              fontSize={'sm'}
              color={'myGray.500'}
            >
              {t('outlink.token auth use cases')}
            </Link>
          </>
        )}
        <Flex alignItems={'center'} mt={4}>
          <Box flex={'0 0 90px'}>{t('Name')}</Box>
          <Flex flex={'0 0 90px'} alignItems={'center'}></Flex>

          <TagsEdit
            defaultValues={selectedTags}
            teamsTags={teamsTags}
            setSelectedTags={(item: Array<string>) => setSelectedTags(item)}
          />
        </Flex>

        <Flex alignItems={'center'} mt={4}>
          <Flex flex={'0 0 90px'} alignItems={'center'}></Flex>
          <Switch {...register('responseDetail')} size={'lg'} />
        </Flex>
      </ModalBody>

      <ModalFooter>
        <Button variant={'whiteBase'} mr={3} onClick={onClose}>
          {t('common.Close')}
        </Button>
        <Button
          isLoading={creating || updating}
          onClick={submitShareChat((data) => onclickCreate(data))}
        >
          {t('common.Confirm')}
        </Button>
      </ModalFooter>
    </MyModal>
  );
}
