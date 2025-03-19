import { Link, useParams, useLocation } from "react-router-dom";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import { useCallback, useEffect, useRef, useState } from "react";
import PrintButton from "../../../Components/PrintButton";
import { useReactToPrint } from "react-to-print";

type TrialBalance = {
  _id: string;
  organizationId: string;
  date: string;
  accountId: string;
  accountName: string;
  action: string;
  creditAmount: number;
  debitAmount: number;
  remark: string;
  cumulativeSum: any;
  createdDate: string;
  createdTime: string
};

function AccountantView() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const fromCash = searchParams.get("fromCash") === "true";
  const fromBank = searchParams.get("fromBank") === "true";
  const { request: getOneTrialBalance } = useApi("get", 5001);
  const { request: getOneOrganization } = useApi("get", 5004);
  const [oneOrganization, setOneOrganization] = useState<any | []>([]);
  const [trialBalance, setTrialBalance] = useState<TrialBalance[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredTrialBalance, setFilteredTrialBalance] = useState<TrialBalance[]>([]);



  // Function to fetch data
  const getOneTrialBalanceData = async () => {
    try {
      const url = `${endponits.GET_ONE_TRIAL_BALANCE}/${id}`;

      const { response, error } = await getOneTrialBalance(url);
      if (!error && response) {
        // Sort by createdDateTime before setting state
        const sortedData = response.data.sort((a: any, b: any) => {
          const dateA = new Date(a.createdDateTime).getTime();
          const dateB = new Date(b.createdDateTime).getTime();
          return dateA - dateB; // Ascending order
        });

        setTrialBalance(sortedData);

        // Apply initial filtering
        applyDateFilter(sortedData);
      }
    } catch (error) {
      console.error("Error fetching trial balance:", error);
    }
  };

  // Function to apply date filter
  const applyDateFilter = useCallback((data = trialBalance) => {
    if (!fromDate && !toDate) {
      // If no date range is selected, show all data
      setFilteredTrialBalance(data);
      return;
    }

    const filtered = data.filter((item: any) => {
      const itemDate = new Date(item.createdDateTime);

      // Set time to midnight for proper comparison
      const fromDateObj = fromDate ? new Date(fromDate) : null;
      const toDateObj = toDate ? new Date(toDate) : null;

      // If only from date is selected
      if (fromDate && !toDate && fromDateObj) {
        return itemDate >= fromDateObj;
      }

      // If only to date is selected
      if (!fromDate && toDate && toDateObj) {
        toDateObj.setHours(23, 59, 59, 999); // Set to end of day
        return itemDate <= toDateObj;
      }

      // If both dates are selected
      if (fromDateObj && toDateObj) {
        toDateObj.setHours(23, 59, 59, 999); // Set to end of day
        return itemDate >= fromDateObj && itemDate <= toDateObj;
      }

      // If no valid date conditions match, include the item (when no filters are applied)
      return true;
    });

    setFilteredTrialBalance(filtered);
  }, [fromDate, toDate, trialBalance]);

  // Apply filter when dates change
  useEffect(() => {
    applyDateFilter();
  }, [fromDate, toDate, applyDateFilter]);

  useEffect(() => {
    getOneTrialBalanceData();
  }, [id]);


  const getOrganization = async () => {
    try {
      const url = `${endponits.GET_ONE_ORGANIZATION}`;
      const { response, error } = await getOneOrganization(url);

      if (!error && response?.data) {
        setOneOrganization(response.data);
      }
    } catch (error) {
      console.error("Error fetching organization:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getOneTrialBalanceData();
      getOrganization();
    }
  }, [id]);

  const calculateTotal = () => {
    const totalCredit = trialBalance.reduce(
      (sum, item) => sum + (Number(item.creditAmount) || 0),
      0
    );
    const totalDebit = trialBalance.reduce(
      (sum, item) => sum + (Number(item.debitAmount) || 0),
      0
    );
    return totalDebit - totalCredit;
  };

  const formattedTotal = () => {
    const total = calculateTotal();
    const absoluteValue = Math.abs(total).toFixed(2); // Remove negative sign
    return total < 0 ? `${absoluteValue} (Cr)` : `${absoluteValue} (Dr)`;
  };


  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div className="px-6">
      <div className="flex justify-between items-center gap-5 mb-2">
        <div className="flex items-center gap-2">

          <Link to={fromCash ? "/accountant/cash" : fromBank ? "/accountant/bank" : "/accountant/chart-OF-accountant"}>
            <div
              style={{ borderRadius: "50%" }}
              className="w-[40px] h-[40px] flex items-center justify-center bg-white"
            >
              <CheveronLeftIcon />
            </div>
          </Link>
          <p className="text-textColor text-xl font-bold">
            {trialBalance.length > 0 && trialBalance[0].accountName}
          </p>
        </div>
        <div className="flex gap-2 items-end">
          <div>
            <label htmlFor="fromDate">Select From Date</label>
            <input
              type="date"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-inputBorder rounded p-1.5 pl-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="toDate">Select To Date</label>
            <input
              type="date"
              id="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-inputBorder rounded p-1.5 pl-2 text-sm"
            />
          </div>
          <button
            onClick={() => applyDateFilter()}
            className="bg-primary text-gray-200 hidden px-4 py-1.5 rounded text-sm"
          >
            Filter
          </button>
          {(fromDate || toDate) && (
            <button
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
              className="bg-gray-200 text-gray-200 border border-gray-200 px-2  py-1.5 rounded text-sm"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="p-6 rounded-lg bg-white">
        <div className="flex justify-between mb-4">
          <p className="font-bold text-textColor text-base">Recent Transaction</p>
          {/* FCY/BCY Toggle Buttons */}
          {/* <div className="flex text-[#565148] text-xs font-medium">
            <button className="border border-[#565148] border-r-0 px-3 py-1 rounded-s-lg text-sm">FCY</button>
            <button className="border border-[#565148] px-3 py-1 rounded-e-lg text-sm">BCY</button>
          </div> */}
          <div className="flex gap-2">
            <div className="flex gap-4" onClick={() => reactToPrintFn()}>
              <PrintButton />
            </div>

          </div>
        </div>

        {/* Table Section */}
        <div  ref={contentRef} className="overflow-x-auto ">
          <table className="min-w-full bg-white border border-tableBorder rounded-lg">
            <thead className="text-[12px] text-center text-dropdownText">
              <tr className="bg-[#F9F7F0]">
                <th className="py-3 px-4 font-medium border-b border-tableBorder text-sm">Date</th>
                <th className="py-3 px-4 font-medium border-b border-tableBorder text-sm">Type</th>
                <th className="py-3 px-4 font-medium border-b border-tableBorder text-sm">
                  Debit {oneOrganization.baseCurrency && `(${oneOrganization.baseCurrency})`}
                </th>
                <th className="py-3 px-4 font-medium border-b border-tableBorder text-sm">
                  Credit {oneOrganization.baseCurrency && `(${oneOrganization.baseCurrency})`}
                </th>
                <th className="py-3 px-4 font-medium border-b border-tableBorder text-sm">Amount</th>
                <th className="py-3 px-4 font-medium border-b border-tableBorder text-sm">Note</th>

              </tr>
            </thead>
            <tbody className="text-dropdownText text-center text-[13px]">
              {/* Check if trialBalance array has data */}
              {trialBalance.length > 0 ? (
                filteredTrialBalance.map((item) => (
                  <tr key={item._id}>
                    <td className="py-3 px-4 border-b border-tableBorder">
                      {item?.createdDate ? (
                        `${item.createdDate}
                        `
                      ) : '-'}
                    </td>

                    <td className="py-3 px-4 border-b border-tableBorder">
                      {item?.action || '-'}
                    </td>
                    <td className="py-3 px-4 border-b border-tableBorder">
                      {item?.debitAmount ? item.debitAmount : '0.00'}
                    </td>
                    <td className="py-3 px-4 border-b border-tableBorder">
                      {item?.creditAmount ? item.creditAmount : '0.00'}
                    </td>
                    <td className="py-3 px-4 border-b border-tableBorder">
                      {item?.cumulativeSum ? item.cumulativeSum : '0.00'}
                    </td>
                    <td className="py-3 px-4 border-b border-tableBorder">
                      {item?.remark ? item.remark : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-3 px-4 border-b border-tableBorder text-center text-red-600">
                    Not found !
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-4 text-end">
            <p className="text-textColor font-bold me-36">
              <div>
                Total: <span>{formattedTotal()}</span>
              </div>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountantView;
