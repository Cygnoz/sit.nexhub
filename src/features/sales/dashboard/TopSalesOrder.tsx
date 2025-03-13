import { useEffect, useState } from "react";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import NoData from "../../../Components/charts/Nodata";

type Props = {
  date:any
};


const tableHeaders = [
  "Customer",
  "Items",
  "Revenue"
];

function TopSalesOrder({date }: Props) {
  const { request: getTopSalesOrder } = useApi("get", 5007);
  const [topSalesOrder, setTopSalesOrder] = useState<any>([]);

  const getTop= async () => {
    try {
      const { response, error } = await getTopSalesOrder(
        `${endponits.SALES_DASH_TOP_SALES_ORDER}?date=${date}`
      );
      if (response && !error) {
        console.log("API Response:", response?.data);
        
        // Transform API response
        setTopSalesOrder(response?.data?.topOrders);
      } else {
        console.log("Error:", error);
      }
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  useEffect(() => {
    if (date) {
      getTop();
    }
  }, [date]);
  return (
    <div className="bg-white w-full rounded-lg py-4 px-6">
      <p className="text-[#303F58] font-bold text-base">Top Sales Order</p>
     {topSalesOrder?.length>0? <div className="mt-5">
      <div className="w-full max-h-[400px] overflow-auto border border-tableBorder rounded-md">
                       <table className="w-full border-collapse relative">
                           <thead className="sticky top-0 bg-[#F9F7F0] z-10 text-sm">
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
            {topSalesOrder?.map((item:any, index:any) => (
              <tr key={index} className="border-b border-[#EAECF0] text-[#4B5C79]">
                <td className="py-3 px-4  text-xs">{item.customerName}</td>
                <td className="py-3 px-4  text-xs">{item.itemName}</td>
                <td className="py-3 px-4 font-bold text-xs">{item.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>:
      <NoData parentHeight="400px"/>
      }
    </div>
  );
}

export default TopSalesOrder;
