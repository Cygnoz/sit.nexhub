import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import useApi from "../../../Hooks/useApi";
import toast from "react-hot-toast";
import PrinterIcon from "../../../assets/icons/PrinterIcon";
import CehvronDown from "../../../assets/icons/CehvronDown";
import Calender from "../../../assets/icons/Calender";
import { endponits } from "../../../Services/apiEndpoints";

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
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];
}

const TradingAccount = () => {
  const [tradingData, setTradingData] = useState<[] | any>([]);
  const { request: fetchOneItem } = useApi("get", 5006);
  const [fromDate, setFromDate] = useState(getFirstDayOfMonth());
  const [toDate, setToDate] = useState(getLastDayOfMonth());
  const fromDateRef = useRef<HTMLInputElement>(null);
  const toDateRef = useRef<HTMLInputElement>(null);

  const handleFromDateClick = () => {
    fromDateRef.current?.showPicker();
  };

  const handleToDateClick = () => {
    toDateRef.current?.showPicker();
  };
  const formattedFromDate = formatDate(fromDate);
  const formattedToDate = formatDate(toDate);
  const getTradingData = async () => {
    try {
  
      const url = `${endponits.GET_TRADING_ACCONUT}/${formattedFromDate}/${formattedToDate}`;
      const { response, error } = await fetchOneItem(url);
      if (!error && response) {
        console.log(response.data);

        setTradingData(response.data.data);
      }
    } catch (error) {
      toast.error("Error in fetching trading data.");
      console.error("Error in fetching trading data", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("fromDate", formattedFromDate);
    localStorage.setItem("toDate", formattedToDate);
  }, [fromDate, toDate]);
  

  useEffect(() => {
    getTradingData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-start items-center mb-6 ">
        <Link to="/reports">
          <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div className="flex justify-start item-start ms-2">
          <h4 className="font-bold text-xl text-textColor">Trading Account</h4>
        </div>
        <div className="ml-auto gap-3 flex items-center">
          <div className="flex text-dropdownText gap-4">
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

            <div className="ml-auto flex items-center">
              <button className="flex border px-2 py-1 border-gray-300 rounded-lg bg-secondary_active">
                <PrinterIcon color="gray" height={18} width={20} />
                <span className="text-sm text-neutral-500">Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Account Tables */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-center items-center mb-2">
          <div className="text-center">
            <p className="font-bold text-textColor">Company Name</p>
            <p className="text-sm text-textColor">{formattedFromDate} To {formattedToDate}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {/* Debit Table */}
          <div>
            <h3 className=" text-textColor   mb-4">Debit</h3>
            <div className="overflow-hidden ">
              {/* Table Header */}
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="flex items-center text-[#585953] font-semibold justify-center rounded-md py-2 bg-[#F7ECD9] mx-5">
                      Particulars
                    </th>
                    <th className="items-center text-[#585953] font-semibold justify-center rounded-md py-2 bg-[#F7ECD9]">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAECF0]">
                  {tradingData?.debit?.map((item: any, index: number) => {
                    let accountName = "";
                    let totalAmount = 0;
                    let items = [];
                    let link = "";

                    if (item.openingStock) {
                      accountName = "Opening Stock";
                      totalAmount = item.openingStock.total;
                      items = item.openingStock;
                      link = `/reports/trading-account/${accountName}`;
                    } else if (item.purchases) {
                      const accountSubhead = "purchases";
                      accountName = "Purchases";
                      totalAmount = item.purchases.overallNetDebit;
                      items = item;
                      console.log(item, "items");
                      link = `/reports/trading-account/accounts/${accountSubhead}`;
                    } else if (item.directExpenses) {
                      const accountSubhead = "directExpenses";
                      accountName = "Direct Expenses";
                      totalAmount = item.directExpenses.overallNetDebit;
                      items = item;
                      link = `/reports/trading-account/accounts/${accountSubhead}`;
                    } else if (item.grossProfit) {
                      accountName = "Gross Profit";
                      totalAmount = item.grossProfit;
                    }

                    if (totalAmount === 0) {
                      link = "";
                    }

                    return (
                      <tr
                        key={index}
                        className={
                          index === tradingData?.debit.length - 1
                            ? "font-semibold bg-gray-50"
                            : ""
                        }
                      >
                        <td className="px-6 py-3 text-sm text-[#4B5C79] font-medium">
                          <Link to={link} state={{ items }}>
                            {accountName}
                          </Link>
                        </td>
                        <td className="px-6 py-3 text-right text-sm text-[#4B5C79] font-medium">
                          {totalAmount}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="px-6 py-3  text-sm text-[#4B5C79] font-bold">
                      Total
                    </td>
                    <td className="px-6 py-3 text-right  text-sm text-[#4B5C79] font-bold">
                      {tradingData.finalDebit}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Credit Table */}
          <div>
            <div className="">
              <h3 className="text-textColor text-end  mb-4">Credit</h3>
            </div>{" "}
            <div className="overflow-hidden ">
              {/* Table Header */}
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="flex items-center text-[#585953] font-semibold justify-center rounded-md py-2 bg-[#F7ECD9] mx-5">
                      Particulars
                    </th>
                    <th className="items-center text-[#585953] font-semibold justify-center rounded-md py-2 bg-[#F7ECD9]">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAECF0] ">
                  {tradingData?.credit?.map((item: any, index: number) => {
                    let accountName = "";
                    let totalAmount = 0;
                    let items = [];
                    let link = "";
                    if (item.sales) {
                      const accountSubhead = "sales";
                      accountName = "Sales";
                      totalAmount = item.sales.overallNetCredit;
                      items = item;
                      link = `/reports/trading-account/accounts/${accountSubhead}`;

                    } else if (item.closingStock) {
                      accountName = "Closing Stock";
                      totalAmount = item.closingStock.total;
                      items = item.closingStock;
                      link = `/reports/trading-account/${accountName}`;
                    } else if (item.grossLoss) {
                      accountName = "Gross Loss";
                      totalAmount = item.grossLoss.total;
                    }

                    
                    if (totalAmount === 0) {
                      link = "";
                    }

                    return (
                      <tr
                        key={index}
                        className={
                          index === tradingData?.credit.length - 1
                            ? "font-semibold bg-gray-50"
                            : ""
                        }
                      >
                        <Link to={link} state={{ items, fromDate, toDate }}>
                          <td className="px-6 py-3 text-sm text-[#4B5C79] font-medium">
                            {accountName}
                          </td>
                        </Link>
                        <td className="px-6 py-3 text-right text-sm text-[#4B5C79] font-medium">
                          {totalAmount}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="px-6 py-3  text-sm text-[#4B5C79] font-bold">
                      Total
                    </td>
                    <td className="px-6 py-3 text-right  text-sm text-[#4B5C79] font-bold">
                      {tradingData.finalCredit}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingAccount;
