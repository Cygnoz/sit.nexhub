import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SalesRecieptTable } from "../../../assets/constants";

type Props = {
  customerReciept?: InvoiceType[];
  recieptState?: any;
  setRecieptState?: any;
}
type InvoiceType = {
  invoiceId: string;
  salesInvoice: string;
  salesInvoiceDate: string;
  dueDate: string;
  totalAmount: number;
  balanceAmount: number;
  paymentAmount: number;
  paidStatus: string;
};

function NewRecieptTable({ customerReciept = [], recieptState, setRecieptState }: Props) {

  const [data, setData] = useState<InvoiceType[]>([
    {
      invoiceId: "",
      salesInvoice: "",
      salesInvoiceDate: "",
      dueDate: "",
      totalAmount: 0,
      balanceAmount: 0,
      paymentAmount: 0,
      paidStatus: ""
    },
  ]);

  useEffect(() => {
    if (customerReciept && Array.isArray(customerReciept)) {
      const filteredInvoice = customerReciept?.filter(
        (invoice: any) => invoice.paidStatus === "Pending" || invoice.paidStatus === "Overdue"
      );

      setData(
        filteredInvoice.map((invoice: any) => ({
          invoiceId: invoice._id || "",
          salesInvoice: invoice.salesInvoice || "",
          salesInvoiceDate: invoice.salesInvoiceDate || "",
          dueDate: invoice.dueDate || "",
          totalAmount: invoice.totalAmount || 0,
          balanceAmount: invoice.balanceAmount || 0,
          paymentAmount: invoice.paymentAmount || 0,
          paidStatus: invoice.paidStatus || "",
        }))
      );
    }
  }, [customerReciept]);

  const handleRowChange = (
    index: number,
    field: keyof InvoiceType,
    value: string | number
  ) => {
    const newData = [...data];
    const invoiceAmount = newData[index].balanceAmount;
    let paymentValue = typeof value === "number" ? value : parseFloat(value);

    if (field === "paymentAmount") {
      if (paymentValue > invoiceAmount) {
        toast.error(
          `Payment cannot exceed the total amount of ${invoiceAmount}. Setting payment to total amount.`
        );
        paymentValue = invoiceAmount;
      }
      newData[index][field] = paymentValue;
    }

    setData(newData);

    if (setRecieptState) {
      const totalPayment = newData.reduce(
        (acc, row) => acc + (row.paymentAmount || 0),
        0
      );
      setRecieptState((prevState: any) => ({
        ...prevState,
        invoice: newData,
        total: totalPayment,
        amountReceived: totalPayment,
        amountUsedForPayments: totalPayment,
      }));
    }
  };

  return (
    <div>
      <div className="rounded-lg border-2 border-tableBorder mt-3">
        <table className=" text-xs min-w-full bg-white rounded-lg relative pb-4 border-dropdownText text-textColor">
          <thead className="text-[12px] text-center text-dropdownText">
            <tr className="bg-[#FDF8F0]">
              {SalesRecieptTable.map((item, index) => (
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
                        value={row.salesInvoiceDate ? row.salesInvoiceDate : "-"}
                        onChange={(e) =>
                          handleRowChange(index, "salesInvoiceDate", e.target.value)
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
                        value={row.salesInvoice ? row.salesInvoice : "-"}
                        onChange={(e) =>
                          handleRowChange(index, "salesInvoice", e.target.value)
                        }
                      />
                    </td>
                    <td className="py-2.5 px-4 border-y border-tableBorder">
                      <input
                        disabled
                        type="number"
                        className="w-full focus:outline-none text-center"
                        value={row.totalAmount}
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            "totalAmount",
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
                        value={row.balanceAmount}
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            "balanceAmount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </td>
                    <td className="py-2.5 px-4 border-y border-tableBorder">
                      <input
                        type="number"
                        className="w-full focus:outline-none text-center"
                        value={row.paymentAmount}
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            "paymentAmount",
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
                  There are no Invoice for this Customer.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-right text-textColor text-sm mt-4">
        Total <span className="ms-20 font-semibold">{recieptState.total ? recieptState.total : "0"}</span>
      </p>
    </div>
  )
}

export default NewRecieptTable