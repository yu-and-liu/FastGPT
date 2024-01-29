import React from 'react';
import type { FormItemType } from '../type';
import { Switch } from '@chakra-ui/react';

const SwitchRender = ({ value, onChange }: FormItemType) => {
  return (
    <Switch
      size={'lg'}
      isChecked={value}
      onChange={(e) => {
        onChange(e.target.checked);
      }}
    />
  );
};

export default React.memo(SwitchRender);
