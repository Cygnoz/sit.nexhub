import { useEffect, useState } from 'react';
import NoData from '../../../Components/charts/Nodata';
import useApi from '../../../Hooks/useApi';
import { endponits } from '../../../Services/apiEndpoints';
type Props = {
  date:string
};


const AccountPayableAging = ({date}:Props) => {
  const { request: getPayableAging } = useApi("get", 7001);
  const [payableAging, setPayableAging] = useState<any>([]);
 
  const getPayable = async () => {
    try {
      const { response, error } = await getPayableAging(
        `${endponits.ACCOUNT_DASH_PAYABLE_AGING}?date=${date}`
      );
      if (response && !error) {
        console.log("top", response.data);
       
        // Transform API response into required format
        setPayableAging(response?.data?.accountsPayableAging);
      } else {
        console.log("err", error);
      }
    } catch (error) {
      console.log("er", error);
    }
  };
 
  useEffect(() => {
    if (date) {
      getPayable();
    }
  }, [date]);



  const tableHeaders = [
    "Supplier",
    "Amount",
    "Due Date",
    "Aging",
  ];

  return (
    <div className="bg-white rounded-lg w-full px-8 py-6">
      <div className="flex justify-between items-center">
        <h3 className="text-[16px] font-bold">Account Payable Aging</h3>
        {/* <select
          className="border border-[#565148] h-8 pl-3 pr-4 rounded-md bg-[#FEFDFA] text-xs font-semibold text-gray-800"
          style={{ color: "#585953" }}
        >
          <option>Select Supplier</option>
          <option>Other</option>
          <option>Other</option>
          <option>Other</option>
        </select> */}
      </div>
      <div className="overflow-x-auto pt-3">
      {payableAging?.length>0?
        <table className="min-w-full table-auto text-left">
          <thead className="border-b text-xs border-tableBorder bg-[#FDF8F0] p-4">
          <tr style={{ backgroundColor: "#F9F7F0" }}>
              {tableHeaders.map((heading, index) => (
                <th
                  className={`py-4 px-4 font-medium border-b border-tableBorder text-start`}
                  key={index}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payableAging?.map((acc:any, index:any) => (
              <tr key={index} className="border-b border-tableBorder">
                <td className="px-4 py-2 text-xs text-dropdownText">{acc.supplier}</td>
                <td className="px-4 py-2">
                <td className="px-4 py-2 text-xs text-gray-700">{acc.amount}</td>
                </td>
                <td className="px-4 py-2 text-xs text-gray-700">{acc.dueDate}</td>
                <td className="px-4 py-2 text-xs text-gray-700">{acc.aging}</td>
              </tr>
            ))}
          </tbody>
        </table>
        :
        <NoData parentHeight="350px"/>
        }
      </div>
      
    </div>
  );
};

export default AccountPayableAging;
