import React from 'react';
import type { FormItemType } from '../type';
import MySelect from '@/components/Select';

const SelectRender = ({ value, list = [], onChange }: FormItemType) => {
  return (
    <MySelect
      width={'100%'}
      value={value}
      list={list}
      onchange={(e) => {
        onChange(e);
      }}
    />
  );
};

export default React.memo(SelectRender);
