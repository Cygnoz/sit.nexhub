import { Link } from "react-router-dom";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import { useEffect, useRef, useState } from "react";
import useApi from "../../../Hooks/useApi";
import toast from "react-hot-toast";
import { endponits } from "../../../Services/apiEndpoints";
import Calender from "../../../assets/icons/Calender";
import CehvronDown from "../../../assets/icons/CehvronDown";
import { useOrganization } from "../../../context/OrganizationContext";
import Button from "../../../Components/Button";
import PrintButton from "../../../Components/PrintButton";
import { useReactToPrint } from "react-to-print";

type Props = {};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB").split("/").join("-");
}

function getFirstDayOfMonth() {
  const date = new Date();
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-01`;
}

function getLastDayOfMonth() {
  const date = new Date();
  return date.toISOString().split("T")[0];
}


const ProfitAndLoss = ({ }: Props) => {
  const { organization } = useOrganization();
  const [fromDate, setFromDate] = useState(getFirstDayOfMonth());
  const [toDate, setToDate] = useState(getLastDayOfMonth());
  const [PLData, setPLData] = useState<any>({
    debit: [],
    credit: [],
    summary: {},
  });

  const fromDateRef = useRef<HTMLInputElement>(null);
  const toDateRef = useRef<HTMLInputElement>(null);

  const handleFromDateClick = () => {
    fromDateRef.current?.showPicker();
  };

  const formattedFromDate = formatDate(fromDate);
  const formattedToDate = formatDate(toDate);

  const handleToDateClick = () => {
    toDateRef.current?.showPicker();
  };

  const { request: fetchOneItem } = useApi("get", 5006);

  console.log(PLData, "PLData");

  const getPL = async () => {
    try {
      const formattedFromDate = formatDate(fromDate);
      const formattedToDate = formatDate(toDate);
      const url = `${endponits.GET_PL_DATA}/${formattedFromDate}/${formattedToDate}`;

      const apiResponse = await fetchOneItem(url);
      const { response, error } = apiResponse;

      if (!error && response) {
        setPLData(response.data.data);
      } else {
        console.error("Error fetching Profit & Loss data:", error);
      }
    } catch (error) {
      console.error("Error in fetching Profit & Loss data:", error);
      toast.error("Failed to fetch Profit & Loss data.");
    }
  };

  useEffect(() => {
    localStorage.setItem("fromDate", formattedFromDate);
    localStorage.setItem("toDate", formattedToDate);
  }, [fromDate, toDate]);

  useEffect(() => {
    getPL();
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });


  return (
    <div className="p-5">
      <div className="flex-row sm:flex gap-5">
        <div className="flex gap-5">

          <Link to={"/reports"}>
            <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
              <CheveronLeftIcon />
            </div>
          </Link>
          <div className="flex justify-center items-center">
            <h4 className="font-bold text-xl text-textColor">Profit and Loss</h4>
          </div>
        </div>

        <div className="ml-auto gap-3 flex items-center">
          <div className="flex-row sm:flex text-dropdownText gap-4">
            <div className="flex gap-2">

            <div
              className="relative border-2 border-slate-200 flex rounded-md px-2 py-1 text-sm items-center cursor-pointer"
              onClick={handleFromDateClick}
            >
              <div className="pointer-events-none inset-y-0 flex items-center px-2 text-gray-700">
                <Calender color="currentColor" height={18} width={18} />
              </div>
              {formatDate(fromDate)}
              <div className="pointer-events-none inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <CehvronDown color="gray" />
              </div>
              <input
                type="date"
                ref={fromDateRef}
                className="absolute inset-0 opacity-0 cursor-pointer"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div
              className="relative border-2 border-slate-200 flex rounded-md px-2 py-1 text-sm items-center cursor-pointer"
              onClick={handleToDateClick}
            >
              <div className="pointer-events-none inset-y-0 flex items-center px-2 text-gray-700">
                <Calender color="currentColor" height={18} width={18} />
              </div>
              {formatDate(toDate)}
              <div className="pointer-events-none inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <CehvronDown color="gray" />
              </div>
              <input
                type="date"
                ref={toDateRef}
                className="absolute inset-1 opacity-0 cursor-pointer"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            </div>

            <div className="flex gap-2 mt-2 sm:mt-0">

            <Button className="text-xs pl-5 pr-5" size="sm" onClick={getPL}>
              Run
            </Button>

            <div className="ml-auto flex items-center" onClick={() => reactToPrintFn()}>
              <PrintButton />
            </div>

            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg my-4 p-5" ref={contentRef}>
        <div className="text-center py-4">
          <p className="text-lg font-bold text-textColor">
            {organization?.organizationName}
          </p>
          <p className="text-sm text-textColor">
            {formattedFromDate} To {formattedToDate}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Left Section (Debit) */}
          <div>
            <div className="flex w-full items-center justify-center gap-5">
              <div className="flex items-center w-8/12 text-[#585953] font-semibold justify-center rounded-md py-2 bg-gradient-to-r from-[#FFE3B8] via-[#D5DCB3] to-[#D5DCB3]">
                Particulars
              </div>
              <div className="flex items-center w-4/12 text-[#585953] font-semibold justify-center rounded-md py-2 bg-gradient-to-r from-[#FFE3B8] via-[#D5DCB3] to-[#D5DCB3]">
                Amount
              </div>
            </div>
            <tbody className="divide-y divide-[#576582]">
              {[
                {
                  accountName: "Gross Loss b/f",
                  totalAmount: PLData.debit[0]?.grossLossCd || 0,
                  link: "",
                  items: null,
                },
                {
                  accountName: "Indirect Expense",
                  totalAmount:
                    (PLData.debit[1]?.indirectExpenses?.overallNetDebit || 0) -
                    (PLData.debit[1]?.indirectExpenses?.overallNetCredit || 0),
                  link: `/reports/profitandloss/groupsummary/indirectExpense`,
                  items: PLData?.debit[1]?.indirectExpenses,
                },
                {
                  accountName: "Net Profit",
                  totalAmount: PLData.summary?.netProfit || 0,
                  link: "",
                  items: null,
                },
              ]
                .filter(
                  (item) =>
                    !(
                      (item.accountName === "Gross Loss b/f" &&
                        item.totalAmount === 0) ||
                      (item.accountName === "Net Profit" &&
                        item.totalAmount === 0)
                    )
                )
                .map((item, index) => (
                  <tr
                    key={index}
                    className={index === 2 ? "font-semibold bg-gray-50 " : ""}
                  >
                    <td className="px-6 py-3 text-sm w-full text-[#4B5C79] font-medium border-b border-stone-200 ">
                      {item.link && item.totalAmount !== 0 ? (
                        <Link
                          to={item.link}
                          state={{
                            data: item.items,
                            accountName: item.accountName,
                          }}
                        >
                          {item.accountName}
                        </Link>
                      ) : (
                        item.accountName
                      )}
                    </td>
                    <td className="px-6 border-b border-stone-200 py-3 ml-auto text-right text-sm text-[#4B5C79] font-medium">
                      {item.totalAmount}
                    </td>
                  </tr>
                ))}
            </tbody>
          </div>

          {/* Right Section (Credit) */}
          <div>
            <div className="flex w-full items-center justify-center gap-5">
              <div className="flex items-center w-8/12 text-[#585953] font-semibold justify-center rounded-md py-2 bg-gradient-to-r from-[#FFE3B8] via-[#D5DCB3] to-[#D5DCB3]">
                Particulars
              </div>
              <div className="flex items-center w-4/12 text-[#585953] font-semibold justify-center rounded-md py-2 bg-gradient-to-r from-[#FFE3B8] via-[#D5DCB3] to-[#D5DCB3]">
                Amount
              </div>
            </div>
            <table className="w-full border-collapse">
              <tbody className="">
                {[
                  {
                    accountName: "Gross Profit b/f",
                    totalAmount: PLData.credit[0]?.grossProfitCd || 0,
                    link: "",
                    items: null,
                  },
                  {
                    accountName: "Indirect Income",
                    totalAmount:
                      (PLData.credit[1]?.indirectIncome?.overallNetCredit ||
                        0) -
                      (PLData.credit[1]?.indirectIncome?.overallNetDebit || 0),
                    link: `/reports/profitandloss/groupsummary/indirectIncome`,
                    items: PLData.credit[1]?.indirectIncome,
                  },
                  {
                    accountName: "Net Loss ",
                    totalAmount: PLData.summary?.netLoss || 0,
                    link: "",
                    items: null,
                  },
                ].map((item, index) =>
                  (item.accountName === "Gross Profit b/f" &&
                    item.totalAmount === 0) ||
                    (item.accountName === "Net Loss " &&
                      item.totalAmount === 0) ? null : (
                    <tr
                      key={index}
                      className={index === 2 ? "font-semibold bg-gray-50 " : ""}
                    >
                      <td className="px-6 py-3 text-sm w-full text-[#4B5C79] font-medium border-b border-stone-200 ">
                        {item.link && item.totalAmount !== 0 ? (
                          <Link
                            to={item.link}
                            state={{
                              data: item.items,
                              accountName: item.accountName,
                            }}
                          >
                            {item.accountName}
                          </Link>
                        ) : (
                          item.accountName
                        )}
                      </td>
                      <td className="px-6 border-b border-stone-200 py-3 ml-auto text-right text-sm text-[#4B5C79] font-medium">
                        {item.totalAmount}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <table className="min-w-full">
            <tbody>
              <tr className="font-bold">
                <td className="px-6 py-3 text-sm text-[#4B5C79]">Total</td>
                <td className="px-6 py-3 text-right text-sm text-[#4B5C79]">
                  {PLData.summary?.finalDebit || 0}
                </td>
              </tr>
            </tbody>
          </table>
          <table className="min-w-full">
            <tbody>
              <tr className="font-bold">
                <td className="px-6 py-3 text-sm text-[#4B5C79]">Total</td>
                <td className="px-6 py-3 text-right text-sm text-[#4B5C79]">
                  {PLData.summary?.finalCredit || 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfitAndLoss;
