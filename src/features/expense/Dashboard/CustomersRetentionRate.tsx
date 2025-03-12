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

  retentionData.forEach(({ date, totalExpense }:any) => {
    const day = parseInt(date.split("-")[2]); // Extract day from "YYYY-MM-DD"
    if (day >= 1 && day <= 5) groupedData["0-5"].push(totalExpense);
    else if (day >= 6 && day <= 10) groupedData["5-10"].push(totalExpense);
    else if (day >= 11 && day <= 15) groupedData["10-15"].push(totalExpense);
    else if (day >= 16 && day <= 20) groupedData["15-20"].push(totalExpense);
    else if (day >= 21 && day <= 25) groupedData["20-25"].push(totalExpense);
    else groupedData["25-31"].push(totalExpense);
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
        bgColor="#4A5568"
        arrowColor="#4A5568"
        width="50px"
      />
    );
  }
  return null;
};

const CustomersRetentionRate: React.FC<CustomersRetentionRateProps> = ({ date }) => {
  const { request: getRentation } = useApi("get", 5008);
  const [cusRentation, setCusRentation] = useState<any>([]);

  const getCusRentation = async () => {
    try {
      const { response, error } = await getRentation(
        `${endponits.EXPENSE_DASH_EXPENSE_OVER_TIME}?date=${date}`
      );
      if (response && !error) {
        console.log("API Response:", response?.data);
        
        // Transform API response
        const formattedData = transformRetentionData(response?.data?.dailyExpense);
        setCusRentation(formattedData);
      } else {
        console.log("Error:", error);
      }
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  useEffect(() => {
    if (date) {
      getCusRentation();
    }
  }, [date]);

  console.log("rentation", cusRentation);
  
  return (
    <div className="bg-white rounded-lg w-full py-8">
      <h3 className="ms-10 mb-6 text-[16px] font-bold">Total Expense Over Time</h3>
      {cusRentation?.some((item:any) => item.value> 0) ? <>
      
      <ResponsiveContainer width="100%" height={340}>
        <LineChart width={300} data={cusRentation}>
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
      </ResponsiveContainer>
      </>:
      <NoData/>
      }
    </div>
  );
};

export default CustomersRetentionRate;
