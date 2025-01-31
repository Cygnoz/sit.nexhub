import { Link, useNavigate } from "react-router-dom";
import CheveronLeftIcon from "../../assets/icons/CheveronLeftIcon";
import { useEffect, useRef, useState } from "react";
import useApi from "../../Hooks/useApi";
import toast from "react-hot-toast";
import { endponits } from "../../Services/apiEndpoints";
import Calender from "../../assets/icons/Calender";
import CehvronDown from "../../assets/icons/CehvronDown";
import { PrinterIcon } from "@heroicons/react/20/solid";

type Props = {};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB").split("/").join("-");
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

const BalanceSheet = ({}: Props) => {
  const [BSData,setBSData]=useState([])
  
    const [fromDate, setFromDate] = useState(getTodayDate());
    const [toDate, setToDate] = useState(getTodayDate());
    const [total, setTotal] = useState<any>({})
      const navigate = useNavigate();

      
      
        const fromDateRef = useRef<HTMLInputElement>(null);
          const toDateRef = useRef<HTMLInputElement>(null);
        
          const handleFromDateClick = () => {
            fromDateRef.current?.showPicker();
          };
        
          const handleToDateClick = () => {
            toDateRef.current?.showPicker();
          };
    

  const { request: fetchOneItem } = useApi("get", 5006);


  const liabilities = [
    { account: "Capital Account", total: "₹30,000" },
    { account: "Loans(Liability)", total: "₹30,000" },
    { account: "Current Liabilities", total: "₹30,000" },
    { account: "#INV-1005", total: "₹30,000" },
  ];

  const assets = [
    { account: "Fixed Assets", total: "₹30,000" },
    { account: "Current assets", total: "₹30,000" },
    { account: "Suspense A/c", total: "₹30,000" },
    { account: "Profit & Loss A/c", total: "₹30,000" },
  ];

  console.log(BSData)

  const getBSData = async () => {
    try {
      const url = `${endponits.GET_BS_DATA}/01/12/2024/31/12/2024`;
      const { response, error } = await fetchOneItem(url);
      if (!error && response) {
        setBSData(response.data);
        console.log(response.data,);
        
      } else {
        console.error("Failed to fetch one item data.");
      }
    } catch (error) {
      toast.error("Error in fetching one item data.");
      console.error("Error in fetching one item data", error);
    }
  };
  useEffect(()=>{
getBSData()
  },[])


  const handleItemClick = (account: string) => {
    if (account === "Capital Account") {
      // Navigate to the specific path for Indirect Expense
      navigate("/reports/profitandloss/indirectExpense");
    } 
  };

  return (
    <div className="p-5">
      <div className="flex gap-5">
        <Link to={"/purchase/debitNote"}>
          <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <h4 className="font-bold text-xl text-textColor ">Balance sheet </h4>
        </div>
        <div className="ml-auto gap-3 flex items-center">
          <div className="flex text-dropdownText gap-4">
            <div
              className="relative border-2 border-slate-200 flex rounded-md px-2 py-1 text-sm items-center cursor-pointer"
              onClick={handleFromDateClick}
            >
              <div className="pointer-events-none inset-y-0 flex items-center px-2 text-gray-700">
                <Calender color="currentColor" height={18} width={18} />
              </div>
              {formatDate(fromDate)}
              <div className="pointer-events-none inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <CehvronDown color="gray" />
              </div>
              <input
                type="date"
                ref={fromDateRef}
                className="absolute inset-0 opacity-0 cursor-pointer"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div
              className="relative border-2 border-slate-200 flex rounded-md px-2 py-1 text-sm items-center cursor-pointer"
              onClick={handleToDateClick}
            >
              <div className="pointer-events-none inset-y-0 flex items-center px-2 text-gray-700">
                <Calender color="currentColor" height={18} width={18} />
              </div>
              {formatDate(toDate)}
              <div className="pointer-events-none inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <CehvronDown color="gray" />
              </div>
              <input
                type="date"
                ref={toDateRef}
                className="absolute inset-1 opacity-0 cursor-pointer"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="ml-auto flex items-center">
              <button className="flex border px-2 py-1 border-gray-300 rounded-lg bg-secondary_active">
                <PrinterIcon color="gray" height={18} width={20} />
                <span className="text-sm text-neutral-500">Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg my-4 p-3">
        <div className="flex items-center justify-center gap-3 text-center py-2">
         
           <div>
              <p className="text-textColor font-bold whitespace-nowrap">
                Company Name
              </p>
              <p className="text-sm text-textColor whitespace-nowrap">
                01/01/2025 To 31/01/2025
              </p>
           </div>
        </div>
        <div className="grid grid-cols-2 gap-4 my-2 text-sm text-[#585953]">
          <div>
            <div className="flex items-centertext-[#585953] font-semibold justify-center rounded-md text-sm py-2 text-[#585953] bg-gradient-to-r from-[#E3E6D5] via-[#E3E6D5] to-[#F7E7CE]">
              Liabilities
            </div>
            <div className="flex text-textColor text-sm font-semibold py-4 mt-2 border-b border-[#F4F4F4]">
              <div>Account</div>
              <div className="ml-auto">Amount</div>
            </div>
            {liabilities.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-[#4B5C79] font-medium py-4  border-b border-[#F4F4F4]"
              >
                <span>{item.account}</span>
                <span>{item.total}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="flex  font-semibold justify-center rounded-md text-sm py-2 text-[#585953] bg-gradient-to-r from-[#FFE3B8] via-[#D5DCB3] to-[#D5DCB3]">
              Assets
            </div>
            <div className="flex text-textColor text-sm font-semibold py-4 mt-2 border-b border-[#F4F4F4]">
              <div>Account</div>
              <div className="ml-auto">Amount</div>
            </div>

            {assets.map((item, index) => (
              <div key={index} className="flex justify-between py-4 text-sm text-[#4B5C79] font-medium border-b border-[#F4F4F4]">
                <span>{item.account}</span>
                <span>{item.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
