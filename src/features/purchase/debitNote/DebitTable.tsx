import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DotIcon from "../../../assets/icons/DotIcon";
import PurchaseTable from "../CommonComponents/PurchaseTable/PurchaseTable";
import { TableResponseContext } from "../../../context/ContextShare";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

const DebitTable = () => {
  const navigate = useNavigate();

  const initialColumns: Column[] = [
    { id: "debitNote", label: "Debit Note", visible: true },
    { id: "supplierDisplayName", label: "Supplier Name", visible: true },
    { id: "supplierDebitDate", label: "Date", visible: true },
    { id: "orderNumber", label: "orderNumber", visible: true },
    // { id: "customerDetails", label: "Status", visible: true },
    { id: "grandTotal", label: "Balance", visible: false },
  ];

  const [columns,setColumns] = useState<Column[]>(initialColumns);
  const [allDNdata, setAllDNdata] = useState<any[]>([]);
  const { request: getDN } = useApi("get", 5005);
  const { loading, setLoading } = useContext(TableResponseContext)!;

  const getDebitNotes = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false });
      const url = `${endponits.GET_ALL_DEBIT_NOTE}`;
      const { response, error } = await getDN(url);

      if (!error && response ) {
        setAllDNdata(response.data.allDebitNote);
        setLoading({ ...loading, skeleton: false, noDataFound: false });
      } else {
        setLoading({ ...loading, skeleton: false, noDataFound: true });
      }
    } catch (error) {
      console.error(error);
      setLoading({ ...loading, skeleton: false, noDataFound: true });
    }
  };

  useEffect(() => {
    getDebitNotes();
  }, []);

  const handleRowClick = (id: string) => {
    navigate(`/purchase/debit-note/view/${id}`);
  };

  const renderColumnContent = (colId: string, item: any) => {
    if (colId === "customerDetails") {
      return (
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center gap-1.5 bg-BgSubhead rounded-2xl px-2 pt-0.5 pb-0.5">
            <DotIcon color="#495160" />
            <p className="text-outlineButton text-xs font-medium">{item.customerDetails}</p>
          </div>
        </div>
      );
    }
    return item[colId as keyof typeof item] || "-";
  };

  return (
    <div>
      <PurchaseTable
        columns={columns}
        data={allDNdata}
        onRowClick={handleRowClick}
        renderColumnContent={renderColumnContent}
        searchPlaceholder="Search by Supplier Name, Debit note"
        loading={loading.skeleton} 
        searchableFields={["supplierDisplayName","debitNote"]}
        setColumns={setColumns}
      />
    </div>
  );
};

export default DebitTable;
