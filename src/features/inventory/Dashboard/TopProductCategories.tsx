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

const TopProductCategories: React.FC<TopCustomersProps> = ({ date }) => {
  const { request: getTopCustomers } = useApi("get", 5002);
  const [topCustomerData, setTopCustomerData] = useState<any>([]);

  const getTopCus = async () => {
    try {
      const { response, error } = await getTopCustomers(
        `${endponits}?date=${date}`
      );
      if (response && !error) {
        console.log("top", response.data);
        
        // Transform API response into required format
        const formattedData = response?.data?.topCustomers?.map((customer: any) => ({
          name: customer.customerName,
          value: customer.totalSpent,
          // img:BackgroundImage
        }));

        setTopCustomerData(formattedData);
      } else {
        console.log("err", error);
      }
    } catch (error) {
      console.log("er", error);
    }
  };

  useEffect(() => {
    if (date) {
      getTopCus();
    }
  }, [date]);

  return (
    <div className="bg-white rounded-lg w-full py-8">
      <h3 className="ms-10 text-[16px] font-bold">
        Top Customers by Sales Volume
      </h3>
      {topCustomerData.length>0?<>
      
      <h4 className="ms-10 py-4 text-[10px] text-[#4A5568]">Sales Volume</h4>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={topCustomerData}>
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
            {topCustomerData.map((_:any, index:any) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center">
        <h3 className="text-center text-[10px] text-[#4A5568] pt-3">Customers</h3>
      </div>
      </>:
      <NoData parentHeight="350px"/>
      }
    </div>
  );
};


export default TopProductCategories;
