import { useState, useMemo, useRef } from "react";
import CustomiseColmn from "../../../Components/CustomiseColum";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../Components/SearchBar";
import TableSkelton from "../../../Components/skeleton/Table/TableSkelton";
import NoDataFoundTable from "../../../Components/skeleton/Table/NoDataFoundTable";
import Eye from "../../../assets/icons/Eye";
import EditCustomerModal from "./EditCustomerModal";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";
import TrashCan from "../../../assets/icons/TrashCan";
import ConfirmModal from "../../../Components/ConfirmModal";
import toast from "react-hot-toast";
import Button from "../../../Components/Button";
import { PrinterIcon } from "@heroicons/react/20/solid";
import { useReactToPrint } from "react-to-print";

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

interface Customer {
  _id: string;
  customerDisplayName?: string;
  companyName?: string;
  mobile?: string;
  customerEmail?: string;
  supplierDetails?: string;
  status?: string;
  skypeNameNumber?: string;
  billingAttention?: string;
  placeOfSupply?: string;
}


interface CustomerTableProps {
  customerData: any;
  searchValue: string;
  loading: any;
  setSearchValue: (value: string) => void;
  refreshCustomers: () => void;
}


const initialColumns: Column[] = [
  { id: "customerDisplayName", label: "Name", visible: true },
  { id: "companyName", label: "Company Name", visible: true },
  { id: "mobile", label: "Contact", visible: true },
  { id: "customerEmail", label: "Email", visible: true },
  { id: "supplierDetails", label: "Action", visible: true },
  { id: "status", label: "Status", visible: true },
  { id: "skypeNameNumber", label: "Receivables(BCY)", visible: false },

];

const CustomerTable: React.FC<CustomerTableProps> = ({
  customerData,
  searchValue,
  setSearchValue,
  loading,
  refreshCustomers,
}) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [onecustomerData, setOneCustomerData] = useState<any | []>([]);
  const { request: getOneCustomer } = useApi("get", 7002);

  const navigate = useNavigate();

  const handleView = (id: string) => {
    navigate(`/customer/view/${id}`);
  };

  const getCustomer = async (id: any) => {
    const url = `${endponits.GET_ONE_CUSTOMER}/${id}`;
    try {
      const apiResponse = await getOneCustomer(url);
      const { response, error } = apiResponse;
      if (!error && response) {
        setOneCustomerData(response.data);
      }
    } catch (error) { }
  };


  const filteredAccounts = useMemo(() => {
    const searchValueLower = searchValue.toLowerCase();
    return customerData.filter((account: any) => {
      return (
        account?.billingAttention?.toLowerCase().startsWith(searchValueLower) ||
        account?.customerDisplayName?.toLowerCase().startsWith(searchValueLower) ||
        account?.companyName?.toLowerCase().startsWith(searchValueLower) ||
        account?.mobile?.toLowerCase().startsWith(searchValueLower) ||
        account?.customerEmail?.toLowerCase().startsWith(searchValueLower) ||
        account?.placeOfSupply?.toLowerCase().startsWith(searchValueLower)
      );
    });
  }, [customerData, searchValue]);

  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { request: deleteCustomer } = useApi("delete", 7002);

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const url = `${endponits.DELETE_CUSTOMER}/${deleteId}`;
      const { response, error } = await deleteCustomer(url);
      if (!error && response) {
        toast.success(response.data.message);
        refreshCustomers();
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

  const renderColumnContent = (colId: string, item: Customer) => {
    if (colId === "supplierDetails") {
      return (
        <div className="flex justify-center items-center gap-3">
          <div onClick={() => handleView(item._id)} className="cursor-pointer">
            <Eye color={"#569FBC"} />
          </div>
          <div onClick={() => getCustomer(item._id)}>
            <EditCustomerModal customerDataPorps={onecustomerData} page="editCustomer" />
          </div>
          <div onClick={() => confirmDelete(item._id)}>
            <TrashCan color="red" />
          </div>
        </div>
      );
    } else if (colId === "status") {
      return (
        <p
          className={`py-1 text-[13px] rounded items-center ms-auto text-white h-[18px] flex justify-center ${item.status === "Active" ? "bg-[#78AA86]" : "bg-zinc-400"
            }`}
        >
          {item.status}
        </p>
      );
    }
    const columnValue = item[colId as keyof Customer];
    return columnValue ? (
      <span>{columnValue}</span>
    ) : (
      <span className="text-gray-500 italic">-</span>
    );

  };

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="w-full">
          <SearchBar
            placeholder="Search"
            searchValue={searchValue}
            onSearchChange={setSearchValue}
          />
        </div>
        <div className="flex gap-4">
          <Button onClick={() => reactToPrintFn()} variant="secondary" className="text-sm font-medium h-9">
            <PrinterIcon color="#0099F8" height={16} width={16} />
            Print
          </Button>
        </div>
      </div>
      <div ref={contentRef} className="mt-3 overflow-y-scroll hide-scrollbar max-h-[25rem]">
        <table className="min-w-full bg-white mb-5">
          <thead className="text-[12px] text-center text-dropdownText">
            <tr style={{ backgroundColor: "#F9F7F0" }}>
              <th className="py-3 px-4 border-b border-tableBorder">Sl.No</th>
              {columns.map(
                (col) =>
                  col.visible && (
                    <th
                      key={col.id}
                      className={`py-2 px-4 font-medium border-b border-tableBorder ${col.id === "supplierDetails" ? "hide-print" : ""}`}
                    >
                      {col.label}
                    </th>
                  )
              )}
              <th className="py-2 px-4 border-b border-tableBorder hide-print">
                <CustomiseColmn columns={columns} setColumns={setColumns} tableId={"customer"} />
              </th>
            </tr>
          </thead>

          <tbody className="text-dropdownText text-center text-[13px]">
            {/* Show skeleton loader if loading */}
            {loading.skeleton ? (
              [...Array(filteredAccounts.length > 0 ? filteredAccounts.length : 5)].map((_, idx) => (
                <TableSkelton key={idx} columns={[...columns, "h"]} />
              ))
            ) : filteredAccounts && filteredAccounts.length > 0 ? (
              // Render data if available
              [...filteredAccounts].reverse().map((item, index) => (
                <tr key={item._id} className="relative">
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {index + 1}
                  </td>
                  {columns.map(
                    (col) =>
                      col.visible && (
                        <td
                          key={col.id}
                          className={`py-2.5 px-4 border-y border-tableBorder ${col.id === "supplierDetails" ? "hide-print" : ""}`}
                        >
                          {renderColumnContent(col.id, item)}
                        </td>
                      )
                  )}
                  <td className={`py-2.5 px-4 border-y border-tableBorder hide-print`}></td>
                </tr>
              ))
            ) : (
              // If no data is available, display "No customer data found"
              <NoDataFoundTable columns={[...columns, "dd"]} />
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

export default CustomerTable;
