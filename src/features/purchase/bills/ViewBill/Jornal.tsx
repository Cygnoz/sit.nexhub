import { useEffect, useState } from "react";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import { useParams } from "react-router-dom";


const Jornal = () => {
      const [billJournal, setbillJournal] = useState<any>([])
      const { request: getOneInvoiceDetails } = useApi("get", 5005);
  const { id } = useParams<{ id: string }>();

      const fetchOneInvoice = async () => {
        try {
          const url = `${endponits.GET_BILL_JOURNAL}/${id}`;
          const { response, error } = await getOneInvoiceDetails(url);
          if (!error && response) {
            setbillJournal(response.data);
          }
        } catch (error) {
          console.error("Error fetching sales order:", error);
        }
      };


      useEffect(()=>{
fetchOneInvoice()
      },[])


  return (
 
      <div>
          {/* Invoice Details */}
          <div className="p-4 rounded-lg bg-[#F6F6F6] mt-6">
            <h2 className="font-semibold text-base mb-4 text-textColor">Invoice</h2>

            <div className="grid grid-cols-3 font-bold gap-x-4 text-base text-dropdownText mb-2">
              <div>Account</div>
              <div className="text-right">Debit</div>
              <div className="text-right">Credit</div>
            </div>

            {/* Mapping over billJournal to display each row */}
            {billJournal.map((item: any) => (
              <div key={item._id} className="grid grid-cols-3 text-dropdownText gap-x-4 text-base mb-2">
                <div className="text-sm">{item.accountName}</div>
                <div className="text-right">{item.debitAmount.toFixed(2)}</div>
                <div className="text-right">{item.creditAmount.toFixed(2)}</div>
              </div>
            ))}

            {/* Total Row */}
            <div className="grid grid-cols-3 gap-x-4 text-lg font-bold text-[#0B1320] mt-5">
              <div className="text-base">Total</div>
              <div className="text-right">
                {billJournal.reduce((total: any, item: any) => total + item.debitAmount, 0).toFixed(2)}
              </div>
              <div className="text-right">
                {billJournal.reduce((total: any, item: any) => total + item.creditAmount, 0).toFixed(2)}
              </div>
            </div>
          </div>


          <hr className="mt-6 border-t border-inputBorder" />
          </div>
  
  )
}

export default Jornal