import {  useNavigate, useParams } from 'react-router-dom';
import Button from '../../../../Components/Button';
import CheveronLeftIcon from '../../../../assets/icons/CheveronLeftIcon';
import PencilEdit from '../../../../assets/icons/PencilEdit';
import PdfView from './PdfView';
import { useEffect, useState } from 'react';
import useApi from '../../../../Hooks/useApi';
import { endponits } from '../../../../Services/apiEndpoints';
import { useOrganization } from '../../../../context/OrganizationContext';
import SideBar from './SideBar';

type Props = {};

function RecieptView({}: Props) {
  const[RecieptData,setRecieptData]=useState<[]|any>([])
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

  useEffect(()=>{
    getReciepts()
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
        <div className="space-x-3 items-center flex text-[#303F58] font-bold text-[16px]">
          <h3>Reciept</h3>
          <h3 className="font-normal">|</h3>
          <h3>{RecieptData?.payment}</h3>
          <p className="w-[47px] h-[25px] bg-[#F3F3F3] rounded-lg flex items-center justify-center">Draft</p>
        </div>
        <div className="flex space-x-3 mb-4">
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
        </div>
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
    </div>
  );
}

export default RecieptView;
