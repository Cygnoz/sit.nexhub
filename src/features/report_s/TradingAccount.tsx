import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CheveronLeftIcon from "../../assets/icons/CheveronLeftIcon";
import useApi from "../../Hooks/useApi";
import toast from "react-hot-toast";
import SearchBar from "../../Components/SearchBar";
import PrinterIcon from "../../assets/icons/PrinterIcon";
import CehvronDown from "../../assets/icons/CehvronDown";
import Calender from "../../assets/icons/Calender";
import { endponits } from "../../Services/apiEndpoints";

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
  const [debitData, setDebitData] = useState([]);
  const [creditData, setCreditData] = useState([]);
  const { request: fetchOneItem } = useApi("get", 5006);
  const [searchValue, setSearchValue] = useState("");
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

  const getTradingData = async () => {
    try {
      const formattedFromDate = formatDate(fromDate);
      const formattedToDate = formatDate(toDate);
      const url = `${endponits.GET_TRADING_ACCONUT}/${formattedFromDate}/${formattedToDate}`;
      const { response, error } = await fetchOneItem(url);
      if (!error && response) {
        console.log(response.data.data.credit);
        setDebitData(response.data.data.debit);
        setCreditData(response.data.data.credit);
      }
    } catch (error) {
      toast.error("Error in fetching trading data.");
      console.error("Error in fetching trading data", error);
    }
  };

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
        <div className="flex justify-between items-center mb-6">
          <div className="w-1/2">
            <SearchBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              placeholder="Search Currency"
            />
          </div>
          <div className="text-right">
            <p className="font-bold text-textColor">Company Name</p>
            <p className="text-sm text-gray-500">01/07/2024 To 30/09/2024</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {/* Debit Table */}
          <div>
            <h3 className="text-gray-700 font-medium mb-4">Debit</h3>
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
  {debitData.map((item: any, index: number) => {
    let accountName = "";
    let totalAmount = 0;
    let items = [];
    if (item.openingStock) {
      accountName = "Opening Stock";
      totalAmount = item.openingStock.total;
      items = item.openingStock.item;
    } else if (item.purchases) {
      accountName = "Purchases";
      totalAmount = item.purchases.overallNetDebit;
      items = item.purchases.item;
    } else if (item.directExpenses) {
      accountName = "Direct Expenses";
      totalAmount = item.directExpenses.overallNetDebit;
      items = item.directExpenses.item;
    }

    return (
      <tr
        key={index}
        className={
          index === debitData.length - 1 ? "font-semibold bg-gray-50" : ""
        }
      >
        <td className="px-6 py-3 text-sm text-[#4B5C79] font-medium">
          <Link to={`/reports/trialBalance/${accountName}`} state={{ items }}>
            {accountName}
          </Link>
        </td>
        <td className="px-6 py-3 text-right text-sm text-[#4B5C79] font-medium">
          {totalAmount}
        </td>
      </tr>
    );
  })}
</tbody>

              </table>
            </div>
          </div>

          {/* Credit Table */}
          <div>
            <h3 className="text-gray-700 font-medium mb-4">Credit</h3>
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
                  {creditData.map((item: any, index: number) => {
                    let accountName = "";
                    let totalAmount = 0;

                    if (item.sales) {
                      accountName = "Sales";
                      totalAmount = item.sales.netCredit;
                    } else if (item.closingStock) {
                      accountName = "Closing Stock";
                      totalAmount = item.closingStock.total;
                    }

                    return (
                      <tr
                        key={index}
                        className={
                          index === creditData.length - 1
                            ? "font-semibold bg-gray-50"
                            : ""
                        }
                      >
                        <td className="px-6 py-3 text-sm text-[#4B5C79] font-medium">
                          {accountName}
                        </td>
                        <td className="px-6 py-3 text-right text-sm text-[#4B5C79] font-medium">
                          {totalAmount}
                        </td>
                      </tr>
                    );
                  })}
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
