import React from 'react';
import type { FormItemType } from '../type';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
} from '@chakra-ui/react';

const NumberInputRender = ({ value, min, max, onChange }: FormItemType) => {
  return (
    <NumberInput
      value={value}
      min={min}
      max={max}
      onChange={(e) => {
        onChange(Number(e));
      }}
    >
      <NumberInputField min={min} max={max} />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};

export default React.memo(NumberInputRender);
