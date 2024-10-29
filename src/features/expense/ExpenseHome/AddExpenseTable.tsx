import React, { useState } from "react";
import CirclePlus from "../../../assets/icons/circleplus";

interface Row {
  expenseAccount: string;
  notes: string;
  amount: number | string;
}

const ExpenseTable: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([
    { expenseAccount: "", notes: "", amount: "" },
  ]);

  const handleAddRow = () => {
    setRows([...rows, { expenseAccount: "", notes: "", amount: "" }]);
  };

  const handleRowChange = (index: number, field: keyof Row, value: string) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const calculateTotal = () => {
    return rows.reduce((total, row) => {
      return total + (parseFloat(row.amount.toString()) || 0);
    }, 0).toFixed(2);
  };

  return (
    <div className="p-4 ">
      <div className="overflow-auto">
        <table className="w-full bg-gray-50 rounded-md">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="p-2 text-sm text-labelColor bg-amber-50">Expense Account</th>
              <th className="p-2 text-sm text-labelColor bg-amber-50">Notes</th>
              <th className="p-2 text-sm text-labelColor bg-amber-50">Amount</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-inputBorder">
                <td className="p-2">
                  <div className="relative">
                    <select
                      value={row.expenseAccount}
                      onChange={(e) => handleRowChange(index, "expenseAccount", e.target.value)}
                      className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                    >
                      <option value="" disabled>
                        Select Account
                      </option>
                      <option value="Cost of goods sold">Cost of goods sold</option>
                      <option value="Other expense">Other expense</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={row.notes}
                    onChange={(e) => handleRowChange(index, "notes", e.target.value)}
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
                    onClick={() =>
                      setRows(rows.filter((_, rowIndex) => rowIndex !== index))
                    }
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
        <div 
          onClick={handleAddRow}
          className="hover:bg-gray-100 cursor-pointer rounded-lg py-2 flex items-center"
        >
          <div className="flex items-center space-x-2">
            <CirclePlus color="darkRed" size="18" />
            <p className="text-darkRed text-sm font-semibold">
              Add new Item
            </p>
          </div>
        </div>
        <div className="text-sm font-semibold text-gray-700">
          Expense Total: {calculateTotal()}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTable;
