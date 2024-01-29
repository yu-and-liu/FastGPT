import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { TableContainer, Table, Thead, Tr, Th, Td, Link, Button } from '@chakra-ui/react';
import { useUserStore } from '@/web/support/user/useUserStore';
const ShareBox = (teamTags: Array<any>) => {
  const { userInfo, initUserInfo } = useUserStore();

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>名称</Th>
            <Th>金钱消耗</Th>
            <Th isNumeric>返回引用</Th>
            <Th isNumeric>IP限流(人/分钟)</Th>
            <Th isNumeric>过期时间</Th>
            <Th isNumeric>身份验证</Th>
            <Th isNumeric>操作</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>inches</Td>
            <Td>millimetres (mm)</Td>
            <Td isNumeric>25.4</Td>
            <Td isNumeric>25.4</Td>
            <Td isNumeric>25.4</Td>
            <Td isNumeric>25.4</Td>
            <Td isNumeric>25.4</Td>
            <Td isNumeric></Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ShareBox;
