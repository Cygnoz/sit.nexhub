import { Link, } from "react-router-dom";
import CheveronLeftIcon from "../../assets/icons/CheveronLeftIcon";
import { useEffect, useRef, useState } from "react";
import useApi from "../../Hooks/useApi";
import toast from "react-hot-toast";
import { endponits } from "../../Services/apiEndpoints";
import { PrinterIcon } from "@heroicons/react/20/solid";
import Calender from "../../assets/icons/Calender";
import CehvronDown from "../../assets/icons/CehvronDown";

type Props = {};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB").split("/").join("-");
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

const ProfitAndLoss = ({ }: Props) => {


  const [fromDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getTodayDate());
  const [PLData, setPLData] = useState<any>({
    debit: [],
    credit: [],
    summary: {},
  });



  const fromDateRef = useRef<HTMLInputElement>(null);
  const toDateRef = useRef<HTMLInputElement>(null);

  const handleFromDateClick = () => {
    fromDateRef.current?.showPicker();
  };

  const handleToDateClick = () => {
    toDateRef.current?.showPicker();
  };



  const { request: fetchOneItem } = useApi("get", 5006);

  console.log(PLData, "PLData")


  const getPL = async () => {
    try {
      const formattedFromDate = formatDate(fromDate); 
      const formattedToDate = formatDate(toDate); 
      const url = `${endponits.GET_PL_DATA}/${formattedFromDate}/${formattedToDate}`;

      const apiResponse = await fetchOneItem(url);
      const { response, error } = apiResponse;

      if (!error && response) {
        setPLData(response.data.data); 
      } else {
        console.error("Error fetching Profit & Loss data:", error);
      }
    } catch (error) {
      console.error("Error in fetching Profit & Loss data:", error);
      toast.error("Failed to fetch Profit & Loss data.");
    }
  };

  useEffect(() => {
    getPL();
  }, [fromDate, toDate]); 


  // const handleItemClick = (account: string) => {
  //   if (account === "Indirect Expense") {
  //     // Navigate to the specific path for Indirect Expense
  //     navigate("/reports/profitandloss/indirectExpense");
  //   }
  // };

  console.log(

    "pl")

  return (
    <div className="p-5">
      <div className="flex gap-5">
        <Link to={"/reports"}>
          <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <h4 className="font-bold text-xl text-textColor">Profit and Loss</h4>
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

      <div className="bg-white rounded-lg my-4 p-5">
        <div className="text-center py-4">
          <p className="text-lg font-bold text-textColor">Company Name</p>
          <p className="text-sm text-textColor">01/07/2024 To 30/09/2024</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Section (Debit) */}
          <div>
            <div className="flex items-center text-[#585953] font-semibold justify-center rounded-md py-2 bg-gradient-to-r from-[#E3E6D5] via-[#E3E6D5] to-[#F7E7CE]">
              Particulars
            </div>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-[#F4F4F4] text-[#4B5C79] font-medium text-sm">
                  <td className="py-4">Gross Loss</td>
                  <td className="py-4 text-right">{PLData.summary?.grossLoss || 0}</td>
                </tr>

                <tr className="border-b border-[#F4F4F4] text-[#4B5C79] font-medium text-sm cursor-pointer hover:bg-gray-100">
                  <td className="py-4">
                    <Link to={`/reports/profitandloss/groupsummary/indirectExpense`} state={{ data: PLData?.debit[0]?.indirectExpenses }}>
                      Indirect Expense
                    </Link>
                  </td>
                  <td className="py-4 text-right">{PLData.debit[0]?.indirectExpenses?.overallNetDebit || 0}</td>
                </tr>

                <tr className="border-b border-[#F4F4F4] text-[#4B5C79] font-medium text-sm">
                  <td className="py-4">Net Profit</td>
                  <td className="py-4 text-right">{PLData.summary?.netProfit || 0}</td>
                </tr>
                <tr className="text-[#4B5C79] font-medium text-sm">
                  <td className="py-4"></td>
                  <td className="py-4 text-right">{PLData.summary?.finalDebit || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Right Section (Credit) */}
          <div>
            <div className="flex items-center font-bold justify-center text-[#585953] rounded-md py-2 bg-gradient-to-r from-[#FFE3B8] via-[#D5DCB3] to-[#D5DCB3]">
              Particulars
            </div>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-[#F4F4F4] text-[#4B5C79] font-medium text-sm">
                  <td className="py-4">Gross Profit b/f</td>
                  <td className="py-4 text-right">{PLData.credit[0]?.["Gross Profit (c/d)"] || 0}</td>
                </tr>

                <tr className="border-b border-[#F4F4F4] text-[#4B5C79] font-medium text-sm">
                  <td className="py-4">
                    <Link to={`/reports/profitandloss/groupsummary/indirectIncome`} state={{ data: PLData.credit[1]?.indirectIncome }}>
                      Indirect Income
                    </Link>
                  </td>
                  <td className="py-4 text-right">{PLData.credit[1]?.indirectIncome?.
                    overallNetCredit || 0}</td>
                </tr>

                <tr className="border-b border-[#F4F4F4] text-[#4B5C79] font-medium text-sm">
                  <td className="py-4">Net Loss</td>
                  <td className="py-4 text-right">{PLData.summary?.netLoss || 0}</td>
                </tr>
                <tr className="text-[#4B5C79] font-medium text-sm">
                  <td className="py-4"></td>
                  <td className="py-4 text-right">{PLData.summary?.finalCredit || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>


      </div>

    </div>
  );
};

export default ProfitAndLoss;
