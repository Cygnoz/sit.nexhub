import React from 'react';

const products = [
  {
    name: "Supplier 1 ",
    texpense:"20,0000",
    ntrans: "50,000",
    avgexp: "1000",

  },
  {
    name: "Supplier 2 ",
    texpense:"10,000",
    ntrans: "30,000",
    avgexp: "1000",
  
  },
  {
    name: "Supplier 3 ",
    texpense:"15000",
    ntrans: "20,000",
    avgexp: "1000",
  },
  {
    name: "Supplier 4",
    texpense:"23,000",
    ntrans: "10,000",
    avgexp: "1000",
  },
];

const ProductsDashTable: React.FC = () => {
  return (
    <div className="bg-white rounded-lg w-full px-8 py-6">
      <div className="flex justify-between items-center">
        <h3 className="text-[16px] font-bold">Total Purchase by Supplier</h3>
        
      </div>
      <div className="overflow-x-auto pt-3">
        <table className="min-w-full table-auto text-left">
          <thead className="border-b border-tableBorder bg-[#E1F0F9] p-4">
            <tr className="bg-gray-50">
              <th className="px-4 py-4 text-xs font-semibold text-[#495160]">Supplier</th>
              <th className="px-4 py-4 text-xs font-semibold text-[#495160]">Total Expense</th>
              <th className="px-4 py-4 text-xs font-semibold text-[#495160]">Number of Transation</th>
              <th className="px-4 py-4 text-xs font-semibold text-[#495160]">Average Expense per Transaction</th>
          
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="border-b border-tableBorder">
                <td className="px-4 py-4 text-xs text-dropdownText">{product.name}</td>
                <td className="px-4 py-4 text-xs text-dropdownText">{product.texpense}</td>
                  {/* <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" /> */}
             
                <td className="px-4 py-4 text-xs text-gray-700">{product.ntrans}</td>
                <td className="px-4 py-4 text-xs text-gray-700">{product.avgexp}</td>
              
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsDashTable;
