import { useEffect, useState } from "react";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import Calender from "../../../../assets/icons/Calender";
import Line from "../../../../assets/icons/Line";

type Props = {
  customerId: string;
};

function SalesHistory({ customerId }: Props) {
  const { request: getCustomerTransaction } = useApi("get", 5002);
  const [history, setHistory] = useState<any>([]);
  const getCustomerTransactionResponse = async () => {
    const url = `${endponits.GET_CUSTOMER_SALE_HISTORY}/${customerId}`;
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
    <div className="grid grid-cols-3  items-center">
      {history.map((item:any, index:number) => (
        <div key={index} className="flex items-center ">
          {/* Invoice Card */}
          <div className="bg-[#F3F3F3] px-6 py-4 w-full rounded-lg shadow-md h-36 ">
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
              <p className="text-[#303F58] text-[14px] font-bold">
                {item.salesInvoice}
              </p>
            </div>

            <div className="grid grid-cols-2 mt-2">
              <div>
                {item.salesOrderNumber && (
                  <p className="text-[#4B5C79] text-[13px]">Order No.</p>
                )}
                <p className="text-[#4B5C79] text-[13px]">Amount</p>
                <p className="text-[#4B5C79] text-[13px]">Balance Due</p>
              </div>
              <div>
                <p className="text-[#4B5C79] text-[13px]">
                  {item.salesOrderNumber}
                </p>
                <p className="text-[#4B5C79] text-[13px]">
                  &#8377; {item.saleAmount}
                </p>
                <p className="text-[#4B5C79] text-[13px]">
                  &#8377; {item.balanceAmount}
                </p>
              </div>
            </div>
          </div>

          {/* Arrow Indicator */}
          {index % 3 !== 2 && (
            <Line/>
          )}
        </div>
      ))}
    </div>
  );
}

export default SalesHistory;
