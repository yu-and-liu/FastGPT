import React, { useTransition } from 'react';
import type { FormItemType } from '../type';
import { useTranslation } from 'next-i18next';
import MyTextarea from '../../Textarea/MyTextarea';

const TextareaRender = ({ label, placeholder = '', value, onChange }: FormItemType) => {
  const { t } = useTranslation();
  const [, startTst] = useTransition();

  return (
    <MyTextarea
      title={t(label)}
      h={150}
      placeholder={t(placeholder)}
      defaultValue={value}
      onChange={(e) => {
        startTst(() => {
          onChange(e.target.value);
        });
      }}
    />
  );
};

export default React.memo(TextareaRender);
