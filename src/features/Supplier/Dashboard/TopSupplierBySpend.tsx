import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "Supplier A with a very long name", value: 48.8, color: "#D9B4AF" }, // Light Red
  { name: "Supplier B", value: 24.3, color: "#F4E0C0" }, // Light Beige
  { name: "Supplier C", value: 14.6, color: "#BDBDB5" }, // Grey
  { name: "Supplier D with a big name", value: 12.3, color: "#FEFEEB" }, // Light Yellow
];

const COLORS = data.map((entry) => entry.color);
const wrapText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    const words = text.split(" ");
    let line1 = "";
    let line2 = "";

    for (const word of words) {
      if (line1.length + word.length <= maxLength) {
        line1 += `${word} `;
      } else {
        line2 += `${word} `;
      }
    }
    return [line1.trim(), line2.trim()];
  }
  return [text];
};

// Custom Label Function with Wrapping
const renderLabel = ({ cx, cy, midAngle, outerRadius, name, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 45; // Increase label distance from chart
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const wrappedText = wrapText(name, 12); // Split name if it's too long

  return (
    <>
      <text
        x={x}
        y={y - (wrappedText.length === 2 ? 14 : 12)} // Adjust Y position for multi-line
        fill="#585953"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12px"
        fontWeight="normal"
      >
        {wrappedText.map((line, index) => (
          <tspan x={x} dy={index === 0 ? "0" : "15"} key={index}>
            {line}
          </tspan>
        ))}
      </text>
      <text
        x={x}
        y={y + (wrappedText.length === 2 ? 12 : 6)} // Adjust position for multi-line
        fill="#585953"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12px"
        fontWeight="normal"
      >
        {(percent * 100).toFixed(1)}%
      </text>
    </>
  );
};

const TopSupplierBySpend = () => {
  return (
    <div className="bg-white rounded-lg flex justify-center items-center w-full px-8 py-6">
      <div className="w-full max-w-xl">
        <h3 className="text-[18px] font-bold text-[#303F58] text-start mb-4">
          Top Suppliers by Spend
        </h3>

        <PieChart width={500} height={500}> 
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={140}
            dataKey="value"
            label={renderLabel} 
            labelLine={{ stroke: "#888", strokeWidth: 1, lengthAdjust: "extend" }} 
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default TopSupplierBySpend;
