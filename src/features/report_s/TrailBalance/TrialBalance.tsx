import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Calender from "../../../assets/icons/Calender";
import CehvronDown from "../../../assets/icons/CehvronDown";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import { useOrganization } from "../../../context/OrganizationContext";
import Button from "../../../Components/Button";
import PrintButton from "../../../Components/PrintButton";
import { useReactToPrint } from "react-to-print";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB").split("/").join("-");
}

function getFirstDayOfMonth() {
  const date = new Date();
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-01`;
}

function getLastDayOfMonth() {
  const date = new Date();
  return date.toISOString().split("T")[0]; 
}


function TrialBalance() {
  const { request: trailBalance } = useApi("get", 7006);

  const [fromDate, setFromDate] = useState(getFirstDayOfMonth());
  const [toDate, setToDate] = useState(getLastDayOfMonth());
  const [tbData, setTbData] = useState<[] | any>([]);
  const fromDateRef = useRef<HTMLInputElement>(null);
  const toDateRef = useRef<HTMLInputElement>(null);
  const { organization } = useOrganization()

  const handleFromDateClick = () => {
    fromDateRef.current?.showPicker();
  };

  const handleToDateClick = () => {
    toDateRef.current?.showPicker();
  };

  const formattedFromDate = formatDate(fromDate);
  const formattedToDate = formatDate(toDate);

  useEffect(() => {
    localStorage.setItem("fromDate", formattedFromDate);
    localStorage.setItem("toDate", formattedToDate);
  }, [fromDate, toDate]);

  const getDayBook = async () => {
    try {
      const formattedFromDate = formatDate(fromDate);
      const formattedToDate = formatDate(toDate);
      const url = `${endponits.GET_TRIAL_BALANCE}/${formattedFromDate}/${formattedToDate}`;

      const apiResponse = await trailBalance(url);
      const { response, error } = apiResponse;

      if (!error && response) {
        setTbData(response.data);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    getDayBook();
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex-row sm:flex justify-between items-center mb-4 gap-2">
        <div className="flex gap-4">

        <Link to={"/reports"}>
          <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <h4 className="font-bold text-xl text-textColor">Trial Balance</h4>
        </div>
        </div>

        <div className="ml-auto gap-3 flex items-center">
          <div className="flex-row sm:flex text-dropdownText gap-4">
            <div className="flex gap-2">

            <div
              className="relative border-2 border-slate-200 flex rounded-md px-2 py-1 text-sm items-center cursor-pointer bg-white"
              onClick={handleFromDateClick}
            >
              <div className="pointer-events-none flex items-center px-2 text-gray-700">
                <Calender color="currentColor" height={18} width={18} />
              </div>
              {formatDate(fromDate)}
              <div className="pointer-events-none flex items-center px-2 text-gray-700">
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
              <div className="pointer-events-none flex items-center px-2 text-gray-700">
                <Calender color="currentColor" height={18} width={18} />
              </div>
              {formatDate(toDate)}
              <div className="pointer-events-none flex items-center px-2 text-gray-700">
                <CehvronDown color="gray" />
              </div>
              <input
                type="date"
                ref={toDateRef}
                className="absolute inset-0 opacity-0 cursor-pointer"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            </div>
            <div className="flex gap-2 mt-2  sm:mt-0">


            <Button className="text-xs pl-5 pr-5" size="sm" onClick={getDayBook}>
              Run
            </Button>

            <div className="ml-auto flex items-center" onClick={() => reactToPrintFn()}>
              <PrintButton />
            </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl" ref={contentRef}>
        <div className="flex items-center justify-center gap-3 text-center py-2">
          <div>
            <p className="text-textColor font-bold whitespace-nowrap">
              {organization?.organizationName}

            </p>
            <p className="text-sm text-textColor whitespace-nowrap">
              {fromDate} To {toDate}
            </p>
          </div>
        </div>
        <table className="w-full text-[#495060]">
          <thead>
            <tr className="bg-lightPink text-left border-b font-bold text-sm border-[#ebecf0]">
              <th className="p-2">Particulars</th>
              <th className="p-2 text-right min-w-[30px] max-w-[30px] px-1 truncate">
                Debit
              </th>
              <th className="p-2 text-right min-w-[30px] max-w-[30px] px-1 truncate">
                Credit
              </th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {tbData.data?.map((item: any) => (
              <tr key={item.accountSubHead} className="border-b border-[#ebecf0]">
                <td className="py-3">
                  <Link
                    to={`/reports/trialBalance/${item.accountSubHead}`}
                    state={{ item, fromDate, toDate }}
                  >
                    {item.accountSubHead}
                  </Link>
                </td>
                <td className="py-3 text-right min-w-[30px] max-w-[30px] px-1 truncate">
                  {item.totalDebit}
                </td>
                <td className="py-3 text-right min-w-[30px] max-w-[30px] px-1 truncate">
                  {item.totalCredit}
                </td>
              </tr>
            ))}
            <tr>
              <td className="py-3 font-bold">Total</td>
              <td className="py-3 text-right font-bold">{tbData?.summary?.totalDebit}</td>
              <td className="py-3 text-right font-bold">{tbData?.summary?.totalCredit}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TrialBalance;
