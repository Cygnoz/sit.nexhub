import { Cell, Pie, PieChart, Tooltip } from "recharts";

const invoiceData = [
  { name: "Paid", value: 40, color: "#F7E7CD" },
  { name: "Draft", value: 16, color: "#EDDADA" },
  { name: "Over Due", value: 12, color: "#2C353B" },
  { name: "Send", value: 12, color: "#D1D5DB" },
  { name: "Partially Paid", value: 10, color: "#E5E7EB" },
  { name: "Canceled", value: 10, color: "#A8B5A1" },
];

// Custom Label Styling
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7; // Increased label position for better visibility
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#303F58" // Darker text color for better readability
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="14px" // Larger font size
      fontWeight="bold" // Make it bold
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Custom Tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded-lg px-3 py-2 text-xs">
        <p className="text-[#303F58] font-semibold">{payload[0].name}</p>
        <p className="text-gray-600">{`${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

function InvoiceStatusChart() {
  return (
    <div className="bg-white rounded-lg w-full p-8">
      <p className="text-[#303F58] font-semibold text-base">Invoice Status</p>

      <div className="flex items-center justify-center mt-5">
    

        {/* Bigger Pie Chart */}
        <PieChart width={280} height={250}>
          <Pie
            data={invoiceData}
            dataKey="value"
            label={renderCustomizedLabel}
            labelLine={false}
            innerRadius={50} // Increased inner radius
            outerRadius={110} // Increased outer radius (bigger pie)
            paddingAngle={5}
            cornerRadius={10}
          >
            {invoiceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </div>
    </div>
  );
}

export default InvoiceStatusChart;
