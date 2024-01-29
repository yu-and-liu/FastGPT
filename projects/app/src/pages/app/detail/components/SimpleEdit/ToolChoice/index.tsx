import React, { useMemo, useState } from 'react';
import MyModal from '@/components/MyModal';
import { Box, Flex, ModalBody, Button } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { getToolsChoiceList } from '@/web/core/tool/api';
import { useQuery } from '@tanstack/react-query';
import Avatar from '@/components/Avatar';
import { AppSchema } from '@fastgpt/global/core/app/type';
import { FlowNodeInputTypeEnum } from '@fastgpt/global/core/module/node/constant';
import ToolConfigModal, { type ToolConfigType } from './ConfigModal';
import { useConfirm } from '@/web/common/hooks/useConfirm';

const ToolsChoice = ({
  selectTools,
  onChangeTools,
  onClose
}: {
  selectTools: AppSchema['tools'];
  onChangeTools: (tools: AppSchema['tools']) => void;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const { ConfirmModal: ConfirmDeleteToolModal, openConfirm: openConfirmDeleteTool } = useConfirm({
    type: 'delete',
    content: t('core.app.settings.Confirm delete the tool')
  });
  const [toolConfigForm, setToolConfig] = useState<ToolConfigType>();

  const { data: tools = [] } = useQuery(['getToolsChoiceList'], getToolsChoiceList);
  const formatTools = useMemo(
    () =>
      tools.map((tool) => {
        const selectedTool = selectTools.find((selectTool) => selectTool.id === tool.id);
        const inputs = tool.input.inputs.filter(
          (item) => item.type !== FlowNodeInputTypeEnum.target
        );

        return {
          ...tool,
          inputs,
          defaultConfig: selectedTool?.config,
          selected: !!selectedTool
        };
      }),
    [selectTools, tools]
  );

  const onclickAddTool = (tool: (typeof formatTools)[0]) => {
    // direct add
    if (tool.inputs.length === 0) {
      onChangeTools([
        ...selectTools,
        {
          id: tool.id,
          avatar: tool.avatar,
          name: tool.name,
          desc: tool.desc,
          config: {}
        }
      ]);
    } else {
      // open config modal
      setToolConfig({
        id: tool.id,
        inputs: tool.inputs
      });
    }
  };
  const onclickDeleteTool = (tool: (typeof formatTools)[0]) => {
    openConfirmDeleteTool(() => {
      onChangeTools(selectTools.filter((item) => item.id !== tool.id));
    })();
  };
  const onSubmitConfigToolForm = (isEdit: boolean, e: Record<string, any>) => {
    const tool = formatTools.find((item) => item.id === toolConfigForm?.id);
    if (!tool) {
      setToolConfig(undefined);
      return;
    }

    if (isEdit) {
      onChangeTools(
        selectTools.map((item) => {
          if (item.id === toolConfigForm?.id) {
            return {
              ...item,
              config: e
            };
          }
          return item;
        })
      );
    } else {
      onChangeTools([
        ...selectTools,
        {
          id: tool.id,
          avatar: tool.avatar,
          name: tool.name,
          desc: tool.desc,
          config: e
        }
      ]);
    }

    setToolConfig(undefined);
  };

  return (
    <MyModal
      isOpen
      onClose={onClose}
      w={'100%'}
      h={['85vh', '90vh']}
      borderRadius={'lg'}
      title={t('core.app.settings.tools choice')}
      iconSrc="common/navbar/pluginFill"
    >
      <ModalBody py={5} px={7}>
        {formatTools.map((tool) => (
          <Flex
            key={tool.id}
            py={2}
            px={4}
            borderRadius={'md'}
            boxShadow={'1'}
            borderWidth={'1px'}
            alignItems={'center'}
            _notLast={{ mb: 3 }}
            {...(tool.selected
              ? {
                  borderColor: 'primary.300',
                  bg: 'primary.50'
                }
              : {
                  borderColor: 'borderColor.sm'
                })}
          >
            <Avatar src={tool.avatar} w={'22px'} />
            <Box flex={'1 0 0'} mx={2}>
              <Box fontSize={'lg'} color={'black'}>
                {tool.name}
              </Box>
              <Box
                flex={'1'}
                flexShrink={0}
                className="textEllipsis3"
                fontSize={'sm'}
                color={'myGray.600'}
              >
                {tool.desc}
              </Box>
            </Box>

            {!!tool.selected ? (
              <Box>
                {tool.inputs.length > 0 && (
                  <Box mb={2}>
                    <Button
                      size={'sm'}
                      variant={'primaryOutline'}
                      onClick={() => {
                        setToolConfig({
                          id: tool.id,
                          inputs: tool.inputs,
                          defaultForm: tool.defaultConfig || {}
                        });
                      }}
                    >
                      {t('core.app.settings.Update tool config')}
                    </Button>
                  </Box>
                )}
                <Box>
                  <Button
                    size={'sm'}
                    variant={'whiteDanger'}
                    onClick={() => onclickDeleteTool(tool)}
                  >
                    {t('common.Delete')}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Button size={'sm'} variant={'primaryOutline'} onClick={() => onclickAddTool(tool)}>
                {t('common.Add')}
              </Button>
            )}
          </Flex>
        ))}
      </ModalBody>

      {!!toolConfigForm && (
        <ToolConfigModal
          {...toolConfigForm}
          onClose={() => setToolConfig(undefined)}
          onSubmit={onSubmitConfigToolForm}
        />
      )}
      <ConfirmDeleteToolModal />
    </MyModal>
  );
};

export default React.memo(ToolsChoice);
