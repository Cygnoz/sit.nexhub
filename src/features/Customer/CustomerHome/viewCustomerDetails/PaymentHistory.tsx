import { useContext, useEffect, useRef, useState } from "react";
import { endponits } from "../../../../Services/apiEndpoints";
import { TableResponseContext } from "../../../../context/ContextShare";
import useApi from "../../../../Hooks/useApi";
import PencilEdit from "../../../../assets/icons/PencilEdit";
import TrashCan from "../../../../assets/icons/TrashCan";
import Eye from "../../../../assets/icons/Eye";
import NoDataFoundTable from "../../../../Components/skeleton/Table/NoDataFoundTable";
import TableSkelton from "../../../../Components/skeleton/Table/TableSkelton";
import Calender from "../../../../assets/icons/Calender";
import CehvronDown from "../../../../assets/icons/CehvronDown";

type Props = { customerId?: string };

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB").split("/").join("-");
}

function getFirstDayOfMonth() {
  const date = new Date();
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-01`;
}

function getLastDayOfMonth() {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];
}

const PaymentHistory = ({ customerId }: Props) => {
  const [fromDate, setFromDate] = useState(getFirstDayOfMonth());
  const [toDate, setToDate] = useState(getLastDayOfMonth());
  const [allData, setAllData] = useState<any[]>([]);
  const fromDateRef = useRef<HTMLInputElement>(null);
  const toDateRef = useRef<HTMLInputElement>(null);
  
  const [columns] = useState([
    { id: "receipt", label: "INV", visible: true },
    { id: "createdDate", label: "Date", visible: true },
    { id: "amountReceived", label: "Amount", visible: true },
    { id: "contact", label: "Remark", visible: true },
  ]);

  const { loading, setLoading } = useContext(TableResponseContext)!;
  const { request: getAllQuotes } = useApi("get", 5002);

  const handleFromDateClick = () => {
    fromDateRef.current?.showPicker();
  };

  const handleToDateClick = () => {
    toDateRef.current?.showPicker();
  };

  const fetchAllQuotes = async () => {
    try {
      const url = `${endponits.GET_CUSTOMER_PAYMENT}/${customerId}`;
      setLoading({ ...loading, skeleton: true });
      const { response, error } = await getAllQuotes(url);
      if (error || !response) {
        setLoading({ ...loading, skeleton: false, noDataFound: true });
        return;
      }
      setAllData(response.data);
      setLoading({ ...loading, skeleton: false });
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setLoading({ ...loading, noDataFound: true, skeleton: false });
    }
  };

  useEffect(() => {
    fetchAllQuotes();
  }, []);

  const filteredData = allData.reverse().filter((item) => {
    const itemDate = new Date(item.createdDate).toISOString().split("T")[0];
    return itemDate >= fromDate && itemDate <= toDate;
  });

  return (
    <div>
      <div className="bg-[#F6F6F6] flex px-4 py-[24px]">
       
        <div className="flex text-dropdownText gap-4 ml-auto">
          <div
            className="relative border-2 border-slate-200 flex rounded-md px-2 py-1 text-sm items-center cursor-pointer bg-white"
            onClick={handleFromDateClick}
          >
            <div className="pointer-events-none flex items-center px-2 text-gray-700">
              <Calender color="currentColor" height={18} width={18} />
            </div>
            {(fromDate)}
            <div className="pointer-events-none flex items-center px-2 text-gray-700">
              <CehvronDown color="gray" />
            </div>
            <input
              type="date"
              ref={fromDateRef}
              className="absolute inset-0 opacity-0 cursor-pointer"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div
            className="relative border-2 border-slate-200 flex rounded-md px-2 py-1 text-sm items-center cursor-pointer bg-white"
            onClick={handleToDateClick}
          >
            <div className="pointer-events-none flex items-center px-2 text-gray-700">
              <Calender color="currentColor" height={18} width={18} />
            </div>
            {formatDate(toDate)}
            <div className="pointer-events-none flex items-center px-2 text-gray-700">
              <CehvronDown color="gray" />
            </div>
            <input
              type="date"
              ref={toDateRef}
              className="absolute inset-0 opacity-0 cursor-pointer"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
      </div>
      <table className="min-w-full bg-white mb-5">
        <thead className="text-[12px] text-center text-dropdownText">
          <tr style={{ backgroundColor: "#F9F7F0" }}>
            <th className="py-2.5 px-4 font-medium border-b border-tableBorder">Sl.No</th>
            {columns.map((col) => (
              <th key={col.id} className="py-2.5 px-4 font-medium border-b border-tableBorder">{col.label}</th>
            ))}
            <th className="py-3 px-4 font-medium border-b border-tableBorder">Actions</th>
          </tr>
        </thead>
        <tbody className="text-dropdownText text-center text-[13px]">
          {loading.skeleton ? (
            [...Array(5)].map((_, idx) => <TableSkelton key={idx} columns={columns} />)
          ) : filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={item._id}>
                <td className="py-2.5 px-4 border-y border-tableBorder">{index + 1}</td>
                {columns.map((col) => (
                  <td key={col.id} className="py-2.5 px-4 border-y border-tableBorder">{item[col.id] || "-"}</td>
                ))}
                <td className="py-3 px-4 border-b border-tableBorder flex gap-3 justify-center">
                  <PencilEdit color="#0B9C56" className="cursor-pointer" />
                  <Eye color="#569FBC" className="cursor-pointer" />
                  <TrashCan color="red" />
                </td>
              </tr>
            ))
          ) : (
            <NoDataFoundTable columns={columns} />
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
