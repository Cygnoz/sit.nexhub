import { useEffect, useState } from "react";
import CustomiseColmn from "../../../Components/CustomiseColum";
import { useNavigate } from "react-router-dom";
import DotIcon from "../../../assets/icons/DotIcon";
import SearchBar from "../../../Components/SearchBar";
import Print from "./Print";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

interface SalesData {
  customerName: string;
  createdDate: string;
  salesOrder: string;
  totalAmount: string;
  status?: string;
  _id: string;
}

const SalesOrderTable = () => {
  const navigate = useNavigate();
  const { request: getAllSalesOrders } = useApi("get", 5007);
  const [data, setData] = useState<SalesData[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  const initialColumns: Column[] = [
    { id: "salesOrder", label: "Order Number", visible: true },
    { id: "createdDate", label: "Order Date", visible: true },
    { id: "salesOrder", label: "Sales Order#", visible: true },
    { id: "customerName", label: "Customer Name", visible: true },
    { id: "totalAmount", label: "Total", visible: true },
    { id: "status", label: "Status", visible: true },
  ];

  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const fetchAllOrder = async () => {
    try {
      const url = `${endponits.GET_ALL_SALES_ORDER}`;
      const { response, error } = await getAllSalesOrders(url);
      if (!error && response) {
        setData(response.data);
        console.log("Fetched Sales Orders:", response.data);
      }
    } catch (error) {
      console.error("Error fetching sales orders:", error);
    }
  };

  useEffect(() => {
    fetchAllOrder();
  }, []);

  const extractDate = (dateTimeString: string) => {
    return dateTimeString.split("T")[0];
  };

  const renderColumnContent = (colId: string, item: SalesData) => {
    if (colId === "createdDate") {
      return extractDate(item.createdDate);
    }
    if (colId === "status") {
      return (
        <div className="flex justify-center items-center">
          <div className="flex items-center gap-1.5 bg-BgSubhead rounded-2xl px-2 pt-0.5 pb-0.5">
            <DotIcon color="#495160" />
            <p className="text-outlineButton text-xs font-medium">{item.status || "Pending"}</p>
          </div>
        </div>
      );
    }
    return item[colId as keyof SalesData];
  };

  const filteredData = data.filter((order) => {
    const searchValueLower = searchValue.toLowerCase();
    return (
      order.customerName.toLowerCase().includes(searchValueLower) ||
      order.salesOrder.toLowerCase().includes(searchValueLower)
    );
  });

  const handleRowClick = (id: string) => {
    navigate(`/sales/viewsalesorder/${id}`);
  };

  return (
    <div className="w-full">
      <div className="flex mb-4 items-center gap-5">
        <div className="w-[95%]">
          <SearchBar
            onSearchChange={setSearchValue}
            searchValue={searchValue}
            placeholder="Search Sales Order"
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
            {filteredData.slice().reverse().map((item) => (
              <tr key={item._id} className="relative cursor-pointer" onClick={() => handleRowClick(item._id)}>
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

export default SalesOrderTable;
