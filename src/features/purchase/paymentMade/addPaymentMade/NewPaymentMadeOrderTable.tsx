import { useEffect, useRef, useState } from "react";
import { PaymentMadeUnpaidBillTable } from "../../../../assets/constants";
import PlusCircle from "../../../../assets/icons/PlusCircle";

type Props = {
  paymentState?: any;
  setPaymentState?: any;
  supplierBills?: BillData[];
};

interface BillData {
  billId: string;
  billDate: string;
  dueDate: string;
  billNumber: string;
  billAmount: number;
  amountDue: number;
  payment: number;
}

const NewPaymentMadeOrderTable = ({
  paymentState,
  setPaymentState,
  supplierBills = [],
}: Props) => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [data, setData] = useState<BillData[]>([]);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Set initial data from supplierBills
  useEffect(() => {
    if (supplierBills && Array.isArray(supplierBills)) {
      setData(
        supplierBills.map((bill: any) => ({
          billId: bill._id || "",
          billDate: bill.billDate || "",
          dueDate: bill.dueDate || "",
          billNumber: bill.billNumber || "",
          billAmount: bill.grandTotal || 0,
          amountDue: bill.amountDue || 0,
          payment: bill.payment || 0,
        }))
      );
    }
  }, [supplierBills]);
  // console.log(data,data)

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
      billId: "",
      billDate: "",
      dueDate: "",
      billNumber: "",
      billAmount: 0,
      amountDue: 0,
      payment: 0,
    };
    setData((prevData) => [...prevData, newRow]);
  };

  const handleRowChange = (
    index: number,
    field: keyof BillData,
    value: string | number
  ) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };

    const billAmount = newData[index].billAmount;
    const payment = newData[index].payment;
    newData[index].amountDue = billAmount - payment;

    const totalPayment = newData.reduce((acc, row) => acc + row.payment, 0);

    console.log(newData[index].amountDue, "amountDue");
    console.log(billAmount, "billAmt");
    console.log(payment, "payment");

    setData(newData);

    if (setPaymentState) {
      setPaymentState((prevData: any) => ({
        ...prevData,
        unpaidBills: newData,
        total: totalPayment,

        amountPaid: totalPayment,

        amountUsedForPayments: totalPayment,
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
        <table className="min-w-full bg-white rounded-lg relative pb-4 border-dropdownText text-textColor">
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
                    disabled
                    type="date"
                    placeholder="Date"
                    className="w-full focus:outline-none text-center"
                    value={row.billDate?row.billDate:"-"}
                    onChange={(e) =>
                      handleRowChange(index, "billDate", e.target.value)
                    }
                  />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    disabled
                    type="date"
                    placeholder="Due Date"
                    className="w-full focus:outline-none text-center"
                    value={row.dueDate?row.dueDate:"-"}
                    onChange={(e) =>
                      handleRowChange(index, "dueDate", e.target.value)
                    }
                  />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    disabled
                    type="text"
                    placeholder="Bill ID"
                    className="w-full focus:outline-none text-center"
                    value={row.billNumber?row.billNumber:"-"}
                    onChange={(e) =>
                      handleRowChange(index, "billNumber", e.target.value)
                    }
                  />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    disabled
                    type="number"
                    className="w-full focus:outline-none text-center"
                    value={row.billAmount}
                    onChange={(e) =>
                      handleRowChange(
                        index,
                        "billAmount",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    disabled
                    type="number"
                    className="w-full focus:outline-none text-center"
                    value={row.amountDue}
                    onChange={(e) =>
                      handleRowChange(
                        index,
                        "amountDue",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    type="number"
                    className="w-full focus:outline-none text-center"
                    value={row.payment}
                    onChange={(e) =>
                      handleRowChange(
                        index,
                        "payment",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-right text-textColor text-sm mt-4">
        Total <span className="ms-20 font-semibold">{paymentState.total}</span>
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
