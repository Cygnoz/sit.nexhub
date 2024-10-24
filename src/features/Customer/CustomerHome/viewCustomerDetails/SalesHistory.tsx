import { useEffect } from "react";
import Button from "../../../../Components/Button";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";

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

  return (
    <div className="p-4 bg-[#F3F3F3] w-full rounded-lg">
      <div className="px-4 py-2 bg-white rounded-lg shadow mb-4 flex justify-between items-center text-start">
        <div className="flex flex-col space-y-1">
          <span className="text-labelColor text-sm">Sl no</span>
          <span className="font-bold text-[#0B1320] text-sm">01</span>
        </div>

        <div className="flex flex-col space-y-1">
          <span className="text-labelColor text-sm">Inv no</span>
          <span className="font-bold text-[#0B1320] text-sm">IN-0122</span>
        </div>

        <div className="flex flex-col space-y-1">
          <span className="text-labelColor text-sm">Date</span>
          <span className="font-bold text-[#0B1320] text-sm">12/06/24</span>
        </div>

        <div className="flex flex-col space-y-1">
          <span className="text-labelColor text-sm">Amount</span>
          <span className="font-bold text-[#0B1320] text-sm">500.00</span>
        </div>

        <Button variant="secondary" size="sm" className="text-xs h-6 pl-6 pr-6">
          View
        </Button>
      </div>
    </div>
  );
}

export default SalesHistory;
