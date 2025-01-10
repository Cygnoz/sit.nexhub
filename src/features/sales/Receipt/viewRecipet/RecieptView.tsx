import {  useNavigate, useParams } from 'react-router-dom';
// import Button from '../../../../Components/Button';
import CheveronLeftIcon from '../../../../assets/icons/CheveronLeftIcon';
// import PencilEdit from '../../../../assets/icons/PencilEdit';
import PdfView from './PdfView';
import { useEffect, useState } from 'react';
import useApi from '../../../../Hooks/useApi';
import { endponits } from '../../../../Services/apiEndpoints';
import { useOrganization } from '../../../../context/OrganizationContext';
import SideBar from './SideBar';

type Props = {};

function RecieptView({}: Props) {
  const[RecieptData,setRecieptData]=useState<[]|any>([])
  const [invoiceJournal, setInvoiceJournal] = useState<any>([])
  const {request:getReciept}=useApi("get",5007)
  const { organization } = useOrganization()


  const {id}=useParams()
  const navigate = useNavigate()
  const handleGoBack =()=>{
    navigate(-1)
  }

  const getReciepts = async () => {
    try {
      const url = `${endponits.GET_ONE_SALES_RECIEPT}/${id}`;
      const apiResponse = await getReciept(url);
      const { response, error } = apiResponse;
      if (!error && response) {
        setRecieptData(response.data);
        console.log(response.data,"as");
        
      } else {
        console.error('API Error:', error?.response?.data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };
  const { request: getOneRecieptJournal } = useApi("get", 5007);
  const fetchOneInvoice = async () => {
    try {
      const url = `${endponits.GET_SALES_RECIEPT_JOURNAL}/${id}`;
      const { response, error } = await getOneRecieptJournal(url);
      if (!error && response) {
        setInvoiceJournal(response.data);
        console.log(response.data,"journla");
      }
    } catch (error) {
      console.error("Error fetching sales order:", error);
    }
  };

  useEffect(()=>{
    getReciepts()
    fetchOneInvoice()
  },[])

  return (
    <div className="p-6 text-pdftext bg-white rounded-lg mx-7">
      <div className="flex items-center space-x-2 mb-4">
          <div
            onClick={handleGoBack}
            style={{ borderRadius: "50%" }}
            className="w-[40px] h-[40px] flex items-center justify-center bg-[#F6F6F6]"
          >
            <CheveronLeftIcon />
          </div>
        <h1 className="text-[20px] font-bold text-[#303F58]">View Reciept</h1>
      </div>
      <div className="flex justify-between items-center">
        <div className="space-x-3 items-center flex text-[#303F58] font-bold text-[16px] mb-4">
          <h3>Reciept</h3>
          <h3 className="font-normal">|</h3>
          <h3>{RecieptData?.payment}</h3>
          <p className="w-[47px] h-[25px] bg-[#F3F3F3] rounded-lg flex items-center justify-center">Draft</p>
        </div>
        {/* <div className="flex space-x-3 mb-4">
          <Button className="h-[38px] w-[100px] flex justify-center items-center" variant="secondary">
            <PencilEdit color="black" />
            Edit
          </Button>
          <Button className="h-[38px] w-[100px] flex justify-center items-center" variant="secondary">
            <PencilEdit color="black" />
            Email
          </Button>
          <select
            className="border border-[#565148] h-[38px] w-auto pl-3 pr-4 rounded-md bg-[#FEFDFA] font-semibold text-gray-800"
            style={{ color: "#585953" }}
          >
            <option>More Actions</option>
            <option>Delete</option>
          </select>
        </div> */}
      </div>
      <hr className="mb-5 border-loremcolor" />
      <div className="grid grid-cols-3 space-x-4">
        {/* Sidebar */}
       <SideBar data={RecieptData}/>
        {/* Main content */}
        <div className='col-span-2'>
        <PdfView data={RecieptData} organization={organization}/>
        </div>
      </div>
      <div>
      <>
          {/* Invoice Details */}
          <div className="p-4 rounded-lg bg-[#F6F6F6] mt-6">
            <h2 className="font-semibold text-base mb-4 text-textColor">Invoice</h2>

            <div className="grid grid-cols-3 font-bold gap-x-4 text-base text-dropdownText mb-2">
              <div>Account</div>
              <div className="text-right">Debit</div>
              <div className="text-right">Credit</div>
            </div>

            {/* Mapping over invoiceJournal to display each row */}
            {invoiceJournal.map((item: any) => (
              <div key={item._id} className="grid grid-cols-3 text-dropdownText gap-x-4 text-base mb-2">
                <div className="text-sm">{item.accountName}</div>
                <div className="text-right">{item.debitAmount.toFixed(2)}</div>
                <div className="text-right">{item.creditAmount.toFixed(2)}</div>
              </div>
            ))}

            {/* Total Row */}
            <div className="grid grid-cols-3 gap-x-4 text-lg font-bold text-[#0B1320] mt-5">
              <div className="text-base">Total</div>
              <div className="text-right">
                {invoiceJournal.reduce((total: any, item: any) => total + item.debitAmount, 0).toFixed(2)}
              </div>
              <div className="text-right">
                {invoiceJournal.reduce((total: any, item: any) => total + item.creditAmount, 0).toFixed(2)}
              </div>
            </div>
          </div>


          <hr className="mt-6 border-t border-inputBorder" />
        </>
      </div>
    </div>
  );
}

export default RecieptView;
