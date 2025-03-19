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
import useApi from "../../../Hooks/useApi";
import { useEffect, useState } from "react";
import { endponits } from "../../../Services/apiEndpoints";
import NoData from "../../../Components/charts/Nodata";

type Props = {
  date?: any;
};

function PurchaseOverTime({ date }: Props) {
  const { request: getPurchaseOverTime } = useApi("get", 5005);
  const [overTime, setOverTime] = useState<any>([]);

  const processData = (data: any[]) => {
    const groupedData = [];
    for (let i = 0; i < 25; i += 5) {
      const range = `${i}-${i + 5}`;
      const total = data
        .slice(i, i + 5)
        .reduce((sum: number, entry: any) => sum + entry.totalPurchase, 0);
      groupedData.push({ name: range, value: total });
    }
  
    // Ensure the last group is exactly "25-31"
    const totalLastRange = data
      .slice(25, 31)
      .reduce((sum: number, entry: any) => sum + entry.totalPurchase, 0);
    groupedData.push({ name: "25-31", value: totalLastRange });
  
    return groupedData;
  };
  

  const getOverTime = async () => {
    try {
      const { response, error } = await getPurchaseOverTime(
        `${endponits.PURCHASE_DASH_PURCHASE_OVER_TIME}?date=${date}`
      );
      if (response && !error) {
        setOverTime(processData(response.data.dailyPurchase));
      } else {
        console.log("Error:", error);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    if (date) {
      getOverTime();
    }
  }, [date]);

  const renderCustomTooltip = ({ payload }: any) => {
    if (payload && payload.length) {
      return (
        <Tooltips
          content={`${payload[0].value}`}
          textColor="#ffffff"
          bgColor="#4A5568"
          arrowColor="#4A5568"
          width="50px"
        />
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg w-full py-8 overflow-x-auto">
      <h3 className="ms-10 mb-6 text-[16px] font-bold">Purchase Over Time</h3>
      {overTime?.some((item:any) => item.value> 0) ?
      <ResponsiveContainer width="100%" height={340}>
        <LineChart width={300} data={overTime}>
          <XAxis
            dataKey="name"
            stroke="#4A5568"
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
          <CartesianGrid vertical={false} stroke="#E2E8F0" />
          <RechartsTooltip content={renderCustomTooltip} cursor={false} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4A5568"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer> : <NoData parentHeight="400px"/>
      }
    </div>
  );
}

export default PurchaseOverTime;
