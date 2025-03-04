type Props = {};

const salesData = [
  { customer: "Ashwathy MT", salesPerson: "John Bhaskar", revenue: "₹10,000.00" },
  { customer: "Athira P", salesPerson: "Kevin Nash", revenue: "₹5,000.00" },
  { customer: "Sourav K", salesPerson: "Kiran Roa", revenue: "₹6,000.00" },
  { customer: "Athul KP", salesPerson: "John Bhaskar", revenue: "₹5,000.00" },
  { customer: "Dilna K", salesPerson: "John Bhaskar", revenue: "₹10,000.00" },
  { customer: "Fathima Fasna", salesPerson: "John Bhaskar", revenue: "₹10,000.00" },
];

const tableHeaders = [
  "Customer",
  "Sales Person",
  "Revenue"
];

function TopSalesOrder({ }: Props) {
  return (
    <div className="bg-white w-full rounded-lg py-4 px-6">
      <p className="text-[#303F58] font-bold text-base">Top Sales Order</p>
      <div className="mt-5">
      <table className="min-w-full text-start bg-white my-5">
          <thead className="text-[12px] text-dropdownTex">
            <tr style={{ backgroundColor: "#F9F7F0" }}>
              {tableHeaders.map((heading, index) => (
                <th
                  className={`py-2 px-4 font-medium border-b border-tableBorder text-start`}
                  key={index}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {salesData.map((item, index) => (
              <tr key={index} className="border-b border-[#EAECF0] text-[#4B5C79]">
                <td className="py-3 px-4  text-xs">{item.customer}</td>
                <td className="py-3 px-4  text-xs">{item.salesPerson}</td>
                <td className="py-3 px-4 font-bold text-xs">{item.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopSalesOrder;
