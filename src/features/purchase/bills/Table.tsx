import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../../Hooks/useApi";
import { TableResponseContext } from "../../../context/ContextShare";
import { endponits } from "../../../Services/apiEndpoints";
import DotIcon from "../../../assets/icons/DotIcon";
import PurchaseTable from "../CommonComponents/PurchaseTable/PurchaseTable";
import DateFormat from "../../../Components/DateFormat/DateFormta";

const Table = () => {
  const [columns,setColumns] = useState([
    { id: "billNumber", label: "Bill#", visible: true },
    { id: "billDate", label: "Bill Date", visible: true },
    { id: "supplierDisplayName", label: "Supplier Name", visible: true },
    { id: "grandTotal", label: "Amount", visible: true },
    { id: "dueDate", label: "Due Date", visible: true },
    { id: "paidStatus", label: "Status", visible: true },
  ]);

  const [allBills, setAllBills] = useState<any[]>([]);
  const { request: getBills } = useApi("get", 5005);
  const { loading, setLoading } = useContext(TableResponseContext)!;
  const navigate = useNavigate();

  const getAllBills = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false });

      const url = `${endponits.GET_ALL_BILLS}`;
      const { response, error } = await getBills(url);

      if (!error && response) {
        setAllBills(response.data.allBills);
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
    getAllBills();
  }, []);

  const handleRowClick = (id: string) => {
    navigate(`/purchase/bills/view/${id}`);
  };

  const renderColumnContent = (colId: string, item: any) => {
    if (colId === "paidStatus") {
      return (
        <div className="flex justify-center items-center">
          <div
            className={`${
              item.paidStatus === "Pending" ? "bg-zinc-200" :item.paidStatus==="Completed"? "bg-[#94dca9]":"bg-[#dcd894]"
            } text-[13px] rounded-lg text-center items-center text-textColor h-[18px] px-2 max-w-fit gap-2 py-2 flex justify-center`}
          >
            <DotIcon color="#495160" />
            {item.paidStatus}
          </div>
       </div>
      );
    }
    if (colId === "billDate" || colId === "dueDate") {
      return <DateFormat date={item[colId]} />;
    }
    return item[colId as keyof typeof item];
  };

  return (
    <PurchaseTable
      columns={columns}
      data={allBills}
      onRowClick={handleRowClick}
      renderColumnContent={renderColumnContent}
      searchPlaceholder="Search Bills"
      loading={loading.skeleton}
      searchableFields={["billNumber", "supplierDisplayName"]}
      setColumns={setColumns}
    />
  );
};

export default Table;
