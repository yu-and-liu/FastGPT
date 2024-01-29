import MyModal from '@/components/MyModal';
import { Box, Button, ModalBody, ModalFooter } from '@chakra-ui/react';
import { FlowNodeInputItemType } from '@fastgpt/global/core/module/node/type';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useForm } from 'react-hook-form';
import RenderFormInput from '@/components/common/RenderFormInput';

export type ToolConfigType = {
  id: string;
  inputs: FlowNodeInputItemType[];
  defaultForm?: Record<string, any>;
};

const ToolConfigModal = ({
  id,
  inputs,
  defaultForm,
  onClose,
  onSubmit
}: ToolConfigType & {
  onClose: () => void;
  onSubmit: (isEdit: boolean, e: Record<string, any>) => void;
}) => {
  const { t } = useTranslation();

  const { getValues, setValue, handleSubmit } = useForm({
    defaultValues: defaultForm || {}
  });

  console.log(inputs);

  return (
    <MyModal
      isOpen
      onClose={onClose}
      iconSrc={'common/settingLight'}
      title={t('core.app.settings.tool params config')}
    >
      <ModalBody>
        {inputs.map((input) => (
          <Box key={input.key} _notLast={{ mb: 2 }}>
            <RenderFormInput
              {...input}
              value={getValues(input.key)}
              onChange={(val) => {
                setValue(input.key, val);
              }}
            />
          </Box>
        ))}
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleSubmit((data) => onSubmit(!!defaultForm, data))}>
          {t('common.Confirm')}
        </Button>
      </ModalFooter>
    </MyModal>
  );
};

export default React.memo(ToolConfigModal);
