import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
  } from "recharts";
  import Tooltips from "../../../Components/tooltip/Tooltip";
type Props = {}

const data = [
    { name: "Jan 1", value: 40 },
    { name: "Jan 2", value: 20 },
    { name: "Jan 3", value: 45 },
    { name: "Jan 4", value: 35 },
    { name: "Jan 5", value: 50 },
    { name: "Jan 6", value: 65 },
    { name: "Jan 7", value: 60 },
    { name: "Jan 8", value: 78 },
    { name: "Jan 9", value: 72 },
    { name: "Jan 10", value: 68 },
    { name: "Jan 11", value: 80 },
    { name: "Jan 12", value: 85 },
  ];
  
  const renderCustomTooltip = ({ payload }: any) => {
    if (payload && payload.length) {
      return (
        <Tooltips
          content={`${payload[0].value}%`}
          textColor="#ffffff"
          bgColor="#4A5568"
          arrowColor="#4A5568"
          width="50px"
        />
      );
    }
    return null;
  };

function PurchaseOverTime({}: Props) {
  return (
     <div className="bg-white  rounded-lg w-full py-8">
         <h3 className="ms-10 mb-6 text-[16px] font-bold">
         Purchase Over Time 
         </h3>
         <ResponsiveContainer width="100%" height={340}>
           <LineChart width={300} data={data}>
             <XAxis
               dataKey="name"
               stroke="#4A5568" // Set X-axis stroke color to match grid line color
               fontSize={10}
               axisLine={false}
               tickLine={false}
               padding={{ left: 30, right: 30 }}
             />
             <YAxis
               stroke="#4A5568"
               fontSize={10}
               axisLine={false}
               tickLine={false}
               tick={{ fontSize: 12 }}
               interval={0}
             />
             <CartesianGrid vertical={false} stroke="#E2E8F0" />{" "}
             {/* Display only Y-axis grid lines */}
             <RechartsTooltip content={renderCustomTooltip} cursor={false} />{" "}
             {/* Disable cursor line */}
             <Line
               type="monotone"
               dataKey="value"
               stroke="#4A5568"
               strokeWidth={2}
               dot={{ r: 4 }}
             />
           </LineChart>
         </ResponsiveContainer>
       </div>
  )
}

export default PurchaseOverTime