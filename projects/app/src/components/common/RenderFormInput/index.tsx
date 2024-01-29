import React, { useMemo } from 'react';
import { FormItemType } from './type';
import { RenderTypeEnum } from './constants';
import dynamic from 'next/dynamic';
import { Box, Flex } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import MyTooltip from '@/components/MyTooltip';
import { QuestionOutlineIcon } from '@chakra-ui/icons';

const RenderList: {
  types: `${RenderTypeEnum}`[];
  Component: React.ComponentType<FormItemType>;
}[] = [
  {
    types: [RenderTypeEnum.input],
    Component: dynamic(() => import('./templates/Input'))
  },
  {
    types: [RenderTypeEnum.textarea],
    Component: dynamic(() => import('./templates/Textarea'))
  },
  {
    types: [RenderTypeEnum.numberInput],
    Component: dynamic(() => import('./templates/NumberInput'))
  },
  {
    types: [RenderTypeEnum.switch],
    Component: dynamic(() => import('./templates/Switch'))
  },
  {
    types: [RenderTypeEnum.select],
    Component: dynamic(() => import('./templates/Select'))
  },
  {
    types: [RenderTypeEnum.slider],
    Component: dynamic(() => import('./templates/Slider'))
  }
];

const RenderForm = (props: FormItemType) => {
  const { t } = useTranslation();
  const { type, label, description, required, ...item } = props;

  const RenderInput = useMemo(() => {
    const Component = RenderList.find((item) => item.types.includes(type))?.Component;
    if (!Component) return null;
    return <Component {...props} />;
  }, [props, type]);

  return (
    <>
      {/* label */}
      <Flex>
        <Box position={'relative'} mb={1}>
          {t(label)}
          {description && (
            <MyTooltip label={t(description)} forceShow>
              <QuestionOutlineIcon display={['none', 'inline']} ml={1} />
            </MyTooltip>
          )}
          {required && (
            <Box
              position={'absolute'}
              top={'-2px'}
              right={'-8px'}
              color={'red.500'}
              fontWeight={'bold'}
            >
              *
            </Box>
          )}
        </Box>
      </Flex>
      {RenderInput}
    </>
  );
};

export default React.memo(RenderForm);
