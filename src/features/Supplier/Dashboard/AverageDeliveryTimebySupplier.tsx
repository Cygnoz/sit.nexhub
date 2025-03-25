import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
// import BackgroundImage from "../../../assets/Images/Active clients.png";
import NoData from "../../../Components/charts/Nodata";
import Tooltips from "../../../Components/tooltip/Tooltip";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";

const colors = ["#f2c6b8", "#a72522", "#fbe6c3", "#eef1d6", "#e3e7e5"];
interface AvgDeliProps {
  date?:any
}


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
//   const { x, y, width } = props;
//   const radius = 10;
//   const spacing = -10;
//   return (
//     <g transform={`translate(${x + width / 2}, ${y + spacing})`}>
//       <circle cx={0} cy={-radius} r={radius} fill="none" strokeWidth={0} />
//       <image
//         href={BackgroundImage}
//         x={-radius}
//         y={-radius * 2}
//         width={radius * 2}
//         height={radius * 2}
//       />
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

const AverageDeliveryTimebySupplier: React.FC<AvgDeliProps> = ({ date }) => {
  const { request: getAvgDelivery } = useApi("get", 5009);
  const [avgDelivery, setAvgDelivery] = useState<[]>([]);

  const getAvg = async () => {
    try {
      const { response, error } = await getAvgDelivery(
        `${endponits.SUPPLIER_DASH_AVG_DELIVERY_TIME}?date=${date}`
      );
      if (response && !error) {
        console.log("top", response.data);

        // Transform API response into required format
        const formattedData = response?.data?.averageDeliveryTime?.map((customer: any) => ({
          name: customer.supplierName,
          value: customer. avgDeliveryTime,
        })) || [];

        setAvgDelivery(formattedData);
      } else {
        console.log("err", error);
      }
    } catch (error) {
      console.log("er", error);
    }
  };

  useEffect(() => {
    if (date) {
      getAvg();
    }
  }, [date,]);

  return (
    <div className="bg-white rounded-lg w-full py-8 overflow-x-auto">
      <h3 className="ms-10 text-[16px] font-bold">Average Delivery Time by Supplier</h3>
      {avgDelivery.length>0?<>
      
      <h4 className="ms-10 py-4 text-[10px] text-[#4A5568]">No of days</h4>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={avgDelivery}>
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
            {avgDelivery.map((_:any, index:any) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center">
        <h3 className="text-center text-[10px] text-[#4A5568] pt-3">Suppliers</h3>
      </div>
      </>:
      <NoData parentHeight="350px"/>
      }
    </div>
  );
};

export default AverageDeliveryTimebySupplier;
