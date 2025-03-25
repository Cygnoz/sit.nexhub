import { PieChart, Pie, Cell } from "recharts";
import { endponits } from "../../../Services/apiEndpoints";
import { useEffect, useState } from "react";
import useApi from "../../../Hooks/useApi";
import NoData from "../../../Components/charts/Nodata";

interface AvaragePurchaseProps {
  date: string; // Assuming date is passed as a string (e.g., "2024-03-11")
}

const cx = 200; // Center x-coordinate for a 400px wide chart
const cy = 280;
const iR = 80; // Increased inner radius
const oR = 160; // Increased outer radius
const maxValue = 100000; // Define a maximum range for visualization

const AvaragePurchase: React.FC<AvaragePurchaseProps> = ({ date }) => {
  const { request: getAvgPurchase } = useApi("get", 5002);
  const [averagePurchase, setAveragePurchase] = useState<number>(0);

  const getAvg = async () => {
    try {
      const { response, error } = await getAvgPurchase(
        `${endponits.CUST_DASH_AVG_ORDER_VALUE}?date=${date}`
      );
      if (response && !error) {
        console.log("API Response:", response.data);
        setAveragePurchase(response?.data?.averageOrderValue || 0);
      } else {
        console.log("API Error:", error);
      }
    } catch (error) {
      console.log("Request Error:", error);
    }
  };

  useEffect(() => {
    if (date) {
      getAvg();
    }
  }, [date]);

  // Ensure the value doesn't exceed max range
  const adjustedValue = Math.min(averagePurchase, maxValue);
  const remainingValue = maxValue - adjustedValue;

  // Dynamically updated pie chart data
  const data = [
    { name: "Value", value: adjustedValue, color: "#2C353B" },
    { name: "Remaining", value: remainingValue, color: "#E6E9EE" },
  ];

  return (
    <div className="bg-white rounded-lg w-full px-8  overflow-x-auto">
              <h3 className="text-[16px] font-bold mt-5">Average Order  Value</h3>
      {averagePurchase>0?<>
    
      <PieChart width={400} height={400}>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={data}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          fill="#8884d8"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {/* Display Average Purchase Value */}
        <text
          x={200}
          y={250}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="35"
          fill="#303F58"
          fontWeight="bold"
        >
          ${adjustedValue}
        </text>
        {/* $0 on the left side */}
        <text
          x={80}
          y={300}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="16"
          fontWeight="bold"
          fill="#303F58"
        >
          $0
        </text>
        {/* Max value label */}
        <text
          x={330}
          y={300}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="16"
          fontWeight="bold"
          fill="#303F58"
        >
          ${maxValue}
        </text>
      </PieChart>
      </>:
      <NoData parentHeight="400px"/>
      }
    </div>
  );
};

export default AvaragePurchase;
