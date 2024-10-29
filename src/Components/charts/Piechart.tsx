import { Cell, Pie, PieChart, Tooltip } from "recharts";

interface PieChartsProps {
  frequentlyOrderedItems: Array<{
    itemName: string;
    saleVolume: number;
  }>;
}

const COLORS = ["#eddada", "#2c353b", "#f7e7cd", "#d1f0f0"];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">
          {payload[0].name}: ${payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const PieCharts = ({ frequentlyOrderedItems }: PieChartsProps) => {
  const data = frequentlyOrderedItems.map(item => ({
    name: item.itemName,
    value: item.saleVolume,
  }));

  return (
    <div className="bg-white rounded-lg w-full p-8">
      <p className="font-semibold">Most Frequently Added Items</p>
      <div className="flex flex-wrap mb-4">
        {data.map((item, index) => (
          <div key={`item-${index}`} className="flex items-center mr-4 my-2">
            <div
              className="w-2 h-2 mr-2"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <p className="text-sm">{item.name}</p>
          </div>
        ))}
      </div>
      <div className="overflow-hidden">
        <div className="inline-block min-w-full">
          <PieChart width={600} height={300}>
            <Pie
              data={data}
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={false}
              innerRadius={40}
              outerRadius={120}
              paddingAngle={5}
              cornerRadius={10}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default PieCharts;
