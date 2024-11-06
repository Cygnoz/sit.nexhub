import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomiseColmn from "../../../Components/CustomiseColum";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";
import PrintButton from "../../../Components/PrintButton";
import SearchBar from "../../../Components/SearchBar";
import DotIcon from "../../../assets/icons/DotIcon";
import DateFormat from "../../../Components/DateFormat/DateFormta";

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

const Table = () => {
  const navigate = useNavigate();
  const initialColumns: Column[] = [
    { id: "billNumber", label: "Bill#", visible: true },
    { id: "billDate", label: "Bill Date", visible: true },
    { id: "supplierDisplayName", label: "Supplier Name", visible: true },
    { id: "grandTotal", label: "Amount", visible: true },
    { id: "dueDate", label: "Due Date", visible: true },
    { id: "paidStatus", label: "Status", visible: true },
  ];

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [searchValue, setSearchValue] = useState<string>("");
  const [allBill, setAllBill] = useState<any[]>([]);

  const { request: getBills } = useApi("get", 5005);

  const getAllBill = async () => {
    try {
      const url = `${endponits.GET_ALL_BILLS}`;
      const { response, error } = await getBills(url);
      if (!error && response) {
        setAllBill(response.data.PurchaseBills);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllBill();
  }, []);

  const filteredAccounts = allBill?.filter((bill) => {
    const searchValueLower = searchValue.toLowerCase().trim();

    // Check if billDate and supplierDisplayName are defined before calling startsWith
    const billDateMatches =
      bill.billDate && bill.billDate.startsWith(searchValueLower);
    const supplierNameMatches =
      bill.supplierDisplayName &&
      bill.supplierDisplayName
        .toLowerCase()
        .trim()
        .startsWith(searchValueLower);

    return billDateMatches || supplierNameMatches;
  });

  const handleColumnChange = (newColumns: Column[]) => {
    setColumns(newColumns);
  };

  return (
    <>
      <div className="flex w-full items-center gap-6">
        <div className="w-full">
          <SearchBar
            onSearchChange={setSearchValue}
            searchValue={searchValue}
            placeholder="Search Bills"
          />
        </div>
        <PrintButton />
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white mb-5 w-full">
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
              <th className="py-2.5 px-4 border-y border-tableBorder">
                {/* Add CustomiseColmn component here */}
                <CustomiseColmn
                  columns={columns}
                  setColumns={handleColumnChange}
                />
              </th>
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {filteredAccounts && filteredAccounts.length > 0 ? (
              filteredAccounts.map((item) => (
                <tr key={item.id} className="relative">
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    <input type="checkbox" className="form-checkbox w-4 h-4" />
                  </td>
                  {columns.map((col) => {
                    let cellContent;
                    if (col.id === "paidStatus") {
                      cellContent = (
                        <div
                          className={`${
                            item.paidStatus === "Pending"
                              ? "bg-zinc-200"
                              : "bg-[#78AA86]"
                          } text-[13px] rounded-lg items-center ms-auto text-textColor h-[18px] gap-2 py-2 flex justify-center`}
                        >
                          <DotIcon color="#495160" />
                          {item.paidStatus}
                        </div>
                      );
                    } else if (col.id === "billDate" || col.id==="dueDate") {
                      cellContent = <DateFormat date={item[col.id]} />;
                    } else {
                      cellContent = item[col.id as keyof typeof item];
                    }

                    return (
                      col.visible && (
                        <td
                          key={col.id}
                          className="py-2.5 px-4 border-y border-tableBorder cursor-pointer"
                          onClick={() => navigate("/purchase/bills/view")}
                        >
                          {cellContent}
                        </td>
                      )
                    );
                  })}
                  <td className="py-2.5 px-4 border-y border-tableBorder"></td>
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
    </>
  );
};

export default Table;
