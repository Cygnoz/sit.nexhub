import { useState, useRef, useEffect } from "react";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";

interface Customer {
  _id: string;
  "Invoice No"?: string;
  date?: string;
  supplier?: string;
  status?: string;
  Amount?: number;
  "Purchase Order"?: string;
  orderdate?: string;
  supplierdisplyName?: string;
  grandTotal?: number;
}

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

const tabs = [
  {
    label: "Purchase Order",
    value: "purchase-order",
    endpoint: endponits.GET_ALL_PURCHASE_ORDER,
  },
  { label: "Bills", value: "bills", endpoint: endponits.GET_ALL_BILLS },
  {
    label: "Payment Made",
    value: "payment-made",
    endpoint: endponits.GET_PAYMENTMADE,
  },
  {
    label: "Debit Note",
    value: "debit-note",
    endpoint: endponits.GET_ALL_DEBIT_NOTE,
  },
];

const RecentTransaction = () => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const contentRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Customer[]>([]);
  const { request: getData } = useApi("get", 5005);

  const columns: Record<string, Column[]> = {
    "purchase-order": [
      { id: "purchaseOrder", label: "Purchase Order", visible: true },
      { id: "createdDate", label: "Date", visible: true },
      { id: "supplierDisplayName", label: "Supplier", visible: true },
      { id: "status", label: "Status", visible: true },
      { id: "grandTotal", label: "Amount", visible: true },
    ],
    bills: [
      { id: "billNumber", label: "Bill No", visible: true },
      { id: "createdDate", label: "Date", visible: true },
      { id: "supplierDisplayName", label: "Supplier", visible: true },
      { id: "paidStatus", label: "Status", visible: true },
      { id: "grandTotal", label: "Amount", visible: true },
    ],
    "payment-made": [
      { id: "createdDate", label: "Date", visible: true },
      { id: "paymentMade", label: "Payment", visible: true },

      { id: "supplierDisplayName", label: "Supplier", visible: true },
      { id: "paymentMode", label: "Mode", visible: true },

      { id: "amountPaid", label: "Amount", visible: true },
    ],
    "debit-note": [
      { id: "createdDate", label: "Date", visible: true },
      { id: "debitNote", label: "Debit Note", visible: true },

      { id: "supplierDisplayName", label: "Supplier", visible: true },
      { id: "grandTotal", label: "Amount", visible: true },
    ],
  };

  const getPurchaseData = async (url: string) => {
    setLoading(true);
    try {
      const { response, error } = await getData(url);
      if (!error && response) {
        setData(
          response.data.allPurchaseOrder ||
          response.data.allBills ||
          response.data.allPayments ||
          response.data.allDebitNotes ||
          response.data
        );
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPurchaseData(selectedTab.endpoint);
  }, [selectedTab]);

  const renderColumnContent = (colId: string, item: Customer) => {
    if (colId === "status") {
      return (
        <p
          className={`py-1 text-[13px] rounded items-center ms-auto text-white h-[18px] flex justify-center ${
            item.status === "Active" ? "bg-[#78AA86]" : "bg-zinc-400"
          }`}
        >
          {item.status}
        </p>
      );
    }
    return <span>{item[colId as keyof Customer] || <span className="text-gray-500 italic">-</span>}</span>;
  };

  return (
    <div className="bg-white p-5 rounded-md">
      <h3 className="mb-6 text-[16px] font-bold">Recent Transactions</h3>

      {/* Tabs */}
      <div className="flex gap-3">
        {tabs.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedTab(item)}
            className={`h-34 rounded-3xl text-textColor text-sm px-4 py-3 cursor-pointer font-semibold ${
              selectedTab.value === item.value ? "bg-[#dadcce]" : "bg-[#fcffee]"
            }`}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* Table */}
      <div ref={contentRef} className="mt-3 overflow-y-scroll hide-scrollbar max-h-[25rem]">
        <table className="min-w-full bg-white mb-5">
          <thead className="text-[12px] text-center text-dropdownText">
            <tr style={{ backgroundColor: "#F9F7F0" }}>
              <th className="py-3 px-4 border-b border-tableBorder">Sl.No</th>
              {columns[selectedTab.value].map(
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
                  <td colSpan={columns[selectedTab.value].length + 1} className="py-3">Loading...</td>
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item._id} className="relative">
                  <td className="py-2.5 px-4 border-y border-tableBorder">{index + 1}</td>
                  {columns[selectedTab.value].map(
                    (col) =>
                      col.visible && (
                        <td key={col.id} className="py-2.5 px-4 border-y border-tableBorder">
                          {renderColumnContent(col.id, item)}
                        </td>
                      )
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns[selectedTab.value].length + 1} className="py-3 text-gray-500 italic">
                  No transaction data found
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
