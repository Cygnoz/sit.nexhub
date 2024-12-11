import { useContext, useEffect, useState } from "react";
import CustomiseColmn from "../../../Components/CustomiseColum";
import { useNavigate } from "react-router-dom";
import DotIcon from "../../../assets/icons/DotIcon";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import SearchBar from "../../../Components/SearchBar";
import Print from "../salesOrder/Print";
import TableSkelton from "../../../Components/skeleton/Table/TableSkelton";
import NoDataFoundTable from "../../../Components/skeleton/Table/NoDataFoundTable";
import { TableResponseContext } from "../../../context/ContextShare";


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
  salesOrder: any;
  paidStatus: any;
}

const SalesTable = ({ page }: Props) => {
  const navigate = useNavigate();
  const { loading, setLoading } = useContext(TableResponseContext)!;
  const { request: getAllQuotes } = useApi("get", 5007);
  const [searchValue, setSearchValue] = useState<string>("");
  const [data, setData] = useState<QuoteData[]>([]);

  const fetchAllQuotes = async () => {
    try {
      const url =
        page === "invoice"
          ? `${endponits.GET_ALL_SALES_INVOICE}`
          : page === "salesOrder"
            ? `${endponits.GET_ALL_SALES_ORDER}`
            : page === "quote"
              ? `${endponits.GET_ALL_QUOTES}`
              : page === "reciept" ? `${endponits.GET_ALL_SALES_RECIEPT}`
                : "";

      setLoading({ ...loading, skelton: true });
      const { response, error } = await getAllQuotes(url);
      if (error || !response) {
        setLoading({ ...loading, skelton: false, noDataFound: true });
        return;
      }
      console.log(response.data);
      if (page === "invoice") {
        setData(response.data.updatedInvoices);
      } else {
        setData(response.data);
      }
      setLoading({ ...loading, skelton: false });
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setLoading({ ...loading, noDataFound: true, skelton: false });
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
      { id: "paidStatus", label: "Status", visible: true },
      { id: "customerName", label: "Customer Name", visible: true },
      { id: "totalAmount", label: "Amount", visible: true },
      { id: "", label: "Balance Due", visible: false },
    ]
      : page === "salesOrder" ? [
        { id: "salesOrder", label: "Order Number", visible: true },
        { id: "createdDate", label: "Order Date", visible: true },
        // { id: "salesOrder", label: "Sales Order#", visible: true },
        { id: "customerName", label: "Customer Name", visible: true },
        { id: "totalAmount", label: "Total", visible: true },
        { id: "status", label: "Status", visible: true },
      ]
        : page === "quote" ? [
          { id: "customerName", label: "Customer Name", visible: true },
          { id: "createdDate", label: "Date", visible: true },
          { id: "reference", label: "Reference", visible: true },
          { id: "salesQuotes", label: "Quote Number", visible: true },
          { id: "status", label: "Status", visible: true },
          { id: "totalAmount", label: "Amount", visible: true },

        ]
          :
          page === "salesReturn" ? [
            { id: "createdDate", label: "Date", visible: true },
            { id: "customerRMA", label: "RMA#", visible: true },
            { id: "salesOrder", label: "SalesOrder", visible: true },
            { id: "status", label: "Status", visible: true },
            { id: "customerName", label: "Customer Name", visible: true },
            { id: "totalAmount", label: "Amount", visible: true },
            { id: "returned", label: "Returned", visible: true },
          ] :
            page == "reciept" ? [
              { id: "createdDate", label: "Date", visible: true },
              { id: "payment", label: "Payment#", visible: true },
              { id: "customerName", label: "Customer Name", visible: true },
              // { id: "", label: "Invoice#", visible: true },
              { id: "paymentMode", label: "Mode", visible: true },
              { id: "amountReceived", label: "Amount", visible: true },
              // { id: "", label: "Unsend Amount", visible: true },
            ] : [];

  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const extractDate = (dateTimeString: string) => {
    return dateTimeString.split("T")[0];
  };

  const renderColumnContent = (colId: string, item: QuoteData) => {
    if (colId === "createdDate") {
      return extractDate(item.createdDate);
    }

    if (colId === "paidStatus") {
      return (
        <div className="flex justify-center items-center">
          <div
            className={`${item.paidStatus === "Pending" ? "bg-zinc-200" : item.paidStatus === "Completed" ? "bg-[#94dca9]" : "bg-[#dcd894]"
              } text-[13px] rounded-lg text-center items-center text-textColor h-[18px] px-2 max-w-fit gap-2 py-2 flex justify-center`}
          >
            <DotIcon color="#495160" />
            {item.paidStatus}
          </div>
        </div>
      );
    }

    const columnValue = item[colId as keyof QuoteData];
    return columnValue ? (
      <span>{columnValue}</span>
    ) : (
      <span className="text-gray-500 italic">-</span>
    );
  };
  // Initialize `data` as an empty array if it's undefined
  const filteredData = Array.isArray(data) ? data.filter((quote) => {
    const searchValueLower = searchValue?.toLowerCase();
    return (
      quote?.customerName?.toLowerCase()?.includes(searchValueLower) ||
      quote?.reference?.toLowerCase()?.includes(searchValueLower) ||
      quote?.salesQuotes?.toLowerCase()?.includes(searchValueLower) ||
      quote?.salesInvoice?.toLowerCase()?.includes(searchValueLower) ||
      quote?.salesOrder?.toLowerCase()?.includes(searchValueLower)
    );
  }) : [];


  const handleRowClick = (id: string) => {
    const state = { page };
    if (page === "reciept") {
      navigate(`/sales/receipt/view/${id}`, { state }); 
    } else {
      navigate(`/sales/viewsalesorder/${id}`, { state });
    }
  };

  return (
    <div className="w-full">
      <div className="flex mb-4 items-center gap-5">
        <div className="w-[95%]">
          <SearchBar
            onSearchChange={setSearchValue}
            searchValue={searchValue}
            placeholder={
              page == "invoice"
                ? "Search Invoice"
                : page == "salesOrder"
                  ? "Search Sales Order"
                  : page == "salesReturn"
                    ? "Search Sales Return"
                    : page == "reciept"
                      ? "Search Reciepts"
                      : "Search Quote"
            }
          />
        </div>
        <Print />
        {/* <SortBy/> */}
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
            {loading.skelton ? (
              // Render skeleton rows if loading
              [...Array(filteredData?.length ? filteredData?.length : 5)].map((_, idx) => (
                <TableSkelton key={idx} columns={page == 'salesOrder' || page == 'quote' ? [...columns, "ff", "tt"] : columns} />
              ))
            ) : filteredData && filteredData.length > 0 ? (
              // Render data rows if not loading and data is available
              filteredData.slice().reverse().map((item, index) => (
                <tr key={item._id} className="relative cursor-pointer hover:bg-[#EAECF0]" onClick={() => handleRowClick(item._id)}>
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
              // Render "no data found" row if data is empty
              <NoDataFoundTable columns={page == 'salesOrder' || page == 'quote' ? [...columns, "ff", "tt"] : columns} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTable;