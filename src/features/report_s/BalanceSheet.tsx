import { Link } from "react-router-dom";
import CheveronLeftIcon from "../../assets/icons/CheveronLeftIcon";
import { useEffect, useState } from "react";
import useApi from "../../Hooks/useApi";
import toast from "react-hot-toast";
import { endponits } from "../../Services/apiEndpoints";

type Props = {};

const BalanceSheet = ({}: Props) => {
  const [BSData,setBSData]=useState([])

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
            <div className="flex items-center font-bold justify-center rounded-md text-sm py-2 text-[#585953] bg-gradient-to-r from-[#E3E6D5] via-[#E3E6D5] to-[#F7E7CE]">
              Liabilities
            </div>
            <div className="flex text-textColor text-sm font-semibold py-4 mt-2 border-b border-[#F4F4F4]">
              <div>Account</div>
              <div className="ml-auto">Amount</div>
            </div>
            {liabilities.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-[13px]  py-4  border-b border-[#F4F4F4]"
              >
                <span>{item.account}</span>
                <span>{item.total}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center font-bold justify-center rounded-md text-sm py-2 text-[#585953] bg-gradient-to-r from-[#FFE3B8] via-[#D5DCB3] to-[#D5DCB3]">
              Assets
            </div>
            <div className="flex text-textColor text-sm font-semibold py-4 mt-2 border-b border-[#F4F4F4]">
              <div>Account</div>
              <div className="ml-auto">Amount</div>
            </div>

            {assets.map((item, index) => (
              <div key={index} className="flex justify-between py-4 text-[13px]  border-b border-[#F4F4F4]">
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
