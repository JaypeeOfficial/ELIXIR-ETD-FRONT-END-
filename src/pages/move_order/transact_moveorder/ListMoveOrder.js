import React from "react";
import {
  Button,
  Checkbox,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import PageScroll from "../../../utils/PageScroll";
import moment from "moment";
// import { ViewModal } from './Action-Modals-Transact'
import { decodeUser } from "../../../services/decode-user";
import { ViewModal } from "./ActionModalTransact";

const currentUser = decodeUser();

export const ListMoveOrder = ({
  moveOrderList,
  setMoveOrderInformation,
  moveOrderInformation,
  moveOrderViewTable,
  checkedItems,
  setCheckedItems,
  status,
}) => {
  const {
    isOpen: isView,
    onClose: closeView,
    onOpen: openView,
  } = useDisclosure();

  const viewHandler = ({
    orderNo,
    deliveryStatus,
    customerName,
    customerCode,
  }) => {
    // Add delivery status for condition
    if (orderNo && customerName && customerCode) {
      setMoveOrderInformation({
        orderNo: orderNo,
        deliveryStatus: "Pick-Up",
        customerName: customerName,
        customerCode: customerCode,
      });
      openView();
    } else {
      setMoveOrderInformation({
        orderNo: "",
        deliveryStatus: "",
        customerName: "",
        customerCode: "",
      });
    }
  };

  // const moveOrderData = moveOrderList?.filter(item => item.stockOnHand >= item.quantityOrder)
  const submitData = moveOrderList?.map((item) => {
    return {
      orderNo: item.orderNo,
      // farmType: item.farmType,
      customerName: item.customerName,
      customerCode: item.customerCode,
      orderNoPKey: item.orderNoPKey,
      isApprove: item.isApproved,
      preparedBy: currentUser?.userName,
    };
  });
  // console.log(moveOrderData)

  const parentCheckHandler = (e) => {
    if (e.target.checked) {
      setCheckedItems(submitData);
    } else {
      setCheckedItems([]);
    }
  };

  // console.log(moveOrderList)
  const childCheckHandler = (e) => {
    const data = JSON.parse(e.target.value);
    let valueSubmit = {
      orderNo: data.orderNo,
      // farmType: data.farmType,
      customerName: data.customerName,
      customerCode: data.customerCode,
      // orderNoPKey: data.orderNoPKey,
      isApprove: data.isApproved,
      preparedBy: currentUser?.userName,
    };
    if (e.target.checked) {
      setCheckedItems([...checkedItems, valueSubmit]);
    } else {
      const filterData = checkedItems?.filter(
        (item) => item.orderNo !== valueSubmit.orderNo
      );
      setCheckedItems(filterData);
    }
  };

  return (
    <>
      <Flex w="full" flexDirection="column">
        <VStack spacing={0}>
          <Text
            pb={2}
            textAlign="center"
            fontSize="md"
            color="white"
            bgColor="primary"
            w="full"
            mb={-1.5}
          >
            List of Move Order
          </Text>
          <PageScroll minHeight="770px " maxHeight="790px">
            <Table size="sm" variant="simple">
              <Thead bgColor="secondary">
                <Tr>
                  <Th color="white" fontSize="10px">
                    <Checkbox
                      size="sm"
                      fontSize="10px"
                      onChange={parentCheckHandler}
                      isChecked={submitData?.length === checkedItems?.length}
                      isDisabled={status}
                      title={status ? "Order already transacted" : ""}
                      color="white"
                    >
                      Line
                    </Checkbox>
                  </Th>
                  <Th color="white" fontSize="11px">
                    Order Id
                  </Th>
                  <Th color="white" fontSize="11px">
                    Customer Code
                  </Th>
                  <Th color="white" fontSize="11px">
                    Customer Name
                  </Th>
                  {/* <Th color='white' fontSize="11px">Category</Th> */}
                  <Th color="white" fontSize="11px">
                    Total Quantity Order
                  </Th>
                  {/* <Th color='white'>Order Date</Th> */}
                  <Th color="white" fontSize="11px">
                    Date Needed
                  </Th>
                  <Th color="white" fontSize="11px">
                    Prepared Date
                  </Th>
                  <Th color="white" fontSize="11px">
                    View
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {moveOrderList?.map((list, i) => (
                  <Tr key={i} cursor="pointer">
                    <Td>
                      <Checkbox
                        size="sm"
                        // onChange={() => childCheckHandler(list)}
                        onChange={childCheckHandler}
                        isChecked={checkedItems.some(
                          (item) => item.orderNo === list.orderNo
                        )}
                        value={JSON.stringify(list)}
                        color="black"
                        isDisabled={status}
                        title={status ? "Order already transacted" : ""}
                      >
                        {i + 1}
                      </Checkbox>
                    </Td>
                    <Td fontSize="11px">{list.orderNo}</Td>
                    <Td fontSize="11px">{list.customerCode}</Td>
                    <Td fontSize="11px">{list.customerName}</Td>
                    {/* <Td fontSize="11px">{list.category}</Td> */}
                    <Td fontSize="11px">{list.totalOrders}</Td>
                    {/* <Td>{list.orderDate}</Td> */}
                    <Td fontSize="11px">{list.dateNeeded}</Td>
                    <Td fontSize="11px">
                      {moment(list.preparedDate).format("MM/DD/yyyy")}
                    </Td>
                    <Td fontSize="11px">
                      <Button
                        size="xs"
                        colorScheme="blue"
                        borderRadius="none"
                        onClick={() => viewHandler(list)}
                      >
                        View
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </PageScroll>
        </VStack>
      </Flex>
      {isView && (
        <ViewModal
          isOpen={isView}
          onClose={closeView}
          moveOrderInformation={moveOrderInformation}
          moveOrderViewTable={moveOrderViewTable}
        />
      )}
    </>
  );
};
