import React, { useState } from "react";
import {
  Badge,
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";
import PageScrollImport from "../../../components/PageScrollImport";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import "react-big-calendar/lib/css/react-big-calendar.css";

export const CalendarList = ({ forMOData }) => {
  const [dateStr, setDateStr] = useState("");
  const {
    isOpen: isModal,
    onClose: closeModal,
    onOpen: openModal,
  } = useDisclosure();
  const dayClick = (data) => {
    if (data) {
      setDateStr(data);
      openModal();
    }
  };

  return (
    <Flex bg="form" w="full" p={10}>
      <Box width="full">
        <FullCalendar
          height="84vh"
          dateClick={(data) => dayClick(data.dateStr)}
          plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            right: "prev,next",
            center: "title",
            left: "today,dayGridMonth,dayGridWeek,dayGridDay,listWeek",
          }}
          events={forMOData?.map((item) => {
            return {
              title: `(${item.customerCode}) ${item.customerName}`,
              start: `${moment(item.preparedDate).format("yyyy-MM-DD")}`,
            };
          })}
        />
      </Box>

      {isModal && (
        <ModalOfSchedules
          isOpen={isModal}
          onClose={closeModal}
          forMOData={forMOData}
          dateStr={dateStr}
        />
      )}
    </Flex>
  );
};

const ModalOfSchedules = ({ isOpen, onClose, forMOData, dateStr }) => {
  const TableHead = [
    "Id",
    "Customer Code",
    "Customer Name",
    "Preparation Date",
    "Total Quantity of Orders",
    "Status",
  ];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">
              <Text fontSize="15px">Customer(s)</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody mt={5}>
            <PageScrollImport minHeight="400px" maxHeight="500px">
              <Table size="sm">
                <Thead bgColor="primary">
                  <Tr h="30px">
                    {TableHead?.map((head, i) => (
                      <Th key={i} color="white" fontSize="10px">
                        {head}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {forMOData?.map((item, i) =>
                    moment(item.preparedDate).format("yyyy-MM-DD") ===
                    dateStr ? (
                      <Tr key={i}>
                        {/* <Td fontSize="xs">{item.department}</Td> */}
                        <Td fontSize="xs">{item.id}</Td>
                        <Td fontSize="xs">{item.customerCode}</Td>
                        <Td fontSize="xs">{item.customerName}</Td>
                        <Td fontSize="xs">
                          {moment(item.preparedDate).format("yyyy/MM/DD")}
                        </Td>
                        <Td fontSize="xs">{item.totalOrders}</Td>
                        <Td fontSize="xs">
                          {" "}
                          {item.rush ? (
                            <Badge
                              fontSize="9.5px"
                              colorScheme="orange"
                              variant="solid"
                              className="inputCapital"
                            >
                              Rush
                            </Badge>
                          ) : (
                            ""
                          )}
                        </Td>
                      </Tr>
                    ) : null
                  )}
                </Tbody>
              </Table>
            </PageScrollImport>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
