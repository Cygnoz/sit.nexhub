import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Tooltips from "../../Components/tooltip/Tooltip";
import { useEffect, useState } from "react";
import NoData from "../../Components/charts/Nodata";

type Props = {
  topCustomerData: any;
};

const colors = ["#D9B4AF"];

const renderCustomTooltip = ({ payload }: any) => {
  if (payload && payload.length) {
    return (
      <Tooltips
        content={`₹${payload[0].value}`}
        textColor="#ffffff"
        bgColor="#000000"
        arrowColor="#000000"
        width="60px"
      />
    );
  }
  return null;
};

const CustomBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  return (
    <g>
      <rect
        x={x + 5} // Adjust for thinner bars
        y={y}
        width={width - 20} // Make bars thinner
        height={height}
        rx="3"
        fill={fill}
        opacity={0.3} // Transparent bars
      />
      <circle cx={x + width / 3} cy={y} r="5" fill="#6B0000" /> {/* Solid dot on top */}
    </g>
  );
};

const TopCustomers = ({ topCustomerData }: Props) => {
  const [filteredData, setFilteredData] = useState<any>([]);

  useEffect(() => {
    if (topCustomerData && Array.isArray(topCustomerData)) {
      const formattedData = topCustomerData.map((cus: any) => ({
        name: cus.customerName,
        value: cus.totalSpent,
      }));
      setFilteredData(formattedData);
    }
  }, [topCustomerData]);

  return (
    <div className="bg-white rounded-lg w-full py-8  overflow-x-auto">
      <h3 className="ms-10 text-base text-[#454545] font-semibold">Top Customers</h3>

      {topCustomerData?.length>0?<>
      <h4 className="ms-10 py-4 text-[12px] text-[#4A5568]">Total revenue</h4>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="name" stroke="#4A5568" fontSize={12} axisLine={false} tickLine={false} />
          <YAxis stroke="#4A5568" axisLine={false} tickLine={false} fontSize={12} />
          <Tooltip content={renderCustomTooltip} cursor={{ fill: "transparent" }} />
          <Bar shape={<CustomBar />} barSize={30} dataKey="value">
            {filteredData.map((_entry:any, index:any) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center">
        <h3 className="text-center text-[12px] text-[#4A5568] pt-3">Customers</h3>
      </div>
      </>:
      <NoData parentHeight="350px"/>
      }
    </div>
  );
};

export default TopCustomers;