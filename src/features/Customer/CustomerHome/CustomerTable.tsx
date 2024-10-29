import { useState } from "react";
import CustomiseColmn from "../../../Components/CustomiseColum";
import Button from "../../../Components/Button";
import { Link } from "react-router-dom";
import SearchBar from "../../../Components/SearchBar";
import Print from "../../sales/salesOrder/Print";

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

interface CustomerTableProps {
  customerData: any[];
  searchValue: string;
  setSearchValue: (value: string) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customerData,
  searchValue,
  setSearchValue,
}) => {
  const initialColumns: Column[] = [
    { id: "customerDisplayName", label: "Name", visible: true },
    { id: "companyName", label: "Company Name", visible: true },
    { id: "mobile", label: "Contact", visible: true },
    { id: "customerEmail", label: "Email", visible: true },
    { id: "supplierDetails", label: "Customer details", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "skypeNameNumber", label: "Receivables(BCY)", visible: true },
  ];

  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const filteredAccounts = customerData.filter((account) => {
    const searchValueLower = searchValue.toLowerCase();
    return (
      account?.billingAttention?.toLowerCase().startsWith(searchValueLower) ||
      account?.customerDisplayName
        ?.toLowerCase()
        .startsWith(searchValueLower) ||
      account?.companyName?.toLowerCase().startsWith(searchValueLower) ||
      account?.mobile?.toLowerCase().startsWith(searchValueLower) ||
      account?.customerEmail?.toLowerCase().startsWith(searchValueLower) ||
      account?.placeOfSupply?.toLowerCase().startsWith(searchValueLower)
    );
  });

  const renderColumnContent = (colId: string, item: any) => {
    if (colId === "supplierDetails") {
      return (
        <div className="flex justify-center">
          <Link to={`/customer/view/${item._id}`}>
            <Button
              variant="secondary"
              className="font-medium rounded-lg h-[1rem] text-[9.5px]"
            >
              See details
            </Button>
          </Link>
        </div>
      );
    } else if (colId == "status") {
      return (
        <p
          className={`${
            item.status == "Active" ? "bg-[#78AA86]" : "bg-zinc-400"
          } py-1 text-[13px] rounded items-center ms-auto text-white  h-[18px] flex justify-center`}
        >
          {item.status}
        </p>
      );
    }
    return item[colId as keyof typeof item];
  };

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
          <Print />
        </div>
      </div>
      <div className="mt-3 overflow-y-scroll max-h-[25rem]">
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
              <th className="py-2 px-4 font-medium border-b border-tableBorder">
                <CustomiseColmn columns={columns} setColumns={setColumns} />
              </th>
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {filteredAccounts && filteredAccounts.length > 0 ? (
              filteredAccounts.map((item) => (
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
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="text-center py-4 border-y border-tableBorder"
                >
                  <p className="text-red-500">No Data Found!</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;
