import { useEffect, useState } from "react";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import NoData from "../../../Components/charts/Nodata";

type Props = {
    date: any;
};

const tabs = ["Invoices", "Sales Orders", "Quotes", "Credit Notes"];

function RecentTransactions({ date }: Props) {
    const [activeTab, setActiveTab] = useState("Invoices");

    const { request: recentTransaction } = useApi('get', 5007);
    const [recentTrans, setRecentTrans] = useState<any>({
        recentCreditNotes: { tab: 'Credit Notes', data: [] },
        recentInvoices: { tab: 'Invoices', data: [] },
        recentOrders: { tab: 'Sales Orders', data: [] },
        recentQuotes: { tab: 'Quotes', data: [] },
    });

    const getRecentTrans = async () => {
        try {
            const { response, error } = await recentTransaction(`${endponits.SALES_DASH_RECENT_TRANSACTIONS}?date=${date}`);
            if (response && !error) {
                console.log('recent', response.data);
                setRecentTrans(response.data);
            } else {
                console.log('Error fetching recent transactions:', error);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    useEffect(() => {
        if (date) {
            getRecentTrans();
        }
    }, [date]);

    const tabDataMapping: any = {
        "Invoices": {
            key: "recentInvoices",
            columns: ["salesInvoice", "salesInvoiceDate", "customerName", "paidStatus", "totalAmount"],
            label: "Invoice No.",
        },
        "Credit Notes": {
            key: "recentCreditNotes",
            columns: ["creditNote", "customerCreditDate", "customerName", "totalAmount"],
            label: "Credit Note No.",
        },
        "Sales Orders": {
            key: "recentOrders",
            columns: ["salesOrder", "salesOrderDate", "customerName", "status", "totalAmount"],
            label: "Order No.",
        },
        "Quotes": {
            key: "recentQuotes",
            columns: ["salesQuotes", "salesQuoteDate", "customerName", "status", "totalAmount"],
            label: "Quote No.",
        },
    };

    // Get data for the active tab
    const activeTabData = recentTrans[tabDataMapping[activeTab].key] || { data: [] };

    return (
        <div className="bg-white w-full rounded-lg py-4 px-6">
            <p className="text-[#303F58] font-bold text-base">Recent Transactions</p>

            {/* Tabs */}
            <div className="flex gap-3 mt-4">
                {Object.keys(tabDataMapping).map((tab) => (
                    <button
                        key={tab}
                        className={`py-1.5 px-4 rounded-full text-[#585953] text-xs font-semibold ${
                            activeTab === tab ? "bg-[#DADCCD]" : "bg-[#FCFFED]"
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="mt-5">
                {activeTabData?.length > 0 ? (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#F9F7F0] text-left text-xs">
                                <th className="py-3 px-4 text-[#303F58] font-semibold border-b border-tableBorder">
                                    {tabDataMapping[activeTab].label}
                                </th>
                                {tabDataMapping[activeTab].columns.slice(1).map((heading: any, index: number) => (
                                    <th
                                        className="py-3 px-4 font-medium border-b border-tableBorder text-start"
                                        key={index}
                                    >
                                        {heading.replace(/([A-Z])/g, " $1").trim()}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {activeTabData?.map((item: any, index: number) => (
                                <tr key={index} className="border-b border-tableBorder text-xs text-[#4B5C79]">
                                    {tabDataMapping[activeTab].columns.map((col: any, idx: number) => (
                                        <td key={idx} className="py-3 px-4">
                                            {col === "paidStatus" || col === "status" ? (
                                                <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-md ${
                                                    item[col] === "Paid" || 
                                                    item[col] === "Completed" || 
                                                    item[col] === "Accepted" || 
                                                    item[col] === "Confirmed"
                                                        ? "bg-green-100 text-green-700"
                                                    : item[col] === "Sent"
                                                        ? "bg-blue-100 text-blue-700"
                                                    : item[col] === "Overdue"
                                                        ? "bg-red-100 text-red-700"
                                                    : "bg-gray-200 text-gray-600"
                                                }`}
                                            >
                                                {item[col]}
                                            </span>
                                            
                                            ) : (
                                                item[col]
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <NoData parentHeight="300px"/>
                )}
            </div>
        </div>
    );
}

export default RecentTransactions;
