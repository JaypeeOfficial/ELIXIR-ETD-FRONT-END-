import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, Table, Tbody, Td, Th, Thead, Tr, useToast, VStack, HStack, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import request from '../../../services/ApiClient'
import PageScroll from '../../../utils/PageScroll'
import moment from 'moment'
import { EditModal } from './ActionModalBorrowed'

export const ViewModal = ({ isOpen, onClose, statusBody }) => {

    // console.log(statusBody)
    const { isOpen: isEdit, onOpen: openEdit, onClose: closeEdit, } = useDisclosure();

    const [borrowedDetailsData, setBorrowedDetailsData] = useState([])
    const [editData, setEditData] = useState({
        id: "",
        itemCode: "",
        itemDescription: "",
        returnQuantity: "",
        consumes: "",
        quantity: "",
    })

    const id = statusBody.id
    const fetchBorrowedDetailsApi = async (id) => {
        const res = await request.get(`Borrowed/GetAllDetailsInBorrowedIssue?id=${id}`)
        return res.data
    }

    const fetchBorrowedDetails = () => {
        fetchBorrowedDetailsApi(id).then(res => {
            setBorrowedDetailsData(res)
        })
    }

    useEffect(() => {
        fetchBorrowedDetails()
    }, [id])

    const editHandler = ({
        id,
        itemCode,
        itemDescription,
        returnQuantity,
        consumes,
        quantity
      }) => {
        if ( id && itemCode && itemDescription && returnQuantity >= 0 && consumes >=0 && quantity ) {
          setEditData({
            id: id,
            itemCode: itemCode,
            itemDescription: itemDescription,
            returnQuantity: returnQuantity,
            consumes: consumes,
            quantity: quantity,
          });
          openEdit();
        } else {
          setEditData({
            id: "",
            itemCode: "",
            itemDescription: "",
            returnQuantity: "",
            consumes: "",
            quantity: "",
          });
        }
      };

    return (
        <Modal isOpen={isOpen} onClose={() => { }} size='5xl' isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader mt={5} fontSize='md'>
                    <Flex fontSize='sm' justifyContent='center'><Text>Borrowed Details</Text></Flex>
                    <Flex justifyContent='space-between'>
                        <VStack alignItems='start' spacing={-1}>
                            <Text fontSize="xs">Customer Code: {borrowedDetailsData[0]?.customerCode}</Text>
                            <Text fontSize="xs">Customer Name: {borrowedDetailsData[0]?.customer}</Text>
                            <Text fontSize="xs">Details: {borrowedDetailsData[0]?.remarks}</Text>
                        </VStack>
                        <VStack alignItems='start' spacing={-1}>
                            <Text fontSize="xs">Transaction ID: {borrowedDetailsData[0]?.borrowedPKey}</Text>
                            <Text fontSize="xs">Transaction Date: {moment(borrowedDetailsData[0]?.borrowedDate).format('yyyy-MM-DD')}</Text>
                            <Text fontSize="xs">Transact By: {borrowedDetailsData[0]?.preparedBy}</Text>
                        </VStack>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody mb={5}>
                    <Flex justifyContent='center'>
                        <PageScroll minHeight='350px' maxHeight='351px'>
                            <Table size='sm'>
                                <Thead bgColor='secondary'>
                                    <Tr>
                                        <Th color='white' fontSize="xs">Id</Th>
                                        <Th color='white' fontSize="xs">Item Code</Th>
                                        <Th color='white' fontSize="xs">Item Description</Th>
                                        <Th color='white' fontSize="xs">Borrowed Qty</Th>
                                        <Th color='white' fontSize="xs">Consumed</Th>
                                        <Th color='white' fontSize="xs">Returned Qty</Th>
                                        <Th color='white' fontSize="xs">Action</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        borrowedDetailsData?.map((borrowdetails, i) =>
                                            <Tr key={i}>
                                                <Td fontSize="xs">{borrowdetails.id}</Td>
                                                <Td fontSize="xs">{borrowdetails.itemCode}</Td>
                                                <Td fontSize="xs">{borrowdetails.itemDescription}</Td>
                                                <Td fontSize="xs">
                                                    {borrowdetails.quantity.toLocaleString(undefined, {
                                                    maximumFractionDigits: 2,
                                                    minimumFractionDigits: 2,
                                                    })}
                                                </Td>
                                                <Td fontSize="xs">                                                    
                                                    {borrowdetails.consumes.toLocaleString(undefined, {
                                                    maximumFractionDigits: 2,
                                                    minimumFractionDigits: 2,
                                                    })}</Td>
                                                <Td fontSize="xs">
                                                    {borrowdetails.returnQuantity.toLocaleString(undefined, {
                                                    maximumFractionDigits: 2,
                                                    minimumFractionDigits: 2,
                                                    })}
                                                </Td>
                                                <Td>

                                                    <Button
                                                        onClick={() => editHandler(borrowdetails)}
                                                        // disabled={
                                                        //     borrowdetails.returnQuantity === borrowdetails.quantity
                                                        // }
                                                        colorScheme='blue' size='xs'
                                                    >
                                                        Return
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        )
                                    }
                                </Tbody>
                            </Table>
                        </PageScroll>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <ButtonGroup size='sm'>
                        
                        <Button colorScheme='gray' onClick={onClose}>Close</Button>
                        {/* <Button colorScheme='blue' onClick={onClose}>Submit</Button> */}
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
            
            {isEdit && (
                <EditModal
                isOpen={isEdit}
                onClose={closeEdit}
                editData={editData}
                fetchBorrowedDetails={fetchBorrowedDetails}
                />
            )}

        </Modal>
    )
}