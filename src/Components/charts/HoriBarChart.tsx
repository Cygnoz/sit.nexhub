import React, { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import Tooltips from "../../Components/tooltip/Tooltip";
import NoData from "./Nodata";

const colors = [
  "#f2c6b8",
  "#a72522",
  "#fbe6c3",
  "#eef1d6",
  "#e3e7e5",
  "#8fd3f4",
  "#ffcc00",
];

interface DataItem {
  itemName: string;
  stock: number;
}

interface HoriBarChartProps {
  data: { categoryName: string; items: DataItem[] }[];
  categories: string[];
}

const renderCustomTooltip: React.FC<TooltipProps<number, string>> = ({
  payload,
}) => {
  if (payload && payload.length) {
    return (
      <Tooltips
        content={`${payload[0].value}`}
        textColor="#ffffff"
        bgColor="#0099F8"
        arrowColor="#0099F8"
        width="60px"
      />
    );
  }
  return null;
};

interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
}

const CustomBar: React.FC<CustomBarProps> = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  fill = "",
}) => {
  const radius = 10;

  return (
    <g>
      <path
        d={`M${x},${y} 
           L${x},${y + height} 
           L${x + width - radius},${y + height} 
           Q${x + width},${y + height} ${x + width},${y + height - radius}
           L${x + width},${y + radius} 
           Q${x + width},${y} ${x + width - radius},${y} 
           Z`}
        fill={fill}
      />
    </g>
  );
};

const HoriBarChart: React.FC<HoriBarChartProps> = ({ data, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // Filter data based on the selected category
  const filteredData =
    data.find((item) => item.categoryName === selectedCategory)?.items || [];

  const maxStock = Math.max(...filteredData.map((item) => item.stock), 0);

  return (
    <div className="bg-white rounded-lg w-full px-8">
      <div className="flex items-center mt-6 justify-between">
        <h3 className="text-lg text-textColor font-semibold">Stock Levels</h3>

        {/* Category Dropdown */}
        <select
          className="rounded-lg p-2 text-sm bg-slate-50 border border-gray-300 "
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {filteredData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            layout="vertical"
            data={filteredData}
            margin={{ left: 0, right: 30, bottom: 0 }}
          >
            <XAxis
              type="number"
              stroke="#4A5568"
              fontSize={10}
              axisLine={false}
              tickLine={false}
              domain={[0, maxStock]}
              tick={false}
            />
            <YAxis
              type="category"
              dataKey="itemName"
              stroke="#4A5568"
              axisLine={false}
              tickLine={false}
              fontSize={10}
              width={100}
              interval={0}
            />
            <Tooltip
              content={renderCustomTooltip}
              cursor={{ fill: "transparent" }}
            />
            <Bar
              shape={<CustomBar />}
              barSize={30}
              dataKey="stock"
              fill="#8884d8"
            >
              <LabelList dataKey="stock" position="right" fontSize={10} />
              {filteredData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center text-gray-500 text-sm py-8">
          <NoData />
        </div>
      )}
    </div>
  );
};

export default HoriBarChart;
