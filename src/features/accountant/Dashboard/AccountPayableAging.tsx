type Props = {};

const agingData = [
  { supplier: "Supplier 1", amount: "50,000", dueDate: "01 June 24", aging: "0-30 Days" },
  { supplier: "Supplier 2", amount: "30,000", dueDate: "01 May 24", aging: "31-60 Days" },
  { supplier: "Supplier 3", amount: "20,000", dueDate: "02 April 24", aging: "61-90 Days" },
  { supplier: "Supplier 4", amount: "10,000", dueDate: "03 Feb 24", aging: "Over 90 Days" },
];

const tableHeaders = ["Supplier", "Amount", "Due Date", "Aging"];

function AccountPayableAging({}: Props) {
  return (
    <div className="bg-white w-full p-6 rounded-lg">
      <p className="text-[#303F58] text-base font-semibold">Account Payable Aging</p>

      <div className="mt-5">
        <table className="min-w-full text-start bg-white my-5">
          <thead className="text-[12px] text-dropdownTex">
            <tr style={{ backgroundColor: "#F9F7F0" }}>
              {tableHeaders.map((heading, index) => (
                <th
                  key={index}
                  className="p-4 font-medium border-b border-tableBorder text-start"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agingData.map((item, index) => (
              <tr key={index} className="border-b border-[#EAECF0] text-[#4B5C79]">
                <td className="py-6 px-4 text-xs">{item.supplier}</td>
                <td className="py-6 px-4 text-xs">{item.amount}</td>
                <td className="py-6 px-4 text-xs">{item.dueDate}</td>
                <td className="py-6 px-4 text-xs">{item.aging}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AccountPayableAging;
