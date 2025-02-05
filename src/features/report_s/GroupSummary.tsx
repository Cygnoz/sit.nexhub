import { Link, useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import CheveronLeftIcon from "../../assets/icons/CheveronLeftIcon";
import SearchBar from "../../Components/SearchBar";

function GroupSummary() {
    const location = useLocation();

    const { accountSubhead } = useParams();

    console.log(accountSubhead, "accountSubhead")
    const [searchValue, setSearchValue] = useState("");
    const { data } = location.state || {};

    console.log(data)
    return (
        <div className="px-6 py-4 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex items-center gap-5 mb-6">
                <Link to="/reports/profitandloss">
                    <div
                        style={{ borderRadius: "50%" }}
                        className="w-[40px] h-[40px] flex items-center justify-center bg-white shadow-md"
                    >
                        <CheveronLeftIcon />
                    </div>
                </Link>
                <p className="text-[#303F58] text-xl font-bold">Group Summary</p>
            </div>

            {/* Single Container */}
            <div className="p-6 bg-white shadow-md rounded-lg">
                {/* Search and Company Info */}
                <div className="flex justify-between items-center mb-6">
                    <div className="w-1/2">
                        <SearchBar
                            searchValue={searchValue}
                            onSearchChange={setSearchValue}
                            placeholder="Search Account"
                        />
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-textColor">Company Name</p>
                        <p className="text-sm text-gray-500">01/07/2024 To 30/09/2024</p>
                    </div>
                </div>

                {/* Table Section */}
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-[#495160] font-bold uppercase bg-[#F7ECD9]">
                        <tr>
                            <th scope="col" className="py-3 px-6">Particulars</th>
                            <th scope="col" className="py-3 px-6 text-right">Debit</th>
                            <th scope="col" className="py-3 px-6 text-right">Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data.map((expense: any) => (
                            <tr key={expense.id} className="bg-white border border-[#EAECF0] text-[#818894]">
                                <td className="py-4 px-6">{expense.accountName?.trim() || "N/A"}</td>

                                <td className="py-4 px-6 text-right">{expense.overallNetDebit
                                    || 0}</td>
                                <td className="py-4 px-6 text-right">{expense.overallNetCredit || 0}</td>
                            </tr>
                        ))
                        }
                    </tbody>

                    <tfoot>
                        {data ? (
                            <tr className="font-bold border border-[#EAECF0] text-[#818894] bg-gray-100">
                                <td className="py-4 px-6">Grand Total</td>
                                <td className="py-4 px-6 text-right">
                                    {data.
                                        overallNetDebit
                                    }
                                </td>
                                <td className="py-4 px-6 text-right">
                                    {data.
                                        overallNetCredit
                                    }
                                </td>
                            </tr>
                        ) : (
                            <tr className="font-bold border border-[#EAECF0] text-[#818894] bg-gray-100">
                                <td className="py-4 px-6 text-center" colSpan={3}>No Data Available</td>
                            </tr>
                        )}
                    </tfoot>

                </table>

            </div>
        </div>
    );
}

export default GroupSummary;
