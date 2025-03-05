import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Tooltips from "../../../Components/tooltip/Tooltip";

const data = [
  { date: "Sept 2", Supplier1: 30, Supplier2: 40, Supplier3: 35, Supplier4: 38 },
  { date: "Sept 7", Supplier1: 50, Supplier2: 55, Supplier3: 45, Supplier4: 42 },
  { date: "Sept 12", Supplier1: 20, Supplier2: 60, Supplier3: 38, Supplier4: 50 },
  { date: "Sept 17", Supplier1: 45, Supplier2: 65, Supplier3: 42, Supplier4: 55 },
  { date: "Sept 22", Supplier1: 35, Supplier2: 50, Supplier3: 40, Supplier4: 60 },
  { date: "Sept 27", Supplier1: 50, Supplier2: 55, Supplier3: 38, Supplier4: 48 },
];

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

const NumberOfOrdersBySupplier: React.FC = () => {
  return (
    <div className="bg-white rounded-lg w-full py-6">
      <h3 className="ms-10 mb-6 text-[16px] font-bold">
        Number of Orders by Supplier
      </h3>
      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            stroke="#A0AEC0"
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#A0AEC0"
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <CartesianGrid vertical={false} stroke="#E2E8F0" />
          <RechartsTooltip content={renderCustomTooltip} cursor={false} />
          <Legend
            iconType="circle"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ marginTop: 2, paddingTop: 30}}
          />


          {/* Lines for each supplier */}
          <Line type="monotone" dataKey="Supplier1" stroke="#D9B4AF" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Supplier2" stroke="#BDBDB5" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Supplier3" stroke="#4A5568" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Supplier4" stroke="#F4E0C0" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NumberOfOrdersBySupplier;
