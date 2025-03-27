import { useEffect, useState } from 'react';
import NoData from '../../../Components/charts/Nodata';
import NoProductImg from '../../../Components/noImage/NoProductImg';
import useApi from '../../../Hooks/useApi';
import { endponits } from '../../../Services/apiEndpoints';
type Props = {
  date:string
};


const TopSellingProduct = ({date}:Props) => {
  const { request: getTopSelling } = useApi("get", 7003);
  const [topSellingProducts, setTopSellingProduct] = useState<any>([]);
 
  const getTopProduct = async () => {
    try {
      const { response, error } = await getTopSelling(
        `${endponits.INVENTORY_DASH_TOP_SELLING_PRODUCTS}?date=${date}`
      );
      if (response && !error) {
        console.log("top", response.data);
       
        // Transform API response into required format
        setTopSellingProduct(response?.data?.topProducts);
      } else {
        console.log("err", error);
      }
    } catch (error) {
      console.log("er", error);
    }
  };
 
  useEffect(() => {
    if (date) {
      getTopProduct();
    }
  }, [date]);



  const tableHeaders = [
    "Prodcut Name",
    "Image",
    "Sales Volume",
    "Units Sold",
    "Status"
  ];

  return (
    <div className="bg-white rounded-lg w-full px-8 py-6">
      <div className="flex justify-between items-center">
        <h3 className="text-[16px] font-bold">Top Selling Products</h3>
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
      {topSellingProducts?.length>0?
        <div className="w-full max-h-[400px] overflow-auto border border-tableBorder rounded-md">
        <table className="w-full border-collapse relative">
            <thead className="sticky top-0 bg-[#F9F7F0] z-10 text-sm">
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
            {topSellingProducts?.map((product:any, index:any) => (
              <tr key={index} className="border-b border-tableBorder">
                <td className="px-4 py-2 text-xs text-dropdownText">{product.itemName}</td>
                <td className="px-4 py-2">
                  {product?.itemImage?
                  <img src={product.itemImage} alt={product.itemImage} className="w-12 h-12 object-cover rounded" />:
                  <NoProductImg size={25}/>  
                  }
                </td>
                <td className="px-4 py-2 text-xs text-gray-700">{product.totalAmount}</td>
                <td className="px-4 py-2 text-xs text-gray-700">{product.totalSold}</td>
                <td className="px-4 py-2 text-xs">
                    {product.currentStock }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        :
        <NoData parentHeight="350px"/>
        }
      </div>
      
    </div>
  );
};

export default TopSellingProduct;
