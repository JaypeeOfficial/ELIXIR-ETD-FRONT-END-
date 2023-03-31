import React, { useEffect, useRef, useState } from 'react';
import { Button, Flex, HStack, useDisclosure, VStack } from '@chakra-ui/react';
import request from '../../services/ApiClient';
import { BorrowedInformation } from './BorrowedInformation';
import { ListOfBorrowed } from './ListOfBorrowed';
import { ViewListBorrowed } from './viewingBorrowed/ViewListBorrowed';
import { ActionButton } from './ActionButton';
// import { MaterialsInformation } from './MaterialsInformation';
// import { ListOfIssue } from './ListOfIssue';
// import { ActionButton } from './ActionButton';
// import { ViewListIssue } from './viewingMiscIssue/ViewListIssue';

const fetchCustomersApi = async () => {
  const res = await request.get(`Customer/GetAllActiveCustomers`)
  return res.data
}
const fetchRawMatsApi = async () => {
  const res = await request.get(`Material/GetAllActiveMaterials`)
  return res.data
}
const fetchBarcodeNoApi = async (itemCode) => {
  const res = await request.get(`Miscellaneous/GetAllAvailableStocksForMIsssue?itemcode=${itemCode}`)
  return res.data
}

const BorrowedMaterialsPage = ({ borrowedData, fetchActiveBorrowed, borrowedNav, setBorrowedNav }) => {
  const [isLoading, setIsLoading] = useState(false)

  const customerRef = useRef()
  const remarksRef = useRef()

  const [customers, setCustomers] = useState([])
  const [rawMats, setRawMats] = useState([])

  const [barcodeNo, setBarcodeNo] = useState([])

  const [totalQuantity, setTotalQuantity] = useState('')
  const [customerData, setCustomerData] = useState({
    customerCode: '',
    customerName: '',
  })

  const [warehouseId, setWarehouseId] = useState('')
  const [rawMatsInfo, setRawMatsInfo] = useState({
    itemCode: '',
    itemDescription: '',
    uom: '',
    customerName: '',
    warehouseId: '',
    quantity: ''
  })
  const [details, setDetails] = useState('')
  const [remarks, setRemarks] = useState('')

  const itemCode = rawMatsInfo.itemCode

  const [selectorId, setSelectorId] = useState('')

  //Customer Fetching
  const fetchCustomers = () => {
    fetchCustomersApi().then(res => {
      setCustomers(res)
    })
  }

  useEffect(() => {
    fetchCustomers()

    return () => {
      setCustomers([])
    }
  }, [])

  //Raw Mats Fetching
  const fetchRawMats = () => {
    fetchRawMatsApi().then(res => {
      setRawMats(res)
    })
  }

  useEffect(() => {
    fetchRawMats()

    return () => {
      setRawMats([])
    }
  }, [])

  //Barcode (Warehouse ID)
  const fetchBarcodeNo = () => {
    fetchBarcodeNoApi(itemCode).then(res => {
      setBarcodeNo(res)
    })
  }

  useEffect(() => {
    fetchBarcodeNo()

    return () => {
      setBarcodeNo([])
    }
  }, [itemCode, borrowedNav])

  //Refetch on change navigation
  useEffect(() => {
    if (borrowedNav) {
      fetchCustomers()
      fetchRawMats()
      fetchBarcodeNo()
    }
  }, [borrowedNav])

  return (

    <Flex px={5} pt={5} pb={0} w='full' flexDirection='column' bg="form">

      <Flex w='full' justifyContent='space-between'>
        <HStack spacing={0}>
          <Button
            bgColor={borrowedNav === 1 ? 'primary' : ''}
            color={borrowedNav === 1 ? 'white' : ''}
            _hover={{ bgColor: 'btnColor', color: 'white' }}
            border='1px' borderColor='gray.300' size='sm'
            fontSize="xs"
            onClick={() => setBorrowedNav(1)}
          >
            Add Borrow Materials
          </Button>
          <Button
            bgColor={borrowedNav === 2 ? 'primary' : ''}
            color={borrowedNav === 2 ? 'white' : ''}
            _hover={{ bgColor: 'btnColor', color: 'white' }}
            border='1px' borderColor='gray.300' size='sm'
            fontSize="xs"
            onClick={() => setBorrowedNav(2)}
          >
            View Borrowed Materials
          </Button>
        </HStack>
      </Flex>

      <VStack w='full' p={5} spacing={10} height={borrowedData?.length === 0 ? '87vh' : 'auto'}>
        {
          borrowedNav === 1 ?

            <>
              <BorrowedInformation
                rawMatsInfo={rawMatsInfo} setRawMatsInfo={setRawMatsInfo}
                details={details} setDetails={setDetails}
                customers={customers} rawMats={rawMats} 
                barcodeNo={barcodeNo}
                setSelectorId={setSelectorId}
                setCustomerData={setCustomerData}
                warehouseId={warehouseId} setWarehouseId={setWarehouseId}
                fetchActiveBorrowed={fetchActiveBorrowed}
                customerData={customerData}
                customerRef={customerRef}
                remarks={remarks} setRemarks={setRemarks} remarksRef={remarksRef}
              />
              {
                borrowedData?.length > 0
                  ?
                  <>
                    <ListOfBorrowed
                      selectorId={selectorId} setSelectorId={setSelectorId}
                      setTotalQuantity={setTotalQuantity}
                      borrowedData={borrowedData}
                      fetchActiveBorrowed={fetchActiveBorrowed}
                      fetchBarcodeNo={fetchBarcodeNo}
                      remarks={remarks}
                    />
                    <ActionButton
                      setIsLoading={setIsLoading}
                      isLoading={isLoading}
                      totalQuantity={totalQuantity} setTotalQuantity={setTotalQuantity}
                      customerData={customerData}
                      details={details}
                      selectorId={selectorId} setSelectorId={setSelectorId}
                      borrowedData={borrowedData}
                      fetchActiveBorrowed={fetchActiveBorrowed}
                      customerRef={customerRef}
                      setDetails={setDetails}
                      setRawMatsInfo={setRawMatsInfo}
                      //warehouse Id
                      warehouseId={warehouseId}
                      fetchBarcodeNo={fetchBarcodeNo}
                      remarks={remarks} setRemarks={setRemarks} remarksRef={remarksRef}
                    />
                  </>
                  : ''
              }
            </>

            : borrowedNav === 2 ?
              <>
                <ViewListBorrowed />
              </>
              :
              ''
        }
      </VStack>

    </Flex>
  )
}

export default BorrowedMaterialsPage
