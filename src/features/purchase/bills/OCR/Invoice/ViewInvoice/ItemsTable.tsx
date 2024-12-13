
type Item = {
  id: number;
  product: string;
  hsnSac: string;
  qty: number;
  rate: number;
  gross: number;
  discount: number;
  netAmount: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
  batchNo: string;
};

type Props = {
  items?: Item[];
};

function ItemsTable({ items }: Props) {
    const tableHead = [
      "Sl.no",
      "Product",
      "Hsn/Sac",
      "Qty",
      "Rate",
      "Gross",
      "Discount",
      "Net Amount",
      "Tax %",
      "Tax Amount",
      "Total",
      "Batch No",
    ];
    return (
      <div className=" overflow-x-auto hide-scrollbar h-[300px]">
        
        <table className="min-w-full border-collapse text-xs text-textColor h-[100px] ">
          <thead>
            <tr>
              {tableHead?.map((item, index) => (
                <th
                  key={index}
                  className="border font-semibold text-xs min-w-min border-[#F4F4F4] py-2 px-5 text-textColor bg-[#f5f9fc] whitespace-nowrap"
                >
                  <span>{item}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items?.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50 text-center ">
                <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">{index + 1}</td>
                <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">{item.product}</td>
                <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">{item.rate.toFixed(2)}</td>
                <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">{item.gross.toFixed(2)}</td>
                <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">{item.discount.toFixed(2)}</td>
                <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">{item.netAmount.toFixed(2)}</td>
                <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">{item.hsnSac}</td>
                <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">{item.qty}</td>
                <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">{item.taxPercent}%</td>
                <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">{item.taxAmount.toFixed(2)}</td>
                <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">{item.total.toFixed(2)}</td>
                <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">{item.batchNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default ItemsTable;
  