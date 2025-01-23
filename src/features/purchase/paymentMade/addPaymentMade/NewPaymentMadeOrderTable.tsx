import { useEffect, useState } from "react";
import { PaymentMadeUnpaidBillTable } from "../../../../assets/constants";

type Props = {
  paymentState?: any;
  setPaymentState?: any;
  supplierBills?: BillData[];
  isFullAmt?: boolean;
  page?: string;
};

interface BillData {
  billId: string;
  billDate: string;
  dueDate: string;
  billNumber: string;
  billAmount: number;
  amountDue: number;
  payment: number | string;
  paidStatus?: string; // added optional paidStatus
}

const NewPaymentMadeOrderTable = ({
  paymentState,
  setPaymentState,
  supplierBills = [],
  page,
}: Props) => {
  const [data, setData] = useState<BillData[]>([]);

  useEffect(() => {
    if (page === "edit") {
      if (paymentState?.unpaidBills && paymentState.unpaidBills.length > 0) {
        setData([...paymentState.unpaidBills]);
      }
    } else {
      if (supplierBills ) {
        const filteredBills = supplierBills.filter(
          (bill: BillData) =>
            bill.paidStatus === "Pending" || bill.paidStatus === "Overdue" || !bill.paidStatus 
        );

        console.log(filteredBills,"filteredBills")

        setData(
          filteredBills.map((bill:any) => ({
            billId: bill._id || "",
            billDate: bill.billDate || "",
            dueDate: bill.dueDate || "",
            billNumber: bill.billNumber || "",
            billAmount: bill.grandTotal || 0,
            amountDue: bill.balanceAmount || 0,
            payment: bill.payment ,
            paidStatus: bill.paidStatus || "", 
          }))
        );
      }
    }
  }, [supplierBills, paymentState?.unpaidBills, page]);

  

  const handleRowChange = (
    index: number,
    field: keyof BillData,
    value: string | number
  ) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    setData(newData);

    if (setPaymentState) {
      const totalPayment = newData.reduce(
        (acc, row) => acc + (Number(row.payment) || 0),
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

  return (
    <div>
      <div className="rounded-lg border-2 border-tableBorder mt-3">
        <table className="text-xs min-w-full bg-white rounded-lg relative pb-4 border-dropdownText text-textColor">
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
              data.map((row, index) => (
                <tr key={index} className="relative">
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {index + 1}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    <input
                      disabled
                      type="text"
                      placeholder="Date"
                      className="w-full focus:outline-none text-center"
                      value={row.billDate || "-"}
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
                      value={row.dueDate || "-"}
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
                      value={row.billNumber || "-"}
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
                  colSpan={7}
                  className="py-4 text-center text-gray-500 text-[red]"
                >
                  No unpaid bills available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-right text-textColor text-sm mt-4">
        Total <span className="ms-20 font-semibold">{paymentState?.total}</span>
      </p>
    </div>
  );
};

export default NewPaymentMadeOrderTable;
