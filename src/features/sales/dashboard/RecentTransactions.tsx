import { useState } from "react";

type Props = {};

const tabs = ["Invoices", "Sales Orders", "Quotes", "Sales Return"];

const transactionsData: any = {
    Invoices: [
        { id: "INV-00001", date: "01/11/24", customer: "Ashwathy MT", status: "Paid", amount: "₹10,000.00" },
        { id: "INV-00002", date: "04/11/24", customer: "Athira P", status: "Draft", amount: "₹5,000.00" },
        { id: "INV-00003", date: "02/11/24", customer: "Sourav K", status: "Draft", amount: "₹6,000.00" },
        { id: "INV-00004", date: "04/11/24", customer: "Athul KP", status: "Paid", amount: "₹5,000.00" },
        { id: "INV-00005", date: "05/11/24", customer: "Ashwathy MT", status: "Draft", amount: "₹10,000.00" },
        { id: "INV-00006", date: "05/11/24", customer: "Ashwathy MT", status: "Paid", amount: "₹10,000.00" },
    ],
    "Sales Orders": [
        { id: "SO-00001", date: "01/11/24", customer: "John Doe", status: "Completed", amount: "₹15,000.00" },
        { id: "SO-00002", date: "03/11/24", customer: "Jane Smith", status: "Pending", amount: "₹7,500.00" },
    ],
    Quotes: [
        { id: "Q-00001", date: "02/11/24", customer: "Alice Brown", status: "Accepted", amount: "₹8,000.00" },
        { id: "Q-00002", date: "05/11/24", customer: "Bob Martin", status: "Rejected", amount: "₹12,000.00" },
    ],
    "Sales Return": [
        { id: "SR-00001", date: "04/11/24", customer: "Charlie Adams", status: "Processed", amount: "₹3,000.00" },
    ],
};

function RecentTransactions({ }: Props) {
    const [activeTab, setActiveTab] = useState("Invoices");

    const tableHeaders = [
        "Date",
        "Customer",
        "Status",
        "Amount"
    ];


    return (
        <div className="bg-white w-full rounded-lg py-4 px-6">
            <p className="text-[#303F58] font-bold text-base">Recent Transactions</p>

            {/* Tabs */}
            <div className="flex gap-3 mt-4">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={` py-1.5 px-4 rounded-full text-[#585953] text-xs font-semibold ${activeTab === tab ? "bg-[#DADCCD] " : "bg-[#FCFFED]"
                            }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="mt-5">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#F9F7F0] text-left text-xs">
                            <th className="py-3 px-4 text-[#303F58] font-semibold border-b border-tableBorder">
                                {activeTab === "Invoices" ? "Invoice No." : activeTab === "Sales Orders" ? "Sales Order No." : activeTab === "Quotes" ? "Quote No." : "Sales Return No."}
                            </th>
                            {tableHeaders.map((heading, index) => (
                                <th
                                    className={`py-3 px-4 font-medium border-b border-tableBorder text-start`}
                                    key={index}
                                >
                                    {heading}
                                </th>
                            ))}

                        </tr>
                    </thead>
                    <tbody>
                        {transactionsData[activeTab].map((item: any, index: any) => (
                            <tr key={index} className="border-b border-tableBorder text-xs text-[#4B5C79]">
                                <td className="py-3 px-4 ">{item.id}</td>
                                <td className="py-3 px-4 text-[#4B5C79]">{item.date}</td>
                                <td className="py-3 px-4 text-[#4B5C79]">{item.customer}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-md ${item.status === "Paid" || item.status === "Completed" || item.status === "Accepted" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4 font-bold text-[#4B5C79]">{item.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RecentTransactions;
