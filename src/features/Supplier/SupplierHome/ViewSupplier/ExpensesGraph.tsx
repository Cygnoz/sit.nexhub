import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import Tooltips from "../../../../Components/tooltip/Tooltip";

const data = [
  { name: "Jan", value: 45000 },
  { name: "Feb", value: 38000 },
  { name: "Mar", value: 55000 },
  { name: "Apr", value: 50000 },
  { name: "May", value: 70000 },
  { name: "Jun", value: 80000 }
];

const renderCustomTooltip = ({ payload }: any) => {
  if (payload && payload.length) {
    return (
      <Tooltips
        content={`${(payload[0].value / 1000).toFixed(0)}k`}
        textColor="#ffffff"
        bgColor="#0099F8"
        arrowColor="#0099F8"
        width="50px"
      />
    );
  }
  return null;
};

const ExpensesGraph: React.FC = () => {
  return (
    <div className="bg-white rounded-lg w-full py-8 shadow-lg pe-3">
      <div className="flex justify-between">
        <h3 className="ms-10 mb-6 text-[16px] font-bold">Expenses</h3>
        <select
          className="border border-[#565148] h-8 pl-3 pr-4 rounded-md bg-[#FEFDFA] text-xs font-semibold text-gray-800"
          style={{ color: "#585953" }}
        >
          <option>Last Six Months</option>
          <option>Other</option>
          <option>Other</option>
          <option>Other</option>
        </select>
      </div>
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
            tickFormatter={(value) => `${value / 1000}k`}
            domain={[10000, 90000]}
            ticks={[10000, 30000, 50000, 70000, 90000]}
          />
          <CartesianGrid vertical={false} stroke="#E2E8F0" />{" "}
          {/* Display only Y-axis grid lines */}
          <RechartsTooltip content={renderCustomTooltip} cursor={false} />{" "}
          {/* Disable cursor line */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0099F8"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensesGraph;
