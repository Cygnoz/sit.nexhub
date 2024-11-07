import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../Components/Button";
import CustomiseColmn from "../../../Components/CustomiseColum";
import SearchBar from "../../../Components/SearchBar";
import Print from "../../sales/salesOrder/Print";

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

interface Supplier {
  _id: string;
  billingAttention: string;
  companyName: string;
  mobile: string;
  supplierEmail: string;
  skypeNameNumber?: string;
  billingPhone: string;
  billingCity: string;
  status: string;
  supplierDisplayName: string;
  [key: string]: any;
}

interface SupplierTableProps {
  supplierData: Supplier[];
  searchValue: string;
  setSearchValue: (value: string) => void;
}

const SupplierTable = ({
  supplierData,
  searchValue,
  setSearchValue,
}: SupplierTableProps) => {
  const initialColumns: Column[] = [
    { id: "supplierDisplayName", label: "Name", visible: true },
    { id: "companyName", label: "Company Name", visible: true },
    { id: "mobile", label: "Mobile", visible: true },
    { id: "supplierEmail", label: "Email", visible: true },
    { id: "supplierDetails", label: "Supplier details", visible: true },
    { id: "billingPhone", label: "Billing Phone", visible: true },
    { id: "billingCity", label: "Billing City", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "payables", label: "Payables(BCY)", visible: false },
    { id: "unused", label: "Unused Credit(BCY)", visible: false },
  ];

  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const filteredAccounts = supplierData.filter((account) => {
    const searchValueLower = searchValue.toLowerCase();
    return (
      account?.companyName?.toLowerCase().startsWith(searchValueLower) ||
      account?.mobile?.toLowerCase().startsWith(searchValueLower) ||
      account?.supplierEmail?.toLowerCase().startsWith(searchValueLower) ||
      (account?.skypeNameNumber &&
        account?.skypeNameNumber?.toLowerCase().startsWith(searchValueLower))
    );
  });

  const renderColumnContent = (colId: string, item: Supplier) => {
    // Check if the column is "supplierDetails" first
    if (colId === "supplierDetails") {
      return (
        <div className="flex justify-center">
          <Link to={`/supplier/view/${item._id}`}>
            <Button
              variant="secondary"
              className="font-medium rounded-lg h-[1rem] text-[9.5px]"
            >
              See details
            </Button>
          </Link>
        </div>
      );
    }
  
    if (colId === "status") {
      const statusStyles =
        item.status === "Active" ? "bg-[#78AA86]" : "bg-zinc-400";
  
      return (
        <p
          className={`${statusStyles} text-[13px] rounded text-white h-[18px] flex items-center justify-center`}
        >
          {item.status}
        </p>
      );
    }
  
    const columnValue = item[colId as keyof Supplier];
    return columnValue ? (
      <span>{columnValue}</span>
    ) : (
      <span className="text-gray-500 italic">-</span>
    );
  };
  

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="w-full ">
          <SearchBar
            placeholder="Search"
            searchValue={searchValue}
            onSearchChange={setSearchValue}
          />
        </div>
        <div className="flex gap-4">
          <Print />
        </div>
      </div>
      <div className="mt-3 overflow-y-scroll max-h-[25rem]">
        <table className="min-w-full bg-white mb-5">
          <thead className="text-[12px] text-center  text-dropdownText">
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
              <th className="py-2 px-4 font-medium border-b border-tableBorder relative">
                <CustomiseColmn columns={columns} setColumns={setColumns} />
              </th>
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {filteredAccounts && filteredAccounts.length>0?filteredAccounts.reverse().map((item) => (
              <tr key={item._id} className="relative">
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input type="checkbox" className="form-checkbox w-4 h-4" />
                </td>
                {columns.map(
                  (col) =>
                    col.visible && (
                      <td
                        key={col.id}
                        className="py-2.5 px-4 border-y border-tableBorder"
                      >
                        {renderColumnContent(col.id, item)}
                      </td>
                    )
                )}
                <td className="py-2.5 px-4 border-y border-tableBorder"></td>
              </tr>
            )): <tr>
            <td
              colSpan={columns.length + 2}
              className="text-center py-4 border-y border-tableBorder"
            >
              <p className="text-red-500">No Data Found!</p>
            </td>
          </tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierTable;
