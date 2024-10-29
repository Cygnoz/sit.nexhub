import { useEffect, useState } from "react";
import CustomiseColmn from "../../../Components/CustomiseColum";
import { useNavigate } from "react-router-dom";
import DotIcon from "../../../assets/icons/DotIcon";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import SearchBar from "../../../Components/SearchBar";
import Print from "../salesOrder/Print";

interface Column {
    id: string;
    label: string;
    visible: boolean;
}

interface QuoteData {
    customerName: string;
    createdDate: string;
    reference: string;
    salesQuotes: string;
    totalAmount: string;
    Status?: string;
}

const QuoteTable = () => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate("/sales/quote/view");
    };

    const { request: getAllQuotes } = useApi("get", 5007);
    const [searchValue, setSearchValue] = useState<string>(""); // State for search input

    const [data, setData] = useState<QuoteData[]>([]); // State to store the fetched quote data

    const fetchAllQuotes = async () => {
        try {
            const url = `${endponits.GET_ALL_QUOTES}`;
            const { response, error } = await getAllQuotes(url);
            if (!error && response) {
                setData(response.data);
                console.log(response.data);
            }
        } catch (error) {
            console.log("Error in fetching", error);
        }
    };

    useEffect(() => {
        fetchAllQuotes();
    }, []);

    const initialColumns: Column[] = [
        { id: "customerName", label: "Customer Name", visible: true },
        { id: "createdDate", label: "Date", visible: true },
        { id: "reference", label: "Reference", visible: true },
        { id: "salesQuotes", label: "Quote Number", visible: true },
        { id: "totalAmount", label: "Amount", visible: true },
        // { id: "Status", label: "Status", visible: true },
    ];

    const [columns, setColumns] = useState<Column[]>(initialColumns);

    const extractDate = (dateTimeString: string) => {
        return dateTimeString.split("T")[0]; // Extracts only the date (YYYY-MM-DD)
    };

    const renderColumnContent = (colId: string, item: QuoteData) => {
        if (colId === "createdDate") {
            return extractDate(item.createdDate);
        }
        if (colId === "Status") {
            return (
                <div className="flex justify-center items-center">
                    <div className="flex justify-center items-center gap-1.5 bg-BgSubhead rounded-2xl px-2 pt-0.5 pb-0.5">
                        <DotIcon color="#495160" />
                        <p className="text-outlineButton text-xs font-medium">{item.Status}</p>
                    </div>
                </div>
            );
        }
        return item[colId as keyof QuoteData];
    };

    // Filter the data based on search input (case-insensitive)
    const filteredData = data.filter((quote) => {
        const searchValueLower = searchValue.toLowerCase();

        return (
            quote?.customerName?.toLowerCase().includes(searchValueLower) ||
            quote?.reference?.toLowerCase().includes(searchValueLower) ||
            quote?.salesQuotes?.toLowerCase().includes(searchValueLower) 
        );
    });

    return (
        <div className="w-full">
            <div className="flex mb-4 items-center gap-5">
                <div className="w-[95%]">
                    <SearchBar
                        onSearchChange={setSearchValue} 
                        searchValue={searchValue}
                        placeholder="Search Quote" 
                    />
                </div>
                <Print />
            </div>
            <div className="mt-3 max-h-[25rem] overflow-y-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                <table className="min-w-full bg-white mb-5">
                    <thead className="text-[12px] text-center text-dropdownText">
                        <tr style={{ backgroundColor: "#F9F7F0" }}>
                            <th className="py-3 px-4 border-b border-tableBorder">
                                <input type="checkbox" className="form-checkbox w-4 h-4" />
                            </th>
                            {columns.map(
                                (col) =>
                                    col.visible && (
                                        <th
                                            key={col.id}
                                            className="py-2 px-4 font-medium border-b border-tableBorder"
                                        >
                                            {col.label}
                                        </th>
                                    )
                            )}
                            <th className="py-3 px-4 font-medium border-b border-tableBorder">
                                <CustomiseColmn columns={columns} setColumns={setColumns} />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-dropdownText text-center text-[13px]">
                        {filteredData.slice().reverse().map((item, index) => ( // Reverse the filtered data array
                            <tr
                                key={index}
                                className="relative cursor-pointer"
                                onClick={handleRowClick}
                            >
                                <td className="py-2.5 px-4 border-y border-tableBorder">
                                    <input type="checkbox" className="form-checkbox w-4 h-4" />
                                </td>
                                {columns.map(
                                    (col) =>
                                        col.visible && (
                                            <td key={col.id} className="py-2.5 px-4 border-y border-tableBorder">
                                                {renderColumnContent(col.id, item)}
                                            </td>
                                        )
                                )}
                                <td className="py-2.5 px-4 border-y border-tableBorder"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QuoteTable;
