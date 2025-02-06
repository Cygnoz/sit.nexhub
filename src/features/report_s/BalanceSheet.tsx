import { Link } from "react-router-dom";
import CheveronLeftIcon from "../../assets/icons/CheveronLeftIcon";
import { useEffect, useRef, useState } from "react";
import useApi from "../../Hooks/useApi";
import toast from "react-hot-toast";
import { endponits } from "../../Services/apiEndpoints";
import Calender from "../../assets/icons/Calender";
import CehvronDown from "../../assets/icons/CehvronDown";
import { PrinterIcon } from "@heroicons/react/20/solid";
import { useOrganization } from "../../context/OrganizationContext";

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
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];
}

const BalanceSheet = ({}: Props) => {
  const [BSData, setBSData] = useState<any | []>([]);
      const {organization} = useOrganization()

  const [fromDate, setFromDate] = useState(getFirstDayOfMonth());
  const [toDate, setToDate] = useState(getLastDayOfMonth());
  // const [total, setTotal] = useState<any>({})
  // const navigate = useNavigate();

  const fromDateRef = useRef<HTMLInputElement>(null);
  const toDateRef = useRef<HTMLInputElement>(null);

  const handleFromDateClick = () => {
    fromDateRef.current?.showPicker();
  };

  const handleToDateClick = () => {
    toDateRef.current?.showPicker();
  };

  const { request: fetchOneItem } = useApi("get", 5006);

  const formattedFromDate = formatDate(fromDate);
  const formattedToDate = formatDate(toDate);
  const getBSData = async () => {
    try {
      const url = `${endponits.GET_BS_DATA}/${formattedFromDate}/${formattedToDate}`;

      // Fetch data using the API hook
      const apiResponse = await fetchOneItem(url);
      const { response, error } = apiResponse;

      if (!error && response) {
        setBSData(response.data.data); // Assuming `data` contains the main records
      } else {
        console.error("Error fetching Balance Sheet data:", error);
      }
    } catch (error) {
      console.error("Error in fetching Balance Sheet data:", error);
      toast.error("Failed to fetchBalance Sheet data.");
    }
  };
  useEffect(() => {
    getBSData();
  }, [fromDate, toDate]);

  // const handleItemClick = (account: string) => {
  //   if (account === "Capital Account") {
  //     // Navigate to the specific path for Indirect Expense
  //     navigate("/reports/profitandloss/indirectExpense");
  //   }
  // };

  console.log(BSData.summary, "dert");

  return (
    <div className="p-5">
      <div className="flex gap-5">
        <Link to={"/reports"}>
          <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <h4 className="font-bold text-xl text-textColor ">Balance sheet </h4>
        </div>
        <div className="ml-auto gap-3 flex items-center">
          <div className="flex text-dropdownText gap-4">
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

            <div className="ml-auto flex items-center">
              <button className="flex border px-2 py-1 border-gray-300 rounded-lg bg-secondary_active">
                <PrinterIcon color="gray" height={18} width={20} />
                <span className="text-sm text-neutral-500">Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mt-2">
        <div className="flex justify-center items-center mb-2">
          <div className="text-center">
            <p className="font-bold text-textColor"> {organization?.organizationName}</p>
            <p className="text-sm text-textColor">
              {formattedFromDate} To {formattedToDate}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {/* Debit Table */}
          <div>
            <div className="overflow-hidden ">
              {/* Table Header */}
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="flex items-center text-[#585953] font-semibold justify-center rounded-md py-2 bg-[#F7ECD9] me-5 ">
                      Particulars
                    </th>
                    <th className="items-center text-[#585953] font-semibold justify-center rounded-md py-2 bg-[#F7ECD9]">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAECF0]">
                  {BSData?.credit?.map((item: any, index: number) => {
                    let accountName = "";
                    let totalAmount = 0;
                    let items = [];
                    let link = "";

                    if (item.equity) {
                      accountName = "equity";
                      totalAmount =
                        item.equity.overallNetCredit -
                        item.equity.overallNetDebit;
                      items = item;
                      link = `/reports/balance-sheet/accounts/${accountName}`;
                      console.log(item.equity);
                    } else if (item.currentLiabilities) {
                      const accountSubhead = "currentLiabilities";
                      accountName = "Current Liabilities";
                      totalAmount =
                        item.currentLiabilities.overallNetCredit -
                        item.currentLiabilities.overallNetDebit;
                      items = item;
                      link = `/reports/balance-sheet/accounts/${accountSubhead}`;
                      console.log(item, "purchase");
                    } else if (item.nonCurrentLiabilities) {
                      const accountSubhead = "nonCurrentLiabilities";
                      accountName = "Non-Current Liabilities";
                      totalAmount =
                        item.nonCurrentLiabilities.overallNetCredit -
                        item.nonCurrentLiabilities.overallNetDebit;
                      items = item;
                      link = `/reports/balance-sheet/accounts/${accountSubhead}`;
                    } else if (item.netLossCd) {
                      accountName = "Net Loss (c/d)";
                      totalAmount = item.netLossCd;
                    }
                    if (totalAmount === 0) {
                      link = "";
                    }

                    return (
                      <tr
                        key={index}
                        className={
                          index === BSData?.debit.length - 1
                            ? "font-semibold bg-gray-50"
                            : ""
                        }
                      >
                        <td className="px-6 py-3 text-sm text-[#4B5C79] font-medium">
                          <Link to={link} state={{ items }}>
                            {accountName}
                          </Link>
                        </td>
                        <td className="px-6 py-3 text-right text-sm text-[#4B5C79] font-medium">
                          {totalAmount}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="px-6 py-3  text-sm text-[#4B5C79] font-bold">
                      Total
                    </td>
                    <td className="px-6 py-3 text-right  text-sm text-[#4B5C79] font-bold">
                      {BSData?.summary?.finalCredit}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Credit Table */}
          <div>
            <div className=""></div>{" "}
            <div className="overflow-hidden ">
              {/* Table Header */}
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="flex items-center text-[#585953] font-semibold justify-center rounded-md py-2 bg-[#F7ECD9] mx-5">
                      Particulars
                    </th>
                    <th className="items-center text-[#585953] font-semibold justify-center rounded-md py-2 bg-[#F7ECD9]">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAECF0] ">
                  {BSData?.debit?.map((item: any, index: number) => {
                    let accountName = "";
                    let totalAmount = 0;
                    let items = [];
                    let link = "";
                    if (item.currentAssets) {
                      const accountSubhead = "currentAssets";
                      accountName = "Current Assets";
                      totalAmount =
                        item.currentAssets.overallNetDebit -
                        item.currentAssets.overallNetCredit;
                      items = item;
                      link = `/reports/balance-sheet/accounts/${accountSubhead}`;
                    } else if (item.nonCurrentAssets) {
                      accountName = "nonCurrentAssets";
                      totalAmount =
                        item.nonCurrentAssets.overallNetDebit -
                        item.nonCurrentAssets.overallNetCredit;
                      items = item;
                      link = `/reports/balance-sheet/accounts/${accountName}`;
                    } else if (item.grossLoss) {
                      accountName = "Gross Loss";
                      totalAmount = item.grossLoss;
                    }

                    if (totalAmount === 0) {
                      link = "";
                    }

                    return (
                      <tr
                        key={index}
                        className={
                          index === BSData?.credit.length - 1
                            ? "font-semibold bg-gray-50"
                            : ""
                        }
                      >
                        <Link to={link} state={{ items, fromDate, toDate }}>
                          <td className="px-6 py-3 text-sm text-[#4B5C79] font-medium">
                            {accountName}
                          </td>
                        </Link>
                        <td className="px-6 py-3 text-right text-sm text-[#4B5C79] font-medium">
                          {totalAmount}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="px-6 py-3  text-sm text-[#4B5C79] font-bold">
                      Total
                    </td>
                    <td className="px-6 py-3 text-right  text-sm text-[#4B5C79] font-bold">
                      {BSData?.summary?.finalCredit}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
