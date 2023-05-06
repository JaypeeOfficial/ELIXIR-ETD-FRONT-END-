import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  Table,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  Tbody,
  Td,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { TiArrowSync } from "react-icons/ti";
import PageScrollImport from "../../../components/PageScrollImport";
import { FiSearch } from "react-icons/fi";
import PageScroll from "../../../utils/PageScroll";
import { ToastComponent } from "../../../components/Toast";
import Swal from "sweetalert2";
import request from "../../../services/ApiClient";
import moment from "moment";
import { ErrorCustomers } from "./ErrorCustomers";
// import OrdersConfirmation from "./OrdersConfirmation";

export const ListOfCustomers = ({
  genusCustomers,
  fetchingData,
  elixirCustomers,
  fetchElixirCustomers,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [errorData, setErrorData] = useState([]);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ARRAY FOR THE LIST DATA OF SUPPLIERS
  const resultArray = genusCustomers?.result?.map((item) => {
    return {
      customer_No: item?.id,
      customerCode: item?.account_code,
      customerName: item?.account_name,
      companyCode: item?.company_code,
      companyName: item?.company,
      departmentCode: item?.department_code,
      departmentName: item?.department,
      locationCode: item?.location_code,
      locationName: item?.location,
    };
  });

  // SYNC ORDER BUTTON
  const syncHandler = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to sync these customers?",
      icon: "info",
      color: "white",
      background: "#1B1C1D",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#CBD1D8",
      confirmButtonText: "Yes",
      heightAuto: false,
      width: "40em",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const res = request
            .put(
              `Customer/AddNewCustomer`,
              resultArray.map((item) => {
                return {
                  customer_No: item?.customer_No,
                  customerCode: item?.customerCode,
                  customerName: item?.customerName,
                  companyCode: item?.customerCode,
                  companyName: item?.companyName,
                  departmentCode: item?.departmentCode,
                  departmentName: item?.departmentName,
                  locationCode: item?.locationCode,
                  locationName: item?.locationName,
                };
              })
            )
            .then((res) => {
              ToastComponent("Success", "Customer Synced!", "success", toast);
              fetchElixirCustomers();
              // fetchNotification();
              // onClose();
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
              setErrorData(err.response.data);
              if (err.response.data) {
                // onClose();
                onOpen();
              }
            });
        } catch (error) {}
      }
    });
  };

  return (
    <Flex
      color="fontColor"
      h="auto"
      w="full"
      flexDirection="column"
      p={2}
      bg="form"
      boxShadow="md"
    >
      <Flex p={2} flexDirection="column">
        <Flex justifyContent="space-between" w="100%" p={4} mt={-3}>
          <HStack>
            {/* <Text>Search</Text> */}
            <InputGroup size="sm">
              <InputLeftElement
                pointerEvents="none"
                children={<FiSearch bg="black" fontSize="18px" />}
              />
              <Input
                w="230px"
                fontSize="13px"
                size="sm"
                type="text"
                placeholder="Search: ex. Customer Name"
                onChange={(e) => setKeyword(e.target.value)}
                disabled={isLoading}
                borderColor="gray.200"
                _hover={{ borderColor: "gray.400" }}
              />
            </InputGroup>
          </HStack>

          <HStack>
            <Button
              colorScheme="blue"
              size="sm"
              fontSize="13px"
              borderRadius="none"
              isLoading={isLoading}
              disabled={isLoading}
              leftIcon={<TiArrowSync fontSize="19px" />}
              onClick={() => syncHandler()}
            >
              Sync
            </Button>
          </HStack>
        </Flex>

        <Flex p={4}>
          <VStack bg="primary" alignItems="center" w="100%" p={1} mt={-7}>
            <Text color="white" fontSize="13px" textAlign="center">
              LIST OF CUSTOMERS
            </Text>
          </VStack>
        </Flex>

        <Flex p={4}>
          <VStack w="100%" mt={-8}>
            <PageScroll>
              {fetchingData ? (
                <Stack width="full">
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                  <Skeleton height="20px" />
                </Stack>
              ) : (
                <Table
                  size="sm"
                  //   width="full"
                  // height="100%"
                  border="none"
                  boxShadow="md"
                  bg="gray.200"
                  variant="striped"
                >
                  <Thead bg="secondary" position="sticky" top={0}>
                    <Tr h="30px">
                      <Th color="#D6D6D6" fontSize="10px">
                        ID
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Customer No.
                      </Th>
                      {/* <Th color="#D6D6D6" fontSize="10px" pl="100px">
                               
                              </Th> */}
                      <Th color="#D6D6D6" fontSize="10px">
                        Customer Code
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Customer Name
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Company
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {elixirCustomers?.customer
                      ?.filter((val) => {
                        const newKeyword = new RegExp(
                          `${keyword.toLowerCase()}`
                        );
                        return val?.customerName
                          ?.toLowerCase()
                          .match(newKeyword, "*");
                      })
                      ?.map((comp, i) => (
                        <Tr key={i}>
                          <Td fontSize="12px">{i + 1}</Td>
                          <Td fontSize="12px">{comp.id}</Td>
                          {/* <Td fontSize="12px" pl="100px"></Td> */}
                          <Td fontSize="12px">{comp.customerCode}</Td>
                          <Td fontSize="12px">{comp.customerName}</Td>
                          <Td fontSize="12px">{comp.companyName}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              )}
            </PageScroll>
          </VStack>
        </Flex>

        <Flex>
          <HStack>
            <Badge colorScheme="cyan">
              <Text color="secondary">
                Number of Records: {elixirCustomers?.customer?.length}
              </Text>
            </Badge>
          </HStack>
        </Flex>

        {isOpen && (
          <ErrorCustomers
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            resultArray={resultArray}
            errorData={errorData}
            setErrorData={setErrorData}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
      </Flex>
    </Flex>
  );
};