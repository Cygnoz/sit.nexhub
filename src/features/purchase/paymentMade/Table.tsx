import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomiseColmn from "../../../Components/CustomiseColum";
import DateFormat from "../../../Components/DateFormat/DateFormta";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";
import SearchBar from "../../../Components/SearchBar";
import Print from "../../sales/salesOrder/Print";


interface Column {
  id: string;
  label: string;
  visible: boolean;
}

const Table = () => {
  const navigate = useNavigate();
  const initialColumns: Column[] = [
    { id: "paymentDate", label: "Date", visible: true },
    { id: "paymentId", label: "Payment#", visible: true },
    { id: "supplierDisplayName", label: "Vendor Name", visible: true },
    { id: "bill", label: "Bill#", visible: true },
    { id: "paymentMode", label: "Mode", visible: true },
    { id: "amountPaid", label: "Amount", visible: true },
    // { id: "unusedAmount", label: "Unused Amount", visible: true },
  ];

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [searchValue, setSearchValue] = useState<string>("");
  const [allBill, setAllBill] = useState<any[]>([]);

  const { request: getBills } = useApi("get", 5005);

  const getAllBill = async () => {
    try {
      const url = `${endponits.GET_PAYMENTMADE}`;
      const { response, error } = await getBills(url);
      if (!error && response) {
        setAllBill(response.data);
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

  const filteredAccounts = allBill?.filter((paymentMade) => {
    const searchValueLower = searchValue.toLowerCase().trim();
    const billDateMatches =
    paymentMade.billDate && paymentMade.billDate.startsWith(searchValueLower);
    const supplierNameMatches =
    paymentMade.supplierDisplayName &&
    paymentMade.supplierDisplayName
        .toLowerCase()
        .trim()
        .startsWith(searchValueLower);

    return billDateMatches || supplierNameMatches;
  });
 

  // Handle column changes from CustomiseColmn
  const handleColumnChange = (newColumns: Column[]) => {
    setColumns(newColumns);
  };

  console.log(filteredAccounts,"filtered");
  

  return (
  <>
   <div className="flex w-full pl-3 pr-3 items-center gap-6">
            <div className="w-full">
              <SearchBar
                onSearchChange={setSearchValue}
                searchValue={searchValue}
                placeholder="Search Payments"
              />
            </div>
            {/* <SortBy /> */}
            <Print />
          </div>
      <div className="overflow-x-auto mt-3">
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
  {filteredAccounts?.map((item) => (
    <tr key={item.id} className="relative">
      <td className="py-2.5 px-4 border-y border-tableBorder">
        <input type="checkbox" className="form-checkbox w-4 h-4" />
      </td>
      {columns.map((col) =>
        col.visible ? (
          <td
            key={col.id}
            className="py-2.5 px-4 border-y border-tableBorder cursor-pointer"
            onClick={() => navigate("/purchase/payment-made/view")}
          >
            {col.id === "date" ? (
              <DateFormat date={item[col.id as keyof typeof item]} /> // Use DateFormat here
            ) : col.id === "bill" ? (
              item.unpaidBills?.map((bill:any) => bill.billNumber).join(", ")
            ) : (
              item[col.id as keyof typeof item]
            )}
          </td>
        ) : null
      )}
      <td className="py-2.5 px-4 border-y border-tableBorder"></td>
    </tr>
  ))}
</tbody>


        </table>
      </div>
  </>
  );
};

export default Table;
