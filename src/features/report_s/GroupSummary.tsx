import { Link } from "react-router-dom";
import CheveronLeftIcon from "../../assets/icons/CheveronLeftIcon";
import SearchBar from "../../Components/SearchBar";
import { useState } from "react";

function GroupSummary() {


    const [searchValue, setSearchValue] = useState("");

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
                            placeholder="Search Currency"
                        />
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-textColor">Company Name</p>
                        <p className="text-sm text-gray-500">01/07/2024 To 30/09/2024</p>
                    </div>
                </div>

                {/* Table Section */}
                <table className="w-full text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-[#495160] font-bold uppercase bg-[#F7ECD9]">
                        <tr>
                            <th scope="col" className="py-3 px-6">Particulars</th>
                            <th scope="col" className="py-3 px-6 text-right">Debit</th>
                            <th scope="col" className="py-3 px-6 text-right">Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white border border-[#EAECF0]  text-[#818894]">
                            <td className="py-4 px-6">Salary</td>
                            <td className="py-4 px-6 text-right"></td> {/* Empty Debit */}
                            <td className="py-4 px-6 text-right">1,000.00</td> {/* Credit Amount */}
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr className="font-bold border border-[#EAECF0]  text-[#818894] bg-gray-100">
                            <td className="py-4 px-6">Grand Total</td>
                            <td className="py-4 px-6 text-right"></td> {/* Empty Debit */}
                            <td className="py-4 px-6 text-right">1,000.00</td> {/* Credit Total */}
                        </tr>
                    </tfoot>
                </table>

            </div>
        </div>
    );
}

export default GroupSummary;