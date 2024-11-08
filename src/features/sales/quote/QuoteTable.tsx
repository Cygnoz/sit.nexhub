import { useContext, useEffect, useState } from "react";
import CustomiseColmn from "../../../Components/CustomiseColum";
import { useNavigate } from "react-router-dom";
import DotIcon from "../../../assets/icons/DotIcon";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import SearchBar from "../../../Components/SearchBar";
import Print from "../salesOrder/Print";
import { TableResponseContext } from "../../../context/ContextShare";
import ChartTableSkeleton from "../../../Components/skeleton/ChartTableSkeleton";
import TableSkelton from "../../../Components/skeleton/Table/TableSkelton";
import NoDataFoundTable from "../../../Components/skeleton/Table/NoDataFoundTable";

interface Column {
  id: string;
  label: string;
  visible: boolean;
}
type Props = {
  page?: string;
};

interface QuoteData {
  customerName: string;
  createdDate: string;
  reference: string;
  salesQuotes: string;
  totalAmount: string;
  status?: string;
  _id: string;
  salesInvoice: any;
  salesOrder: any
}

const QuoteTable = ({ page }: Props) => {
  const navigate = useNavigate();

  const { request: getAllQuotes } = useApi("get", 5007);
  const [searchValue, setSearchValue] = useState<string>("");
  // Loading state
  const {loading,setLoading}=useContext(TableResponseContext)!;
  const [data, setData] = useState<QuoteData[]>([]);

  const fetchAllQuotes = async () => {
  try {
    // Set loading skeleton state before API call
    setLoading({ ...loading, skeleton: true, noDataFound: false });

    // Determine the correct API endpoint based on the current page
    const url =
      page === "invoice"
        ? `${endponits.GET_ALL_SALES_INVOICE}`
        : page === "salesOrder"
        ? `${endponits.GET_ALL_SALES_ORDER}`
        : `${endponits.GET_ALL_QUOTES}`;

    const apiResponse = await getAllQuotes(url);
    const { response, error } = apiResponse;

    if (!error && response) {
      // Successfully fetched data
      setData(response.data);
      console.log(response.data);
      setLoading({ ...loading, skeleton: false });
    } else {
      // If there's an error or no response, show "No Data Found"
      setLoading({ ...loading, skeleton: false, noDataFound: true });
    }
  } catch (error) {
    console.error("Error fetching quotes:", error);

    // In case of error, hide the skeleton and show "No Data Found"
    setLoading({ ...loading, skeleton: false, noDataFound: true });
  }
};



  useEffect(() => {
    fetchAllQuotes();
  }, []);

  const initialColumns: Column[] =
    page === "invoice" ? [
      { id: "createdDate", label: "Date", visible: true },
      { id: "", label: "Due Date", visible: false },
      { id: "salesInvoice", label: "Invoice#", visible: true },
      { id: "reference", label: "Reference", visible: true },
      { id: "status", label: "Status", visible: true },
      { id: "customerName", label: "Customer Name", visible: true },
      { id: "totalAmount", label: "Amount", visible: true },
      { id: "", label: "Balance Due", visible: false },
    ]
      : page === "salesOrder" ? [
        { id: "salesOrder", label: "Order Number", visible: true },
        { id: "createdDate", label: "Order Date", visible: true },
        { id: "salesOrder", label: "Sales Order#", visible: true },
        { id: "customerName", label: "Customer Name", visible: true },
        { id: "totalAmount", label: "Total", visible: true },
        { id: "status", label: "Status", visible: true },
      ]
        : [
          { id: "customerName", label: "Customer Name", visible: true },
          { id: "createdDate", label: "Date", visible: true },
          { id: "reference", label: "Reference", visible: true },
          { id: "salesQuotes", label: "Quote Number", visible: true },
          { id: "status", label: "Status", visible: true },
          { id: "totalAmount", label: "Amount", visible: true },
        ];




  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const extractDate = (dateTimeString: string) => {
    return dateTimeString.split("T")[0];
  };

  const renderColumnContent = (colId: string, item: QuoteData) => {
    if (colId === "createdDate") {
      return extractDate(item.createdDate);
    }
    if (colId === "status") {
      return (
        <div className="flex justify-center items-center">
          <div className="flex items-center gap-1.5 bg-BgSubhead rounded-2xl px-2 pt-0.5 pb-0.5">
            <DotIcon color="#495160" />
            <p className="text-outlineButton text-xs font-medium">{item.status}</p>
          </div>
        </div>
      );
    }
    return item[colId as keyof QuoteData];
  };

  const filteredData = data.filter((quote) => {
    const searchValueLower = searchValue.toLowerCase();
    return (
      quote?.customerName?.toLowerCase()?.includes(searchValueLower) ||
      quote?.reference?.toLowerCase()?.includes(searchValueLower) ||
      quote?.salesQuotes?.toLowerCase()?.includes(searchValueLower) ||
      quote?.salesInvoice?.toLowerCase()?.includes(searchValueLower) ||
      quote?.salesOrder?.toLowerCase()?.includes(searchValueLower)
    );
  });

  const handleRowClick = (id: string) => {
    page === "salesOrder" ?
    navigate(`/sales/viewsalesorder/${id}`)
    :
    navigate(`/sales/quote/view/${id}`);
  };

  return (
    <div className="w-full">
      <div className="flex mb-4 items-center gap-5">
        <div className="w-[95%]">
          <SearchBar onSearchChange={setSearchValue} searchValue={searchValue} 
          placeholder={page == "invoice" ? "Search Invoice" : page == "salesOrder" ? "Search Sales Order" : "Search Quote"} />
        </div>
        <Print />
      </div>
      <div className="mt-3 max-h-[25rem] overflow-y-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
      <table className="min-w-full bg-white mb-5">
  <thead className="text-[12px] text-center text-dropdownText">
    <tr style={{ backgroundColor: "#F9F7F0" }}>
      <th className="py-2.5 px-4 font-medium border-b border-tableBorder">S.No</th>

      {columns.map(
        (col) =>
          col.visible && (
            <th key={col.id} className="py-2 px-4 font-medium border-b border-tableBorder">
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
  {loading.skeleton ? (
    [...Array(filteredData.length > 0 ? filteredData.length : 5)].map((_, idx) => (
      <TableSkelton key={idx} columns={[...columns,"rr","rr","e"]} />
    ))
  ) : filteredData.length > 0 ? (
    filteredData
      .slice()
      .reverse()
      .map((item, index) => (
        <tr key={item._id} className="relative cursor-pointer" onClick={() => handleRowClick(item._id)}>
          <td className="py-2.5 px-4 border-y border-tableBorder">{index + 1}</td>
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
      ))
  ) : (
    <NoDataFoundTable columns={[...columns,"rr","dd"]} />
  )}
</tbody>

</table>

      </div>
    </div>
  );
};

export default QuoteTable;
