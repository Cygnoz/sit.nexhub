import { useContext, useEffect, useState } from "react";
// import DotIcon from "../../../../../assets/icons/DotIcon";
// import DateFormat from "../../../../../Components/DateFormat/DateFormta";
import PurchaseTable from "../../../../CommonComponents/PurchaseTable/PurchaseTable";
// import { endponits } from "../../../../../Services/apiEndpoints";
import { useNavigate } from "react-router-dom";
// import useApi from "../../../../../Hooks/useApi";
import { TableResponseContext } from "../../../../../../context/ContextShare";
import DotIcon from "../../../../../../assets/icons/DotIcon";
import { endponits } from "../../../../../../Services/apiEndpoints";
import useApi from "../../../../../../Hooks/useApi";


const AllInvoiceTable = () => {
  const [columns, setColumns] = useState([
    { id: "supplier_name", label: "Supplier", visible: true },
    { id: "invoice_no", label: "Invoice Number", visible: true },
    { id: "uploadedDate", label: "Uploaded Date", visible: true },
    { id: "status", label: "Review Status", visible: true },
    { id: "reviewDate", label: "Review Date", visible: true },
  ]);

  const { request: getInvoice } = useApi("get", 5000);
  const [invoice,setInvoice]=useState<[]|any>([])


    const getallInvoice = async () => {
      try {
        const url = `${endponits.GET_ALL_OCR_INVOICE}`;
        const { response, error } = await getInvoice(url);
        if (!error && response) {
          setInvoice(response.data);
          console.log(response, "currencyData");
        }
      } catch (error) {
        console.error("Error in fetching currency data", error);
      }
    };
  
    console.log(invoice)

  const { loading, setLoading } = useContext(TableResponseContext)!;
  const navigate = useNavigate();

  setLoading("")

  const handleRowClick = () => {
    navigate(`/purchase/bills/invoice/view`);
  };

  useEffect(()=>{
getallInvoice()
  },[])

  const renderColumnContent = (colId: string, item: any) => {
    const columnValue = item[colId as keyof typeof item];
    if (colId === "reviewStatus") {
      return (
        <div className="flex justify-center items-center">
          <div
            className={`${
              item.reviewStatus === "Need Review" ? "bg-[#F7E7CE]" :"bg-[#DADCCD]"
            } text-[13px] rounded-lg text-center items-center text-textColor h-[18px] px-2 max-w-fit gap-2 py-2 flex justify-center`}
          >
                        <DotIcon color="#495160" />

            {item.reviewStatus}
          </div>
       </div>
      );
    }
    return columnValue ? columnValue : <span className="text-gray-500 italic">-</span>;
  };

  return (
    <PurchaseTable
      columns={columns}
      data={invoice}
      onRowClick={handleRowClick}
      renderColumnContent={renderColumnContent}
      searchPlaceholder="Search Invoice"
      loading={loading.skeleton}
      searchableFields={["supplier", "reviewStatus"]}
      setColumns={setColumns}
    />
  );
};

export default AllInvoiceTable;
