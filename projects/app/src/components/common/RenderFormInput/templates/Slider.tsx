import React, { useTransition } from 'react';
import type { FormItemType } from '../type';
import { useTranslation } from 'next-i18next';
import { Box } from '@chakra-ui/react';
import MySlider from '@/components/Slider';

const SliderRender = ({ markList, min = 0, max, step = 1, value, onChange }: FormItemType) => {
  const { t } = useTranslation();
  const [_, startSts] = useTransition();
  return (
    <Box pt={5} pb={4} px={2}>
      <MySlider
        markList={markList}
        width={'100%'}
        min={min || 0}
        max={max}
        step={step || 1}
        value={value}
        onChange={(e) => {
          startSts(() => {
            onChange(e);
          });
        }}
      />
    </Box>
  );
};

export default React.memo(SliderRender);
