import { useState, useEffect, useRef } from "react";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import NoData from "../../../Components/charts/Nodata";

type Props = {
  date?: string;
};

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

const tabs = ["Purchase Order", "Bills", "Payment Made", "Debit Note"];

const RecentTransaction = ({ date }: Props) => {
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionData, setTransactionData] = useState<any[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const { request: getTransaction } = useApi("get", 5005);

  useEffect(() => {
    fetchData();
  }, [selectedTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { response, error } = await getTransaction(
        `${endponits.PURCHASE_DASH_RECENT_TRANSACTIONS}?date=${date}`
      );
      if (response?.data) {
        setTransactionData(mapData(response.data));
      } else {
        setTransactionData([]);
      }
    } catch (err) {
      console.error("Error fetching transactions", err);
      setTransactionData([]);
    }
    setLoading(false);
  };

  const mapData = (data: any) => {
    switch (selectedTab) {
      case "Purchase Order":
        return data.recentOrders || [];
      case "Bills":
        return data.recentBills || [];
      case "Payment Made":
        return data.recentPaymentMade || [];
      case "Debit Note":
        return data.recentDebitNotes || [];
      default:
        return [];
    }
  };

  const columns: Record<string, Column[]> = {
    "Purchase Order": [
      { id: "purchaseOrder", label: "Purchase Order", visible: true },
      { id: "purchaseOrderDate", label: "Date", visible: true },
      { id: "supplierName", label: "Supplier", visible: true },
      { id: "status", label: "Status", visible: true },
      { id: "totalAmount", label: "Amount", visible: true },
    ],
    Bills: [
      { id: "billNumber", label: "Bill No", visible: true },
      { id: "billDate", label: "Date", visible: true },
      { id: "supplierName", label: "Supplier", visible: true },
      { id: "paidStatus", label: "Status", visible: true },
      { id: "totalAmount", label: "Amount", visible: true },
    ],
    "Payment Made": [
      { id: "paymentMade", label: "Payment ID", visible: true },
      { id: "paymentDate", label: "Date", visible: true },
      { id: "supplierName", label: "Supplier", visible: true },
      { id: "paymentMode", label: "Mode", visible: true },
      { id: "totalAmount", label: "Amount", visible: true },
    ],
    "Debit Note": [
      { id: "debitNote", label: "Debit Note", visible: true },
      { id: "supplierDebitDate", label: "Date", visible: true },
      { id: "supplierName", label: "Supplier", visible: true },
      { id: "totalAmount", label: "Amount", visible: true },
    ],
  };

  return (
    <div className="bg-white p-5 rounded-md">
      <h3 className="mb-6 text-[16px] font-bold">Recent Transactions</h3>

      <div className="flex gap-3">
        {tabs.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedTab(item)}
            className={`h-10 rounded-3xl text-textColor text-sm px-4 py-3 cursor-pointer font-semibold ${
              selectedTab === item ? "bg-[#dadcce]" : "bg-[#fcffee]"
            }`}
          >
            {item}
          </div>
        ))}
      </div>

      <div ref={contentRef} className="mt-3 overflow-y-scroll hide-scrollbar max-h-[25rem]">
        <table className="min-w-full bg-white mb-5">
          <thead className="text-[12px] text-center text-dropdownText">
            <tr style={{ backgroundColor: "#F9F7F0" }}>
              <th className="py-3 px-4 border-b border-tableBorder">Sl.No</th>
              {columns[selectedTab].map(
                (col) =>
                  col.visible && (
                    <th key={col.id} className="py-2 px-4 font-medium border-b border-tableBorder">
                      {col.label}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {loading ? (
              [...Array(5)].map((_, idx) => (
                <tr key={idx}>
                  <td colSpan={columns[selectedTab].length + 1} className="py-3">Loading...</td>
                </tr>
              ))
            ) : transactionData.length > 0 ? (
              transactionData.map((item: any, index) => (
                <tr key={item._id} className="relative">
                  <td className="py-2.5 px-4 border-y border-tableBorder">{index + 1}</td>
                  {columns[selectedTab].map(
                    (col) =>
                      col.visible && (
                        <td key={col.id} className="py-2.5 px-4 border-y border-tableBorder">
                          {col.id === "status" ? (
                            <span
                              className={`py-1 text-[13px] rounded items-center ms-auto text-white h-[18px] flex justify-center ${
                                item.status === "Active" ? "bg-[#78AA86]" : "bg-zinc-400"
                              }`}
                            >
                              {item.status}
                            </span>
                          ) : (
                            <span>{item[col.id] || <span className="text-gray-500 italic">-</span>}</span>
                          )}
                        </td>
                      )
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns[selectedTab].length + 1}>
                  <NoData parentHeight="400px" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransaction;
