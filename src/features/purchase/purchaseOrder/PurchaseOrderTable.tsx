import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DotIcon from "../../../assets/icons/DotIcon";
import CustomiseColmn from "../../../Components/CustomiseColum";
import Print from "../../sales/salesOrder/Print";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";
import SearchBar from "../../../Components/SearchBar";

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

const PurchaseOrderTable = () => {
  const navigate = useNavigate();

  const handleRowClick = (id: string) => {
    navigate(`/purchase/viewpurchaseorder/${id}`); 
  };

  const initialColumns: Column[] = [
    { id: "purchaseOrder", label: "Purchase Order#", visible: true },
    { id: "purchaseOrderDate", label: "Order Date", visible: true },
    { id: "reference", label: "Reference", visible: true },
    { id: "supplierDisplayName", label: "Supplier Name", visible: true },
    { id: "grandTotal", label: "Amount", visible: true },
    { id: "Status", label: "Status", visible: true },
    { id: "Recieved", label: "Received", visible: false },
    { id: "Billed", label: "Billed", visible: false },
    { id: "ExpectedDate", label: "Expected Date", visible: false },
  ];

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [searchValue, setSearchValue] = useState<string>("");
  const [allPoData, setAllPOData] = useState<any[]>([]);
  const { request: getPO } = useApi("get", 5005);

  const getAllPO = async () => {
    try {
      const url = `${endponits.GET_ALL_PURCHASE_ORDER}`;
      const { response, error } = await getPO(url);
      if (!error && response) {
        setAllPOData(response.data.PurchaseOrders); 
      } else {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredAccounts = allPoData.filter((PO) => {
    const searchValueLower = searchValue.toLowerCase().trim();
    return PO.purchaseOrder.toLowerCase().trim().startsWith(searchValueLower);
  });

  useEffect(() => {
    getAllPO();
  }, []);

  const renderColumnContent = (colId: string, item: any) => {
    
    if (colId === "Status") {
      return (
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center gap-1.5 bg-BgSubhead rounded-2xl px-2 pt-0.5 pb-0.5">
            <DotIcon color="#495160" />
            <p className="text-outlineButton text-xs font-medium">{item.status}</p>
          </div>
        </div>
      );
    }
    return item[colId as keyof typeof item];
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <SearchBar
            placeholder="Search Purchase Order"
            searchValue={searchValue}
            onSearchChange={setSearchValue}
          />
        </div>
        <div className="flex gap-4">
          <Print />
        </div>
      </div>

      <div className="overflow-x-auto mt-3  hide-scrollbar  overflow-y-scroll max-h-[25rem]">
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
              <th className="py-3 px-14 font-medium border-b border-tableBorder">
                <CustomiseColmn columns={columns} setColumns={setColumns} />
              </th>
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {filteredAccounts? filteredAccounts.map((item) => (
              <tr
                key={item._id} 
                className="relative cursor-pointer"
                onClick={() => handleRowClick(item._id)} 
              >
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
                            <td  className="py-3 px-4 border-b border-tableBorder"></td>

              </tr>
            )): <div className="flex items-center">   <p className="text-[red]">Purchase order not available!</p></div>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrderTable;
