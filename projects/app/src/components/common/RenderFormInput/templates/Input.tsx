import React, { useTransition } from 'react';
import type { FormItemType } from '../type';
import { Input } from '@chakra-ui/react';

const TextInput = ({ value, placeholder, onChange, maxLen = -1 }: FormItemType) => {
  const [_, startSts] = useTransition();

  return (
    <Input
      placeholder={placeholder}
      value={value}
      maxLength={maxLen}
      onChange={(e) => {
        startSts(() => {
          onChange(e.target.value);
        });
      }}
    />
  );
};

export default React.memo(TextInput);
