import { useEffect, useState } from 'react';
import NoData from '../../../Components/charts/Nodata';
import NoProductImg from '../../../Components/noImage/NoProductImg';
import useApi from '../../../Hooks/useApi';
import { endponits } from '../../../Services/apiEndpoints';
type Props = {
  date:string
};


const TotalProduct = ({date}:Props) => {
  const { request: getTopSupplier } = useApi("get", 5009);
  const [topSupplierData, setTopSupplierData] = useState<any>([]);
 
  const getTopSup = async () => {
    try {
      const { response, error } = await getTopSupplier(
        `${endponits.SUPPLIER_DASH_TOP_PRODUCTS_BY_SUPPLIER}?date=${date}`
      );
      if (response && !error) {
        console.log("top", response.data);
       
        // Transform API response into required format
        setTopSupplierData(response?.data?.topProductsBySupplier);
      } else {
        console.log("err", error);
      }
    } catch (error) {
      console.log("er", error);
    }
  };
 
  useEffect(() => {
    if (date) {
      getTopSup();
    }
  }, [date]);



  const tableHeaders = [
    "Supplier Name",
    "Image",
    "Product Name",
    "Quantity Sold",
    "Total Revenue"
  ];

  return (
    <div className="bg-white rounded-lg w-full px-8 py-6">
      <div className="flex justify-between items-center">
        <h3 className="text-[16px] font-bold">Total Products by Supplier</h3>
        {/* <select
          className="border border-[#565148] h-8 pl-3 pr-4 rounded-md bg-[#FEFDFA] text-xs font-semibold text-gray-800"
          style={{ color: "#585953" }}
        >
          <option>Select Supplier</option>
          <option>Other</option>
          <option>Other</option>
          <option>Other</option>
        </select> */}
      </div>
      <div className="overflow-x-auto pt-3">
      {topSupplierData?.length>0?
        <table className="min-w-full table-auto text-left">
          <thead className="border-b text-xs border-tableBorder bg-[#FDF8F0] p-4">
          <tr style={{ backgroundColor: "#F9F7F0" }}>
              {tableHeaders.map((heading, index) => (
                <th
                  className={`py-4 px-4 font-medium border-b border-tableBorder text-start`}
                  key={index}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topSupplierData?.map((product:any, index:any) => (
              <tr key={index} className="border-b border-tableBorder">
                <td className="px-4 py-2 text-xs text-dropdownText">{product.supplierName}</td>
                <td className="px-4 py-2">
                  {product?.itemImage?
                  <img src={product.itemImage} alt={product.itemImage} className="w-12 h-12 object-cover rounded" />:
                  <NoProductImg size={25}/>  
                  }
                </td>
                <td className="px-4 py-2 text-xs text-gray-700">{product.itemName}</td>
                <td className="px-4 py-2 text-xs text-gray-700">{product.totalSold}</td>
                <td className="px-4 py-2 text-xs">
                    {product.totalAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        :
        <NoData parentHeight="350px"/>
        }
      </div>
      
    </div>
  );
};

export default TotalProduct;
