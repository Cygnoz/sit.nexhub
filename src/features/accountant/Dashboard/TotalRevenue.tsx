import React, { useEffect, useState } from "react";
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
import { endponits } from "../../../Services/apiEndpoints";
import NoData from "../../../Components/charts/Nodata";

interface CustomersRetentionRateProps {
  date: string; // Assuming date is passed as a string (e.g., "2024-03-11")
}

const transformRetentionData = (retentionData: { date: string; retentionRate: number }[]) => {
  const groupedData: { [key: string]: number[] } = {
    "0-5": [],
    "5-10": [],
    "10-15": [],
    "15-20": [],
    "20-25": [],
    "25-31": [],
  };

  retentionData.forEach(({ date, revenue }:any) => {
    const day = parseInt(date.split("-")[2]); // Extract day from "YYYY-MM-DD"
    if (day >= 1 && day <= 5) groupedData["0-5"].push(revenue);
    else if (day >= 6 && day <= 10) groupedData["5-10"].push(revenue);
    else if (day >= 11 && day <= 15) groupedData["10-15"].push(revenue);
    else if (day >= 16 && day <= 20) groupedData["15-20"].push(revenue);
    else if (day >= 21 && day <= 25) groupedData["20-25"].push(revenue);
    else groupedData["25-31"].push(revenue);
  });

  return Object.entries(groupedData).map(([range, values]) => ({
    name: range,
    value: values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0,
  }));
};

const renderCustomTooltip = ({ payload }: any) => {
  if (payload && payload.length) {
    return (
      <Tooltips
        content={`${payload[0].value}`}
        textColor="#ffffff"
        bgColor="#0099F8"
        arrowColor="#0099F8"
        width="50px"
      />
    );
  }
  return null;
};

const TotalRevenue: React.FC<CustomersRetentionRateProps> = ({ date }) => {
  const { request: getRevenue } = useApi("get", 7001);
  const [totalRevenue, setTotalRevenue] = useState<any>([]);

  const getTotalRevenue = async () => {
    try {
      const { response, error } = await getRevenue(
        `${endponits.ACCOUNT_DASH_TOTAL_REVENUE_OVER_TIME}?date=${date}`
      );
      if (response && !error) {
        console.log("API Response:", response?.data);
        
        // Transform API response
        const formattedData = transformRetentionData(response?.data?.dailyRevenue);
        setTotalRevenue(formattedData);
      } else {
        console.log("Error:", error);
      }
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  useEffect(() => {
    if (date) {
      getTotalRevenue();
    }
  }, [date]);


  
  return (
    <div className="bg-white rounded-lg w-full py-8">
      <h3 className="ms-10 mb-6 text-[16px] font-bold">Total Revenue</h3>
      {totalRevenue?.some((item:any) => item.value> 0) ? <>
      
      <ResponsiveContainer width="100%" height={340}>
        <LineChart width={300} data={totalRevenue}>
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
            stroke="#0099F8"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      </>:
      <NoData/>
      }
    </div>
  );
};

export default TotalRevenue;
