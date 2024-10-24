import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomiseColmn from "../../../Components/CustomiseColum";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";



interface Column {
  id: string;
  label: string;
  visible: boolean;
}

const Table = () => {
  const navigate = useNavigate();
  const initialColumns: Column[] = [
    { id: "bill", label: "Bill#", visible: true },
    { id: "billDate", label: "Bill Date", visible: true },
    { id: "reference", label: "Reference", visible: true },
    { id: "supplierName", label: "Supplier Name", visible: true },
    { id: "amount", label: "Amount", visible: true },
    { id: "dueDate", label: "Due Date", visible: true },
  ];

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [allBill, setAllBill] = useState<any[]>([]);

  const { request: getBills } = useApi("get", 5005);

  const getAllBill = async () => {
    try {
      const url = `${endponits.GET_ALL_BILLS}`;
      const { response, error } = await getBills(url);
      if (!error && response) {
        setAllBill(response.data.PurchaseOrders); 
      } else {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(()=>{
getAllBill()
  },[])





  const handleColumnChange = (newColumns: Column[]) => {
    setColumns(newColumns);
  };

  return (
    <div className="overflow-x-auto">
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
          {allBill?.map((item) => (
            <tr key={item.id} className="relative">
              <td className="py-2.5 px-4 border-y border-tableBorder">
                <input type="checkbox" className="form-checkbox w-4 h-4" />
              </td>
              {columns.map(
                (col) =>
                  col.visible && (
                    <td
                      key={col.id}
                      className="py-2.5 px-4 border-y border-tableBorder cursor-pointer"
                      onClick={() => navigate("/purchase/bills/view")}
                    >
                      {item[col.id as keyof typeof item]}
                    </td>
                  )
              )}
              <td className="py-2.5 px-4 border-y border-tableBorder">
                {/* Ensure this td has the same border styling */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
