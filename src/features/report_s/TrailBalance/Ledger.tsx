import { Link, useLocation, useParams } from "react-router-dom";
import PrinterIcon from "../../../assets/icons/PrinterIcon";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";

type Props = {}


const Ledger = ({}: Props) => {
    const { accountSubHead } = useParams();

    const location = useLocation();
    const { item, fromDate ,toDate} = location.state || {};
  console.log(item.data, "item")
   
return (
<div className="p-6 bg-gray-100 min-h-screen">
<div className="flex justify-between items-center mb-4 gap-2">
  <Link to={`/reports/trialBalance/${accountSubHead}/monthly-summery`}>
    <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
      <CheveronLeftIcon />
    </div>
  </Link>
  <div className="flex justify-center items-center">
    <h4 className="font-bold text-xl text-textColor "> {accountSubHead} (Ledger Vouchers) </h4>
  </div>

  <div className="ml-auto gap-3 flex items-center">
    <div className="flex text-dropdownText gap-4">
     

    

      <div className="ml-auto flex items-center">
        <button className="flex border px-2 py-1 border-gray-300 rounded-lg bg-secondary_active">
          <PrinterIcon color="gray" height={18} width={20} />
          <span className="text-sm text-neutral-500">Print</span>
        </button>
      </div>
    </div>
  </div>
</div>

<div className="bg-white p-5 rounded-xl ">
  <div className="flex items-center  justify-center gap-3 text-center py-2">
    <div>
      <p className="text-textColor font-bold whitespace-nowrap">
        Company Name
      </p>
      <p className="text-sm text-textColor whitespace-nowrap">
       {fromDate} To {toDate}
      </p>
    </div>
  </div>
  <table className="w-full text-[#495060]">
    <thead>
      <tr className="bg-lightPink text-left border-b font-bold text-sm  border-[#ebecf0]">
      <th className="p-2  min-w-[30px] max-w-[30px]  truncate">
          Date
        </th>
        <th className="p-2 text-center">Transaction Id</th>
        <th className="p-2 text-center min-w-[30px] max-w-[30px] px-1 truncate">
          Action
        </th>
        <th className="p-2 text-right min-w-[30px] max-w-[30px] px-1 truncate">
          Debit
        </th>
        <th className="p-2 text-right min-w-[30px] max-w-[30px] px-1 truncate">
          Credit
        </th>
        
      </tr>
    </thead>
    <tbody className="text-xs ">
      {item?.data?.map((item:any) => (
        <tr className="border-b border-[#ebecf0]">
       <Link to={`/reports/trialBalance/${accountSubHead}/monthly-summery`} > <td className="py-3 text-center">{item.createdDate}</td></Link>
       <td className="py-3 text-center min-w-[30px] max-w-[30px] px-1 truncate">
            {item.transactionId}
          </td>
       <td className="py-3 text-center min-w-[30px] max-w-[30px] px-1 truncate">
            {item.action}
          </td>
      
          <td className="py-3 text-right min-w-[30px] max-w-[30px] px-1 truncate">
            {item.debitAmount}
          </td>
          <td className="py-3 text-right min-w-[30px] max-w-[30px] px-1 truncate">
            {item.creditAmount}
          </td>
         
        </tr>
      ))}
    
    </tbody>
  </table>
</div>
</div>
)
}


export default Ledger