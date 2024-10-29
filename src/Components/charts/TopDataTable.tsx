import ChartTableSkeleton from '../skeleton/ChartTableSkeleton';

type Props = {
  topSellingProducts: {
    itemId: string;
    itemName: string;
    itemImage: string; 
    saleVolume: number;
    status: string;
    unitSold: number;
  }[];
};

function TopDataTable({ topSellingProducts }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg w-[100%]">
      <h3 className="text-base text-textColor font-semibold mb-5">
        Top Selling Products
      </h3>
      {topSellingProducts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left">
            <thead className="border-b border-tableBorder bg-[#FDF8F0] p-4">
              <tr className="bg-gray-50">
                <th className="px-4 py-4 text-xs font-semibold text-[#495160]">
                  Product name
                </th>
                <th className="px-4 py-4 text-xs font-semibold text-[#495160]">
                  Image
                </th>
                <th className="px-4 py-4 text-xs font-semibold text-[#495160]">
                  Sales Volume
                </th>
                <th className="px-4 py-4 text-xs font-semibold text-[#495160]">
                  Units Sold
                </th>
                <th className="px-4 py-4 text-xs font-semibold text-[#495160]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {topSellingProducts.map((product) => (
                <tr key={product.itemId} className="border-b border-tableBorder">
                  <td className="px-4 py-2 text-xs text-dropdownText">
                    {product.itemName }
                  </td>
                  <td className="px-4 py-2">
                    <img
                      src={`data:image/png;base64,${product.itemImage}`}
                      alt={product.itemId}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-700">
                    ${product.saleVolume.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-700">
                    {product.unitSold} Units
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1.5 text-xs font-semibold rounded-[4px] ${
                        product.status === "In Stock"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ChartTableSkeleton />
      )}
    </div>
  );
}

export default TopDataTable;
