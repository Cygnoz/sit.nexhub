import React, { useEffect, useState } from "react";
import CirclePlus from "../../../assets/icons/circleplus";
import CehvronDown from "../../../assets/icons/CehvronDown";
interface Row {
  expenseAccountId: string;
  expenseAccount: string;
  note: string;
  amount: number | string;
}
type Props = {
  expenseData: {
    expenseDate: string;
    employee: string;
    paidThrough: string;
    paidThroughId: string;
    distance: string;
    ratePerKm: string;
    vendor: string;
    invoice: string;
    uploadFiles:string;
    expense: Row[];
  };
  setExpenseData: React.Dispatch<React.SetStateAction<any>>;
  liabilities:any
};

const AddExpenseTable = ({ expenseData, setExpenseData,liabilities}: Props) => {
  const [rows, setRows] = useState<Row[]>(expenseData.expense);

  useEffect(() => {
    // Keep rows in sync with expenseData.expense
    setRows(expenseData.expense);
  }, [expenseData.expense]);
  const handleAddRow = () => {
    const newRow = { expenseAccountId: "", expenseAccount: "", note: "", amount: "" };
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    setExpenseData({ ...expenseData, expense: updatedRows });
  };
 
  const handleRowChange = (index: number, field: keyof Row, value: string) => {
    const updatedRows = rows.map((row, rowIndex) =>
      rowIndex === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  
    // Update the expenseData as well
    setExpenseData({ ...expenseData, expense: updatedRows });
  };

  const handleRowBatchChange = (index: number, updatedFields: Partial<Row>) => {
    const updatedRows = rows.map((row, rowIndex) =>
      rowIndex === index ? { ...row, ...updatedFields } : row
    );
    setRows(updatedRows);
    setExpenseData({ ...expenseData, expense: updatedRows });
  };
  

  const calculateTotal = () => {
    return rows
      .reduce((total, row) => total + (parseFloat(row.amount.toString()) || 0), 0)
      .toFixed(2);
  };





  return (
    <div className="p-4">
      <div className="overflow-auto">
        <table className="w-full bg-gray-50 rounded-md">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="p-2 text-sm text-labelColor bg-[#FDF8F0]">Expense Account</th>
              <th className="p-2 text-sm text-labelColor bg-[#FDF8F0]">Notes</th>
              <th className="p-2 text-sm text-labelColor bg-[#FDF8F0]">Amount</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-inputBorder">
                <td className="p-2">
                <div className="relative w-full">
  <select
    name="expenseAccount"
    value={rows[index]?.expenseAccount || ""}
    onChange={(e) => {
      const selectedValue = e.target.value;
      // Find the selected account's ID
      const selectedAccount = liabilities.find(
        (account: any) => account.accountName === selectedValue
      );
      // Batch update both fields at once
      const updatedFields = {
        expenseAccount: selectedValue,
        expenseAccountId: selectedAccount?._id || "",
      };
      handleRowBatchChange(index, updatedFields);
    }}
    className="appearance-none w-full h-9 text-zinc-700 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
  >
    <option value="">Select an Account</option>
    {liabilities&&liabilities?.filter(
        (account: any) =>
          // Exclude accounts already selected in other rows
          !rows.some((row) => row.expenseAccount === account.accountName) ||
          row.expenseAccount === account.accountName // Include the current row's selected account
      )
      .map((account: any) => (
        <option key={account._id} value={account.accountName}>
          {account.accountName}
        </option>
      ))}
  </select>
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
    <CehvronDown color="gray" />
  </div>
</div>




</td>
<td className="p-2">
  <input
    type="text"
    value={row.note}
    onChange={(e) => handleRowChange(index, "note", e.target.value)}
    placeholder="Max 500 char"
    className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-2 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
  />
</td>
                <td className="p-2">
                  <input
                    type="number"
                    value={row.amount}
                    onChange={(e) => handleRowChange(index, "amount", e.target.value)}
                    placeholder="0.00"
                    className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-2 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => {
                      if(rows.length!=1){
                        const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
                      setRows(updatedRows);
                      setExpenseData({ ...expenseData, expense: updatedRows });
                      }
                    }}
                    className="text-gray-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </td>

                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      <div className="flex justify-between items-center mt-4">
        <div onClick={handleAddRow} className="hover:bg-gray-100 cursor-pointer rounded-lg py-2 flex items-center">
          <div className="flex items-center space-x-2">
            <CirclePlus color="darkRed" size="18" />
            <p className="text-darkRed text-sm font-semibold">Add new Item</p>
          </div>
        </div>
        <div className="text-sm font-semibold text-gray-700">Expense Total: {calculateTotal()}</div>
      </div>
    </div>
  );
};

export default AddExpenseTable;
