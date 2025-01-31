import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CheveronLeftIcon from "../../assets/icons/CheveronLeftIcon";
import useApi from "../../Hooks/useApi";
import toast from "react-hot-toast";
import SearchBar from "../../Components/SearchBar";

const TradingAccount = () => {
  const [tradingData, setTradingData] = useState([]);
  const { request: fetchOneItem } = useApi("get", 5006);
  const [searchValue, setSearchValue] = useState("");


  const dataLeft = [
    { account: "Opening Stock", total: "₹30,000" },
    { account: "Purchase Account", total: "₹30,000" },
    { account: "Direct Expense", total: "₹30,000" },
    { account: "Gross Profit", total: "₹30,000" },
    { account: "Indirect Expense", total: "₹30,000" },
    { account: "Net Profit", total: "₹30,000" },
    { account: "Total", total: "₹30,000" },
  ];

  const dataRight = [
    { account: "Sales Accounts", total: "₹30,000" },
    { account: "Closing Stock", total: "₹30,000" },
    { account: "Gross Profit", total: "₹30,000" },
    { account: "Total", total: "₹30,000" },
  ];

  const getTradingData = async () => {
    try {
      const url = `${""}/01/07/2024/30/09/2024`;
      const { response, error } = await fetchOneItem(url);
      if (!error && response) {
        setTradingData(response.data);
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
                  <tr >
                    <th className="flex items-center text-[#585953] font-semibold justify-center rounded-md py-2 bg-[#F7ECD9] mx-5">Particulars</th>
                    <th className="items-center text-[#585953] font-semibold justify-center rounded-md py-2 bg-[#F7ECD9]">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAECF0] ">
                  {dataLeft.map((item, index) => (
                    <tr key={index} className={index === dataLeft.length - 1 ? "font-semibold bg-gray-50" : ""}>
                      <td className="px-6 py-3 text-sm text-[#4B5C79] font-medium">{item.account}</td>
                      <td className="px-6 py-3 text-right text-sm text-[#4B5C79] font-medium">{item.total}</td>
                    </tr>
                  ))}
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
                  <tr >
                    <th className="flex items-center text-[#585953] font-semibold justify-center rounded-md py-2 bg-[#F7ECD9] mx-5">Particulars</th>
                    <th className="items-center text-[#585953] font-semibold justify-center rounded-md py-2 bg-[#F7ECD9]">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAECF0]">
                  {dataRight.map((item, index) => (
                    <tr key={index} className={index === dataRight.length - 1 ? "font-semibold bg-gray-50" : ""}>
                      <td className="px-6 py-3 text-sm text-[#4B5C79] font-medium">{item.account}</td>
                      <td className="px-6 py-3 text-right text-sm text-[#4B5C79] font-medium">{item.total}</td>
                    </tr>
                  ))}
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
