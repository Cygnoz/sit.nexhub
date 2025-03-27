import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  // LabelList,
  Cell,
  ResponsiveContainer,
} from "recharts";
import Tooltips from "../../../Components/tooltip/Tooltip";
// import BackgroundImage from "../../../assets/Images/Active clients.png";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import { useEffect, useState } from "react";
import NoData from "../../../Components/charts/Nodata";
interface TopCustomersProps {
  date: string; // Assuming date is passed as a string (e.g., "2024-03-11")
}

const colors = ["#75CAFF", "#0099F8", "#B9F0DB", "#65AEDB", "#EEEEEE"];



const renderCustomTooltip = ({ payload }: any) => {
  if (payload && payload.length) {
    return (
      <Tooltips
        content={`$${payload[0].value}`}
        textColor="#ffffff"
        bgColor="#0099F8"
        arrowColor="#0099F8"
        width="60px"
      />
    );
  }
  return null;
};

// const renderCustomizedLabel = (props: any) => {
//   const { x, y, width, value } = props;
//   const radius = 15;
//   const spacing = -15;
//   const imageUrl = value; // `value` will hold the `img` URL

//   return (
//     <g transform={`translate(${x + width / 2}, ${y + spacing})`}>
//       <circle cx={0} cy={-radius} r={radius} fill="none" strokeWidth={0} />
//       {imageUrl && (
//         <image
//           href={imageUrl} // Dynamic image URL from API
//           x={-radius}
//           y={-radius * 2}
//           width={radius * 2}
//           height={radius * 2}
//         />
//       )}
//     </g>
//   );
// };


const CustomBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  const radius = 10;

  return (
    <g>
      <path
        d={`M${x},${y + radius} 
           L${x},${y + height} 
           L${x + width},${y + height} 
           L${x + width},${y + radius} 
           Q${x + width},${y} ${x + width - radius},${y} 
           L${x + radius},${y} 
           Q${x},${y} ${x},${y + radius}`}
        fill={fill}
      />
    </g>
  );
};

const TopProductCategories: React.FC<TopCustomersProps> = ({ date }) => {
  const { request: getTopProductByCategory } = useApi("get", 5003);
  const [topProduct, setTopProduct] = useState<any>([]);

  const getTopProduct = async () => {
    try {
      const { response, error } = await getTopProductByCategory(
        `${endponits.INVENTORY_DASH_TOP_SELLING_PRODUCTS_BY_CATEGORIES}?date=${date}`
      );
      if (response && !error) {
        console.log("top", response.data);
        
        // Transform API response into required format
        const formattedData = response?.data?.topSellingProductsByCategories?.map((cat: any) => ({
          name: cat.category,
          value: cat.totalAmount,
          // img:BackgroundImage
        }));

        setTopProduct(formattedData);
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

  return (
    <div className="bg-white rounded-lg w-full py-8">
      <h3 className="ms-10 text-[16px] font-bold">
        Top Products By Category
      </h3>
      {topProduct.length>0?<>
      
      <h4 className="ms-10 py-4 text-[10px] text-[#4A5568]">Sales Volume</h4>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={topProduct}>
          <XAxis
            stroke="#4A5568"
            fontSize={10}
            axisLine={false}
            tickLine={false}
            dataKey="name"
          />
          <YAxis stroke="#4A5568" axisLine={false} tickLine={false} fontSize={10} />
          <Tooltip content={renderCustomTooltip} cursor={{ fill: "transparent" }} />
          <Bar shape={<CustomBar />} barSize={40} dataKey="value" fill="#8884d8">
            {/* <LabelList dataKey="img" content={renderCustomizedLabel} /> */}
            {topProduct.map((_:any, index:any) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center">
        <h3 className="text-center text-[10px] text-[#4A5568] pt-3">Categories</h3>
      </div>
      </>:
      <NoData parentHeight="350px"/>
      }
    </div>
  );
};


export default TopProductCategories;
