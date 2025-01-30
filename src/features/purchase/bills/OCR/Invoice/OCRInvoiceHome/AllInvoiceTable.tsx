import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DotIcon from "../../../../../../assets/icons/DotIcon";
import { endponits } from "../../../../../../Services/apiEndpoints";
import useApi from "../../../../../../Hooks/useApi";
import { PurchaseContext, TableResponseContext } from "../../../../../../context/ContextShare";
import PurchaseTable from "../../../../CommonComponents/PurchaseTable/PurchaseTable";
import { OCRInvoiceContext } from "../../../../../../context/ContextShare";

const AllInvoiceTable = () => {
  const [columns, setColumns] = useState([
    { id: "supplierDisplayName", label: "Supplier", visible: true },
    { id: "billNumber", label: "Invoice Number", visible: true },
    { id: "uploadedDate", label: "Uploaded Date", visible: true },
    { id: "status", label: "Review Status", visible: true },
    { id: "review_date", label: "Review Date", visible: true },
  ]);

  const { request: getInvoice } = useApi("get", 5000);
  const [invoice, setInvoice] = useState([]);

  const { ocrInvoice } = useContext(OCRInvoiceContext);
  const { loading, setLoading } = useContext(TableResponseContext)!;
      const {purchaseResponse}=useContext(PurchaseContext)!;
  
  const navigate = useNavigate();

  const getallInvoice = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false });

      const url = `${endponits.GET_ALL_OCR_INVOICE}`;
      const { response, error } = await getInvoice(url);

      if (!error && response) {
        setInvoice(response.data);
        setLoading({ ...loading, skeleton: false });

      }
      else{
        setLoading({ ...loading, skeleton: false, noDataFound: true });

      }
    } catch (error) {
      console.error("Error in fetching invoice data", error);
      setLoading({ ...loading, skeleton: false, noDataFound: true });

    }
  };

  const handleRowClick = (id: string) => {
    navigate(`/purchase/bills/invoice/view/${id}`);
  };

  const renderColumnContent = (colId: string, item: any) => {
    const columnValue = item[colId as keyof typeof item];

    if (colId === "status") {
      return (
        <div
          className={`${
            columnValue === "Need review" ? "bg-[#F7E7CE]" : "bg-[#DADCCD]"
          } text-[13px] rounded-lg text-center items-center text-textColor h-[18px] px-2 max-w-fit gap-2 py-2 flex justify-center`}
        >
          <DotIcon color="#495160" />
          {columnValue}
        </div>
      );
    }

    return columnValue || <span className="text-gray-500 italic">-</span>;
  };
 

  useEffect(() => {
    setLoading("");
    getallInvoice();
  }, [ocrInvoice,purchaseResponse]);

  return (
    <PurchaseTable
      page="OCR"
      columns={columns}
      data={invoice}
      onRowClick={handleRowClick}
      renderColumnContent={renderColumnContent}
      searchPlaceholder="Search Invoice"
      loading={loading.skeleton}
      searchableFields={["supplier_name", "status"]}
      setColumns={setColumns}
      deleteUrl={endponits.DELETE_OCR_INVOICE}
    />
  );
};

export default AllInvoiceTable;
