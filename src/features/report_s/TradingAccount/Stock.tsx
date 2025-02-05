import { Link, useLocation, useParams } from 'react-router-dom';
import CheveronLeftIcon from '../../../assets/icons/CheveronLeftIcon';
import PrinterIcon from '../../../assets/icons/PrinterIcon';
import { useEffect, useState } from 'react';

type Props = {}

const Stock = ({}: Props) => {
     const { accountName } = useParams();
    
      const location = useLocation();
      const { items } = location.state || {};
      console.log(items);

      const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const storedFromDate = localStorage.getItem("fromDate");
    const storedToDate = localStorage.getItem("toDate");

    if (storedFromDate) setFromDate(storedFromDate);
    if (storedToDate) setToDate(storedToDate);
  }, []);
    
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4 gap-2">
        <Link to={"/reports/trading-account"}>
          <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <h4 className="font-bold text-xl text-textColor ">
            {" "}
            {accountName} Summery{" "}
          </h4>
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
              <th className="p-2">Particulars</th>
              <th className="p-2 text-right min-w-[30px] max-w-[30px] px-1 truncate">
                Quantity
              </th>
              <th className="p-2 text-right min-w-[30px] max-w-[30px] px-1 truncate">
                Rate
              </th>
              <th className="p-2 text-right min-w-[30px] max-w-[30px] px-1 truncate">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="text-xs ">
            {items?.items?.map((items: any) => (
              <tr className="border-b border-[#ebecf0]">
               
                  {" "}
                  <td className="py-3">{items.itemName}</td>
           
                <td className="py-3 text-right min-w-[30px] max-w-[30px] px-1 truncate">
                  {Number(items.totalDebit) - Number(items.totalCredit)}
                </td>
                <td className="py-3 text-right min-w-[30px] max-w-[30px] px-1 truncate">
                  {items.lastCostPrice
                  }
                </td>
                <td className="py-3 text-right min-w-[30px] max-w-[30px] px-1 truncate">
                {(Number(items.totalDebit) - Number(items.totalCredit))*items.lastCostPrice}
                </td>
              </tr>
            ))}
            <td className="py-3 font-bold">Total</td>
            <td className="py-3 text-right font-bold"></td>
            <td className="py-3 text-right font-bold"></td>

            <td className="py-3 text-right font-bold">{items.total}</td>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Stock