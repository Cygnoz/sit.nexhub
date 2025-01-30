import { Link, useLocation, useParams } from "react-router-dom"
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon"
import { useRef, useState } from "react";
import Calender from "../../../assets/icons/Calender";
import CehvronDown from "../../../assets/icons/CehvronDown";
import PrinterIcon from "../../../assets/icons/PrinterIcon";

type Props = {}
function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB").split("/").join("-");
  }
  
  function getTodayDate() {
    return new Date().toISOString().split("T")[0];
  }
const MonthlySummery = ({}: Props) => {
    const { accountSubHead } = useParams();
        
    
        const [fromDate, setFromDate] = useState(getTodayDate());
        const [toDate, setToDate] = useState(getTodayDate());
        const fromDateRef = useRef<HTMLInputElement>(null);
        const toDateRef = useRef<HTMLInputElement>(null);
      
        const handleFromDateClick = () => {
          fromDateRef.current?.showPicker();
        };
      
        const handleToDateClick = () => {
          toDateRef.current?.showPicker();
        };
    
        const location = useLocation();
        const { items } = location.state || {};
      console.log(items,"item")
       
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
    <div className="flex justify-between items-center mb-4 gap-2">
      <Link to={"/reports/trialBalance"}>
        <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
          <CheveronLeftIcon />
        </div>
      </Link>
      <div className="flex justify-center items-center">
        <h4 className="font-bold text-xl text-textColor "> Monthly Summery </h4>
      </div>

      <div className="ml-auto gap-3 flex items-center">
        <div className="flex text-dropdownText gap-4">
          <div
            className="relative border-2 border-slate-200 flex rounded-md px-2 py-1 text-sm items-center cursor-pointer bg-white"
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
            className="relative border-2 border-slate-200 flex rounded-md px-2 py-1 text-sm items-center cursor-pointer bg-white"
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

    <div className="bg-white p-5 rounded-xl ">
      <div className="flex items-center  justify-center gap-3 text-center py-2">
        <div>
          <p className="text-textColor font-bold whitespace-nowrap">
            Company Name
          </p>
          <p className="text-sm text-textColor whitespace-nowrap">
            01/01/2025 To 31/01/2025
          </p>
        </div>
      </div>
      <table className="w-full text-[#495060]">
        <thead>
          <tr className="bg-lightPink text-left border-b font-bold text-sm  border-[#ebecf0]">
            <th className="p-2">Particulars</th>
            <th className="p-2 text-right min-w-[30px] max-w-[30px] px-1 truncate">
              Debit
            </th>
            <th className="p-2 text-right min-w-[30px] max-w-[30px] px-1 truncate">
              Credit
            </th>
            <th className="p-2 text-right min-w-[30px] max-w-[30px] px-1 truncate">
              Closing Balance
            </th>
          </tr>
        </thead>
        <tbody className="text-xs ">
          {items?.months?.map((item:any) => (
            <tr className="border-b border-[#ebecf0]">
           <Link to={`/reports/trialBalance/${accountSubHead}/monthly-summery`} > <td className="py-3">{item.date}</td></Link>
              <td className="py-3 text-right min-w-[30px] max-w-[30px] px-1 truncate">
                {item.totalDebit}
              </td>
              <td className="py-3 text-right min-w-[30px] max-w-[30px] px-1 truncate">
                {item.totalCredit}
              </td>
            </tr>
          ))}
          <td className="py-3 font-bold">Total</td>
          <td className="py-3 text-right font-bold">000</td>
          <td className="py-3 text-right font-bold">000</td>
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default MonthlySummery