import { useEffect, useState } from "react";
import Calender from "../../../../assets/icons/Calender";
import { endponits } from "../../../../Services/apiEndpoints";
import useApi from "../../../../Hooks/useApi";
import DotIcon from "../../../../assets/icons/DotIcon";
import Line from "../../../../assets/icons/Line";
type Props = {supplierId?:string};

function Transaction({supplierId}: Props) {
  const { request: getCustomerTransaction } = useApi("get", 5002);
  const [history, setHistory] = useState<any>([]);

  const getCustomerTransactionResponse = async () => {
    const url = `${endponits.GET_CUSTOMER_SALE_HISTORY}/${supplierId}`;
    try {
      const apiResponse = await getCustomerTransaction(url);
      const { response, error } = apiResponse;
      if (!error && response) {
        console.log("API Response:", response);
        setHistory(response.data);
      } else {
        console.error("API Error:", error);
      }
    } catch (error) {
      console.error("Catch Error:", error);
    }
  };

  useEffect(() => {
    getCustomerTransactionResponse();
  }, []);
  return (
    <div>
      {history.length > 0 ? (
        <div className="grid grid-cols-3  items-center">
         {history.slice().reverse().map((item: any, index: number) => (
  <div key={index} className="flex items-center my-4 w-full">
    <div className="flex items-center w-full gap-7">
      <div className="bg-[#f5f8fd] px-6 py-4 w-full rounded-lg shadow-md h-40">
        <div className="flex">
          <p className="bg-white px-1 py-0.5 ml-auto rounded-md flex gap-2 text-[12px] text-[#A9A2A2]">
            <span className="mt-0.5">
              <Calender color={"#A9A2A2"} width={12} height={12} />
            </span>{" "}
            {item.createdDate}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="w-3 h-3 mt-1 bg-[#9747FF] rounded-full"></div>
          <p className="text-[#303F58] text-[14px] font-bold">Invoice:</p>
          <p className="text-[#303F58] text-[14px] font-bold">{item.salesInvoice}</p>
        </div>

        <div className="grid grid-cols-2 mt-2 h-16">
          <div>
            {item.salesOrderNumber && (
              <p className="text-[#4B5C79] text-[13px]">Order No.</p>
            )}
            <p className="text-[#4B5C79] text-[13px]">Amount</p>
            <p className="text-[#4B5C79] text-[13px]">Balance Due</p>
          </div>
          <div>
            <p className="text-[#4B5C79] text-[13px]">{item.salesOrderNumber}</p>
            <p className="text-[#4B5C79] text-[13px]">&#8377; {item.saleAmount}</p>
            <p className="text-[#4B5C79] text-[13px]">&#8377; {item.balanceAmount}</p>
          </div>
        </div>

        <div className="ml-auto flex justify-end">
          <div
            className={`${
              item.paidStatus === "Pending"
                ? "bg-zinc-200"
                : item.paidStatus === "Completed"
                ? "bg-[#94dca9]"
                : "bg-[#dcd894]"
            } text-[13px] rounded-lg text-center items-center text-textColor h-[18px] px-2 max-w-fit gap-2 py-2 w-full flex justify-end`}
          >
            <DotIcon color="#495160" />
            {item.paidStatus}
          </div>
        </div>
      </div>

      <div className="w-10 flex justify-center">
        {index % 3 !== 2 && index !== history.length - 1 && <Line />}
      </div>
    </div>
  </div>
))}

        </div>
      ) : (
        <div className="flex items-center  justify-center ">
          <p className="text-[red] my-5">No Recordes Available !</p>
        </div>
      )}
    </div>
  );
}

export default Transaction;
