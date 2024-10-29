import { useEffect, useRef, useState } from "react";
import { PaymentMadeUnpaidBillTable } from "../../../../assets/constants";
import PlusCircle from "../../../../assets/icons/PlusCircle";

type Props = { paymentState?: any, setPaymentState?: any };

interface BillData {
  date: string;
  dueDate: string;
  billId: string;
  billAmount: number;
  amountDue: number;
  payment: number;
}

const NewPaymentMadeOrderTable = ({paymentState, setPaymentState}: Props) => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [data, setData] = useState<BillData[]>([
    {
      date: "",
      dueDate: "",
      billId: "",
      billAmount: 0,
      amountDue: 0,
      payment: 0,
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpenDropdownId(null);
    }
  };

  const addRow = () => {
    const newRow: BillData = {
      date: "",
      dueDate: "",
      billId: "",
      billAmount: 0,
      amountDue: 0,
      payment: 0,
    };
    setData([...data, newRow]);
  };

  const handleRowChange = (index: number, field: keyof BillData, value: string | number) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    setData(newData);

    if (setPaymentState) {
      setPaymentState((prevData: any) => ({
        ...prevData,
        unpaidBills: newData,
      }));
    }
  };

  useEffect(() => {
    if (openDropdownId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

  return (
    <div>
      <div className="rounded-lg border-2 border-tableBorder mt-3">
        <table className="min-w-full bg-white rounded-lg relative pb-4 border-dropdownText">
          <thead className="text-[12px] text-center text-dropdownText">
            <tr className="bg-[#FDF8F0]">
              {PaymentMadeUnpaidBillTable.map((item, index) => (
                <th
                  className="py-3 px-4 font-medium border-b border-tableBorder relative"
                  key={index}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {data.map((row, index) => (
              <tr key={index} className="relative">
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    type="date"
                    placeholder="Date"
                    className="w-full focus:outline-none text-center"
                    value={row.date}
                    onChange={(e) => handleRowChange(index, "date", e.target.value)}
                  />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    type="date"
                    placeholder="Due Date"
                    className="w-full focus:outline-none text-center"
                    value={row.dueDate}
                    onChange={(e) => handleRowChange(index, "dueDate", e.target.value)}
                  />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    type="text"
                    placeholder="Bill ID"
                    className="w-full focus:outline-none text-center"
                    value={row.billId}
                    onChange={(e) => handleRowChange(index, "billId", e.target.value)}
                  />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    type="number"
                    placeholder="Bill Amount"
                    className="w-full focus:outline-none text-center"
                    value={row.billAmount?row.billAmount : ""}
                    onChange={(e) => handleRowChange(index, "billAmount", parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    type="number"
                    placeholder="Amount Due"
                    className="w-full focus:outline-none text-center"
                    value={row.amountDue? row.amountDue:""}
                    onChange={(e) => handleRowChange(index, "amountDue", parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    type="number"
                    placeholder="Payment"
                    className="w-full focus:outline-none text-center"
                    value={row.payment? row.payment:""}
                    onChange={(e) => handleRowChange(index, "payment", parseFloat(e.target.value) || 0)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-right text-textColor text-sm mt-4">
        Total <span className="ms-20 font-semibold">0.00</span>
      </p>
      <button onClick={addRow} className="mt-1">
        <p className="text-darkRed my-3 text-sm flex gap-2 items-center">
          <PlusCircle color="darkRed" />
          <b>Add Item</b>
        </p>
      </button>
    </div>
    
  );
};

export default NewPaymentMadeOrderTable;
