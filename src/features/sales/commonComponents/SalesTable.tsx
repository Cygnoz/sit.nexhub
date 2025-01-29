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
import Eye from "../../../assets/icons/Eye";
import PencilEdit from "../../../assets/icons/PencilEdit";
import TrashCan from "../../../assets/icons/TrashCan";
import { getInitialColumns } from "./InitialColumns";
import toast from "react-hot-toast";
import ConfirmModal from "../../../Components/ConfirmModal";


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
  const { request: deleteSales } = useApi("delete", 5007);
  const [searchValue, setSearchValue] = useState<string>("");
  const [data, setData] = useState<any | []>([]);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setConfirmModalOpen(true);
  };

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
                : page === "credit-Note" ? `${endponits.GET_ALL_CREDIT_NOTE}`
                  : "";

      setLoading({ ...loading, skelton: true });
      const { response, error } = await getAllQuotes(url);
      if (error || !response) {
        setLoading({ ...loading, skelton: false, noDataFound: true });
        return;
      }
      console.log(response.data);
      if (page === "invoice") {
        setData(response.data);
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

  const initialColumns = getInitialColumns(page);


  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const extractDate = (dateTimeString: string) => {
    return dateTimeString?.split("T")[0];
  };

  const renderColumnContent = (colId: string, item: any) => {
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
  const filteredData = Array.isArray(data)
    ? data.filter((quote) => {
      const searchValueLower = searchValue?.toLowerCase();
      if (page === "credit-Note") {
        return (
          quote?.customerDisplayName?.toLowerCase()?.includes(searchValueLower) ||
          quote?.creditNote?.toLowerCase()?.includes(searchValueLower) ||
          quote?.orderNumber?.toLowerCase()?.includes(searchValueLower)
        );
      } else {
        return (
          quote?.customerDisplayName?.toLowerCase()?.includes(searchValueLower) ||
          quote?.reference?.toLowerCase()?.includes(searchValueLower) ||
          quote?.salesQuotes?.toLowerCase()?.includes(searchValueLower) ||
          quote?.salesInvoice?.toLowerCase()?.includes(searchValueLower) ||
          quote?.salesOrder?.toLowerCase()?.includes(searchValueLower)
        );
      }
    })
    : [];



  const handleRowClick = (id: string) => {
    const state = { page };
    if (page === "reciept") {
      navigate(`/sales/receipt/view/${id}`, { state });

    }

    else {
      navigate(`/sales/viewsalesorder/${id}`, { state });
    }
  };

  const handleEditClick = (id: string) => {
    if (page === "salesOrder") {
      navigate(`/sales/salesorder/edit/${id}`);
    } else if (page === "quote") {
      navigate(`/sales/quote/edit/${id}`);
    } else if (page === "invoice") {
      navigate(`/sales/invoice/edit/${id}`);
    }
    else if (page === "reciept") {
      navigate(`/sales/receipt/edit/${id}`);
    }
    else if (page === "credit-Note") {
      navigate(`/sales/credit-note/edit/${id}`)
    }
    else {
      console.warn(`Unexpected page value: ${page}`);
    }
  };


  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const url = 
      page === "salesOrder"?
      `${endponits.DELETE_SALES_ORDER}/${deleteId}`
      : page === "quote" ?
      `${endponits.DELETE_SALES_QUOTE}/${deleteId}`
      : page === "invoice" ?
      `${endponits.DELETE_SALES_INVOICE}/${deleteId}`
      : page === "reciept" ?
      `${endponits.DELETE_SALES_RECIEPT}/${deleteId}`
      :""
      const { response, error } = await deleteSales(url);
      if (!error && response) {
        toast.success(response.data.message);
        fetchAllQuotes();
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      toast.error("Error occurred while deleting.");
    } finally {
      setConfirmModalOpen(false);
      setDeleteId(null);
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
              page === "invoice"
                ? "Search Invoice"
                : page === "salesOrder"
                  ? "Search Sales Order"
                  : page === "salesReturn"
                    ? "Search Sales Return"
                    : page === "reciept"
                      ? "Search Receipts"
                      : page === "credit-Note"
                        ? "Search Credit Note"
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
            <tr style={{ backgroundColor: "#F9F7F0" }} className="sticky top-0 z-10">
              <th className="py-2.5 px-4 font-medium border-b border-tableBorder">Sl.No</th>

              {columns.map(
                (col) =>
                  col.visible && (
                    <th key={col.id} className="py-2 px-4 font-medium border-b border-tableBorder">
                      {col.label}
                    </th>
                  )
              )}
              <th className="py-3 px-4 font-medium border-b border-tableBorder">Actions </th>
              <th className="py-3 px-4 font-medium border-b border-tableBorder">
                <CustomiseColmn columns={columns} setColumns={setColumns} tableId={`${page}`} />
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
                <tr key={item._id} className="relative">
                  <td className="py-2.5 px-4 border-y border-tableBorder">{index + 1}</td>
                  {columns.map(
                    (col) =>
                      col.visible && (
                        <td key={col.id} className="py-2.5 px-4 border-y border-tableBorder">
                          {renderColumnContent(col.id, item)}
                        </td>
                      )
                  )}
                  <td className="py-3 px-4 border-b gap-3 border-tableBorder flex justify-center items-center">
                    <div onClick={() => handleEditClick(item._id)}>
                      <PencilEdit color={'#0B9C56'} className="cursor-pointer" />
                    </div>
                    <div onClick={() => handleRowClick(item._id)}>
                      <Eye color="#569FBC" className="cursor-pointer" />
                    </div>
                    <div onClick={() => confirmDelete(item._id)}>
                      <TrashCan color="red" />
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b border-tableBorder"></td>
                </tr>
              ))
            ) : (
              // Render "no data found" row if data is empty
              <NoDataFoundTable columns={page == 'salesOrder' || page == 'reciept' || page == 'quote' || page == 'credit-Note' ? [...columns, "ff", "tt"] : columns} />
            )}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        open={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete?"
      />
    </div>
  );
};

export default SalesTable;