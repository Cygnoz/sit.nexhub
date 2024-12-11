import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../../Hooks/useApi";
import { TableResponseContext } from "../../../context/ContextShare";
import { endponits } from "../../../Services/apiEndpoints";
import DotIcon from "../../../assets/icons/DotIcon";
import PurchaseTable from "../CommonComponents/PurchaseTable/PurchaseTable";

const PurchaseOrderTable = () => {
  const [columns,setColumns] = useState([

    { id: "purchaseOrder", label: "Purchase Order#", visible: true },
    { id: "purchaseOrderDate", label: "Order Date", visible: true },
    { id: "reference", label: "Reference", visible: true },
    { id: "supplierDisplayName", label: "Supplier Name", visible: true },
    { id: "grandTotal", label: "Amount", visible: true },
    { id: "Status", label: "Status", visible: true },
    { id: "Recieved", label: "Received", visible: false },
    { id: "Billed", label: "Billed", visible: false },
    { id: "ExpectedDate", label: "Expected Date", visible: false },
  ]);

  const [allPoData, setAllPOData] = useState<any[]>([]);
  const { request: getPO } = useApi("get", 5005);
  const { loading, setLoading } = useContext(TableResponseContext)!;
  const navigate = useNavigate();

  const getAllPO = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false });

      const url = `${endponits.GET_ALL_PURCHASE_ORDER}`;
      const { response, error } = await getPO(url);

      if (!error && response) {
        setAllPOData(response.data.allPurchaseOrder);
        setLoading({ ...loading, skeleton: false });
      } else {
        console.log(error);
        setLoading({ ...loading, skeleton: false, noDataFound: true });
      }
    } catch (error) {
      console.error(error);
      setLoading({ ...loading, skeleton: false, noDataFound: true });
    }
  };

  useEffect(() => {
    getAllPO();
  }, []);

  const handleRowClick = (id: string) => {
    navigate(`/purchase/purchase-order/view/${id}`);
  };

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
  
    const columnValue = item[colId as keyof typeof item];
    
    return columnValue ? columnValue : <span className="text-gray-500 italic">-</span>;
  };
  

  return (
    <PurchaseTable
      columns={columns}
      data={allPoData}
      onRowClick={handleRowClick}
      renderColumnContent={renderColumnContent}
      searchPlaceholder="Search Purchase Order"
      loading={loading.skeleton}
      searchableFields={["purchaseOrder", "supplierDisplayName"]}
      setColumns={setColumns}
    />
  );
};

export default PurchaseOrderTable;
