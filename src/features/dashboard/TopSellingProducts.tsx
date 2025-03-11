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
import Tooltips from "../../Components/tooltip/Tooltip";
// import BackgroundImage from "../../../assets/Images/Active clients.png";
import NoData from "../../Components/charts/Nodata";
import { useEffect, useState } from "react";
interface TopCustomersProps { 
  topSellingData:any
}

const colors = ["#f2c6b8", "#a72522", "#fbe6c3", "#eef1d6", "#e3e7e5"];



const renderCustomTooltip = ({ payload }: any) => {
  if (payload && payload.length) {
    return (
      <Tooltips
        content={`$${payload[0].value}`}
        textColor="#ffffff"
        bgColor="#000000"
        arrowColor="#000000"
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

const TopSellingProducts: React.FC<TopCustomersProps> = ({topSellingData }) => {
  
  const [filteredData,setFilteredData]=useState<any>([])
  useEffect(() => {
    const formattedData = topSellingData?.map((product: any) => ({
      name: product.itemName,
      value:product.totalSold,
      // img:BackgroundImage
    }));
    setFilteredData(formattedData)
  }, [topSellingData]);
  return (
    <div className="bg-white rounded-lg w-full py-8">
      <h3 className="ms-10 text-[16px] font-bold">
        Top Selling Products
      </h3>
      {filteredData?.length>0?<>
      
      <h4 className="ms-10 py-4 text-[10px] text-[#4A5568]">Sales Volume</h4>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={filteredData}>
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
            {filteredData?.map((_:any, index:any) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center">
        <h3 className="text-center text-[10px] text-[#4A5568] pt-3">Products</h3>
      </div>
      </>:
      <NoData parentHeight="350px"/>
      }
    </div>
  );
};


export default TopSellingProducts;
