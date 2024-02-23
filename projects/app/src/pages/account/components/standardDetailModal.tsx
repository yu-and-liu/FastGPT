import React from 'react';
import {
    ModalBody, Box, Flex, Input, ModalFooter, Button, Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from '@chakra-ui/react';
import MyModal from '@/components/MyModal';
import { useTranslation } from 'next-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLoading } from '@/web/common/hooks/useLoading';
import dayjs from 'dayjs';
import { TeamSubSchema } from '@fastgpt/global/support/wallet/sub/type';
import { getUserStandDardList } from "@/web/support/wallet/sub/api"
import { useSystemStore } from '@/web/common/system/useSystemStore';
import { standardName } from "@fastgpt/global/support/wallet/sub/constants"
const StandDetailModal = ({
    onClose
}: {
    onClose: () => void;
}) => {
    const { t } = useTranslation();
    const { Loading } = useLoading();
    const { gitStar, feConfigs } = useSystemStore();
    const {
        data: standardHistory = [],
        isLoading: isGetting,
        refetch
    } = useQuery(['getUserStandDardList'], async () => getUserStandDardList());



    return (
        <MyModal
            isOpen
            w={'1400px'}
            onClose={onClose}
            iconSrc="acount/plansBlue"
            title={t('user.Standard Detail')}
        >
            <ModalBody>
                <TableContainer mt={2} position={'relative'} minH={'300px'}>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>{t('support.standard.type')}</Th>
                                <Th>{t('support.standard.storage')}</Th>
                                <Th>{t('support.standard.AI Bonus Points')}</Th>
                                <Th>{t('support.standard.Start Time')}</Th>
                                <Th>{t('support.standard.Expired Time')}</Th>
                                <Th />
                            </Tr>
                        </Thead>
                        <Tbody fontSize={'sm'}>
                            {
                                standardHistory.map(({ _id, currentSubLevel, surplusPoints, totalPoints, startTime, expiredTime }) => {
                                    return (
                                        <Tr key={_id}>
                                            <Td>{currentSubLevel}</Td>
                                            <Td>{surplusPoints.toFixed(2)}</Td>
                                            <Td>{totalPoints}</Td>
                                            <Td>{dayjs(startTime).format('YYYY/MM/DD\nHH:mm:ss')}</Td>
                                            <Td>{dayjs(expiredTime).format('YYYY/MM/DD\nHH:mm:ss')}</Td>
                                        </Tr>
                                    )
                                })
                            }
                            <Tr key={'_id'}>
                            </Tr>
                        </Tbody>
                    </Table>
                    <Loading loading={isGetting} fixed={false} />
                </TableContainer>
            </ModalBody>
            <ModalFooter>

            </ModalFooter>
        </MyModal>
    );
};

export default StandDetailModal;
