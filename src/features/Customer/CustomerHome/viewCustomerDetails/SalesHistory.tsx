import { useEffect } from "react";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import Calender from "../../../../assets/icons/Calender";

type Props = {
  customerId: string;
};

function SalesHistory({ customerId }: Props) {

  const { request: getCustomerTransaction } = useApi("get", 5002);

  const getCustomerTransactionResponse = async () => {
    const url = `${endponits.GET_CUSTOMER_TRANSACTIONS}/${customerId}`;
    try {
      const apiResponse = await getCustomerTransaction(url);
      const { response, error } = apiResponse;
      if (!error && response) {
        console.log('API Response:', response);
        console.log('Transaction Data:', response.data);
      } else {
        console.error('API Error:', error);
      }
    } catch (error) {
      console.error('Catch Error:', error);
    }
  };

  useEffect(() => {
    getCustomerTransactionResponse();
  }, []);

  const History = [
    {
      fields:
      {
        titel: 'Invoice No',
        field_1: "Order No",
        field_2: "Amount",
        field_3: "Balance Due",
      }
      ,
      date: "21/02/09",
      invoiceNo: "IN-002",
      orderNo: "234",
      amount: "1000",
      balanceDue: "300",
    }
  ]

  return (
    <div className="px-6 py-3 bg-[#F3F3F3] w-[25%] rounded-lg ">

      {
        History.map((history) => (
          <div>
            <div className="flex justify-end">
              <p className="bg-white w-20 px-1 py-0.5 rounded-md flex gap-2 text-[12px] text-[#A9A2A2]">
                <span className="mt-0.5">  <Calender color={"#A9A2A2"} width={12} height={12} /></span> {history.date}</p>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 mt-1 bg-[#9747FF] rounded-full"></div>
              <p className="text-[#303F58] text-[14px] font-bold">{history.fields.titel} :</p>
              <p className="text-[#303F58] text-[14px] font-bold">{history.invoiceNo}</p>

            </div>
            <div className="grid grid-cols-2 mt-2">
              <div>
                <p className="text-[#4B5C79] text-[13px]">{history.fields.field_1} </p>
                <p className="text-[#4B5C79] text-[13px]" >{history.fields.field_2}</p>
                <p className="text-[#4B5C79] text-[13px]">{history.fields.field_3}</p>
              </div>
              <div>
                <p className="text-[#4B5C79] text-[13px]" >{history.orderNo}</p>
                <p className="text-[#4B5C79] text-[13px]">&#8377; {history.amount}</p>
                <p className="text-[#4B5C79] text-[13px]">&#8377; {history.balanceDue}</p>
              </div>
            </div>
          </div>
        ))
      }


    </div>
  );
}

export default SalesHistory;
