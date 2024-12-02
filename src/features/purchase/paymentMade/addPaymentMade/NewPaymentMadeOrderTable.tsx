import { useEffect, useRef, useState } from "react";
import { PaymentMadeUnpaidBillTable } from "../../../../assets/constants";
import toast from "react-hot-toast";

type Props = {
  paymentState?: any;
  setPaymentState?: any;
  supplierBills?: BillData[];
  isFullAmt?: boolean;
};

interface BillData {
  billId: string;
  billDate: string;
  dueDate: string;
  billNumber: string;
  billAmount: number;
  amountDue: number;
  payment: number;
  paidStatus: string;
}

const NewPaymentMadeOrderTable = ({
  paymentState,
  setPaymentState,
  supplierBills = [],
  isFullAmt = false,
}: Props) => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [data, setData] = useState<BillData[]>([
    {
      billId: "",
      billDate: "",
      dueDate: "",
      billNumber: "",
      billAmount: 0,
      amountDue: 0,
      payment: 0,
      paidStatus: "",
    },
  ]);
  console.log(supplierBills, "supplierBills");

  const dropdownRef = useRef<HTMLDivElement | null>(null);



useEffect(() => {
  if (supplierBills && Array.isArray(supplierBills)) {
    const filteredBills = supplierBills?.filter(
      (bill: any) => bill.paidStatus === "Pending" || bill.paidStatus === "Overdue"
    );

    setData(
      filteredBills.map((bill: any) => ({
        billId: bill._id || "",
        billDate: bill.billDate || "",
        dueDate: bill.dueDate || "",
        billNumber: bill.billNumber || "",
        billAmount: bill.grandTotal || 0,
        amountDue: bill.balanceAmount || 0,
        payment: bill.payment || 0,
        paidStatus: bill.paidStatus || "",
      }))
    );
  }
}, [supplierBills]);

  

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpenDropdownId(null);
    }
  };

  const handleRowChange = (
    index: number,
    field: keyof BillData,
    value: string | number
  ) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    const billAmount = newData[index].billAmount;
    const amountDue=newData[index].amountDue;
    let paymentValue = typeof value === "number" ? value : parseFloat(value);

    if (isFullAmt) {
      newData[index].payment = billAmount;
    } else {
      newData[index].payment = 0;

      if (paymentValue > amountDue) {
        toast.error(
          `Payment cannot exceed the balance amount of ${amountDue}. Setting payment to bill amount.`
        );
        paymentValue = amountDue;
      }

      // const totalPayment =
      //   newData.reduce((acc, row) => acc + (row.payment || 0), 0) +
      //   paymentValue -
      //   (newData[index].payment || 0);

      // if (totalPayment > paymentState.paymentMade) {
      //   const remainingAmount =
      //     paymentState.paymentMade - (totalPayment - paymentValue);
      //   toast.error(
      //     `Payment cannot exceed the available amount of ${paymentState.paymentMade}. Adjusting payment to ${remainingAmount}.`
      //   );
      //   newData[index].payment = Math.min(remainingAmount, paymentValue);
      // } else {
        newData[index].payment = paymentValue;
      // }
    }


    setData(newData);

    if (setPaymentState) {
      const totalPayment = newData.reduce(
        (acc, row) => acc + (row.payment || 0),
        0
      );
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
    const updatedData = data.map((row) => ({
      ...row,
      payment: isFullAmt ? row.billAmount : 0,
    }));

    const totalPayment = updatedData.reduce((acc, row) => acc + row.payment, 0);

    console.log(updatedData,"update");
    

    setData(updatedData);

    if (setPaymentState) {
      setPaymentState((prevData: any) => ({
        ...prevData,
        unpaidBills: updatedData,
        total: totalPayment,
        amountPaid: totalPayment,
        amountUsedForPayments: totalPayment,
      }));
    }
  }, [isFullAmt, paymentState.supplierId]);

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
        <table className=" text-xs min-w-full bg-white rounded-lg relative pb-4 border-dropdownText text-textColor">
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
            {data && data.length > 0 ? (
              data
                .filter(
                  (row) =>
                    row.paidStatus === "Pending" || row.paidStatus === "Overdue"
                )
                .map((row, index) => (
                  <tr key={index} className="relative">
                    <td className="py-2.5 px-4 border-y border-tableBorder">
                      <input
                        disabled
                        type="text"
                        placeholder="Date"
                        className="w-full focus:outline-none text-center"
                        value={row.billDate ? row.billDate : "-"}
                        onChange={(e) =>
                          handleRowChange(index, "billDate", e.target.value)
                        }
                      />
                    </td>
                    <td className="py-2.5 px-4 border-y border-tableBorder">
                      <input
                        disabled
                        type="text"
                        placeholder="Due Date"
                        className="w-full focus:outline-none text-center"
                        value={row.dueDate ? row.dueDate : "-"}
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
                        value={row.billNumber ? row.billNumber : "-"}
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
                ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-4 text-center text-gray-500 text-[red]"
                >
                  There are no bills for this supplier.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-right text-textColor text-sm mt-4">
        Total <span className="ms-20 font-semibold">{paymentState.total}</span>
      </p>
    </div>
  );
};

export default NewPaymentMadeOrderTable;
