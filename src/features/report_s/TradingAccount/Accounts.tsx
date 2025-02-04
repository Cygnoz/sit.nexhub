import { Link, useLocation, useParams } from "react-router-dom";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import PrinterIcon from "../../../assets/icons/PrinterIcon";

type Props = {};

const Accounts = ({}: Props) => {
  const { accountSubhead } = useParams();
  const location = useLocation();
  const { items, fromDate, toDate } = location.state || {};
console.log(items)
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4 gap-2">
        <Link to={"/reports/tradingAccount"}>
          <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <h4 className="font-bold text-xl text-textColor ">
            <span className="capitalize">{accountSubhead}</span> Account
          </h4>
        </div>

        <div className="ml-auto gap-3 flex items-center">
          <button className="flex border px-2 py-1 border-gray-300 rounded-lg bg-secondary_active">
            <PrinterIcon color="gray" height={18} width={20} />
            <span className="text-sm text-neutral-500">Print</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl">
        <div className="flex items-center justify-center gap-3 text-center py-2">
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
            <tr className="bg-lightPink text-left border-b font-bold text-sm border-[#ebecf0]">
              <th className="p-2">Particulars</th>
              <th className="p-2 text-right min-w-[30px] max-w-[30px] px-1 truncate">Debit</th>
              <th className="p-2 text-right min-w-[30px] max-w-[30px] px-1 truncate">Credit</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            <tr className="border-b border-[#ebecf0]">
              <td className="py-3 text-start min-w-[30px] max-w-[30px] px-1 truncate">Opening Balance</td>
              <td className="py-3 text-right min-w-[30px] max-w-[30px] px-1 truncate">
                {items?.[accountSubhead as string]?.openingBalance?.totalDebit ?? "0.00"}
              </td>
              <td className="py-3 text-right min-w-[30px] max-w-[30px] px-1 truncate">
                {items?.[accountSubhead as string]?.openingBalance?.totalCredit ?? "0.00"}
              </td>
            </tr>

            {items?.[accountSubhead as string]?.[accountSubhead as string]?.[0]?.accounts?.map((items: any, index: number) => (
              <tr key={index} className="border-b border-[#ebecf0]">
                <td className="py-3">
                  <Link
                    to={`/reports/trialBalance/${accountSubhead}/monthly-summery`}
                    state={{ items, fromDate, toDate }}
                    className="text-blue-600 underline"
                  >
                    {items.accountName}
                  </Link>
                </td>
                <td className="py-3 text-right min-w-[30px] max-w-[30px] px-1 truncate">
                  {items.totalDebit ?? "0.00"}
                </td>
                <td className="py-3 text-right min-w-[30px] max-w-[30px] px-1 truncate">
                  {items.totalCredit ?? "0.00"}
                </td>
              </tr>
            ))}

            <tr>
              <td className="py-3 font-bold">Total</td>
              <td className="py-3 text-right font-bold">
                {items?.[accountSubhead as string]?.overallNetDebit ?? "0.00"}
              </td>
              <td className="py-3 text-right font-bold">
                {"00" + (items?.[accountSubhead as string]?.overallNetCredit ?? "0.00")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Accounts;
