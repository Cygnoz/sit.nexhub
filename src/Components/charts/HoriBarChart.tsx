import React from 'react';
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';
import Tooltips from '../../Components/tooltip/Tooltip';

const colors = ['#f2c6b8', '#a72522', '#fbe6c3', '#eef1d6', '#e3e7e5', '#8fd3f4', '#ffcc00'];

interface DataItem {
  itemName: string;
  stock: number;
}

interface HoriBarChartProps {
  data: DataItem[]; 
}

const renderCustomTooltip: React.FC<TooltipProps<number, string>> = ({ payload }) => {
  if (payload && payload.length) {
    return (
      <Tooltips
        content={`${payload[0].value}`}
        textColor="#ffffff"
        bgColor="#000000"
        arrowColor="#000000"
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

const CustomBar: React.FC<CustomBarProps> = ({ x = 0, y = 0, width = 0, height = 0, fill = '' }) => {
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

const HoriBarChart: React.FC<HoriBarChartProps> = ({ data }) => {
  const maxStock = Math.max(...data.map(item => item.stock)); 

  return (
    <div className="bg-white rounded-lg w-full px-8 "> 
      <h3 className="text-base text-textColor mt-6 font-semibold">Stock Levels</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart layout="vertical" data={data} margin={{ left: 0, right: 30, bottom: 0 }}>
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
          <Tooltip content={renderCustomTooltip} cursor={{ fill: 'transparent' }} />
          <Bar shape={<CustomBar />} barSize={30} dataKey="stock" fill="#8884d8">
            <LabelList dataKey="itemName" position="right" fontSize={10} />
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HoriBarChart;
