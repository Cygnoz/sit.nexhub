import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../../Hooks/useApi";
import { TableResponseContext } from "../../../context/ContextShare";
import { endponits } from "../../../Services/apiEndpoints";
import PurchaseTable from "../CommonComponents/PurchaseTable/PurchaseTable";

const PaymentMadeTable = () => {
  const navigate = useNavigate();

  const [columns] = useState([
    { id: "paymentDate", label: "Date", visible: true },
    { id: "payment", label: "Payment#", visible: true },
    { id: "supplierDisplayName", label: "Vendor Name", visible: true },
    { id: "bill", label: "Bill#", visible: true },
    { id: "paymentMode", label: "Mode", visible: true },
    { id: "amountPaid", label: "Amount", visible: true },
  ]);

  const [allBill, setAllBill] = useState<any[]>([]);
  const { request: getBills } = useApi("get", 5005);
  const { loading, setLoading } = useContext(TableResponseContext)!;

  const getAllBill = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false });
      const url = `${endponits.GET_PAYMENTMADE}`;
      const { response, error } = await getBills(url);

      if (!error && response) {
        setAllBill(response.data.allPayments);
        setLoading({ ...loading, skeleton: false });
      } else {
        console.error(error);
        setLoading({ ...loading, skeleton: false, noDataFound: true });
      }
    } catch (error) {
      console.error(error);
      setLoading({ ...loading, skeleton: false, noDataFound: true });
    }
  };

  useEffect(() => {
    getAllBill();
  }, []);

  const handleRowClick = (id: string) => {
    navigate(`/purchase/payment-made/view/${id}`);
  };

  const renderColumnContent = (colId: string, item: any) => {
    if (colId === "bill" && item.unpaidBills) {
      return item.unpaidBills.map((bill: any) => bill.billNumber).join(", ");
    }
    return item[colId as keyof typeof item];
  };

  return (
    <PurchaseTable
      columns={columns}
      data={allBill}
      onRowClick={handleRowClick}
      renderColumnContent={renderColumnContent}
      searchPlaceholder="Search Payments"
      loading={loading.skeleton}
      searchableFields={["paymentDate", "supplierDisplayName"]}
    />
  );
};

export default PaymentMadeTable;
