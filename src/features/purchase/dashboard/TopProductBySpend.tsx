import React, { useEffect, useState } from 'react';
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Tooltips from '../../../Components/tooltip/Tooltip';
import useApi from '../../../Hooks/useApi';
import { endponits } from '../../../Services/apiEndpoints';

// const colors = ['#f2c6b8', '#a72522', '#fbe6c3', '#eef1d6', '#e3e7e5', '#8fd3f4', '#ffcc00'];
const colors = ['#75CAFF', '#0099F8', '#fbe6c3', '#eef1d6', '#e3e7e5', '#8fd3f4', '#ffcc00'];

interface DataItem {
  name: string;
  value: number;
}

const renderCustomTooltip = ({ payload }:any) => {
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

type Props = {
  date?: string;
};

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

const TopProductBySpend = ({ date }: Props) => {
  const { request: getTopProdBySpend } = useApi("get", 5005);
  const [topProduct, setTopProduct] = useState<DataItem[]>([]);

  const getTopProduct = async () => {
    try {
      const { response, error } = await getTopProdBySpend(
        `${endponits.PURCHASE_DASH_TOP_PRODUCTS_BY_SPEND}?date=${date}`
      );
      if (response && !error) {
        const transformedData = response.data.topProducts.map((item:any) => ({
          name: item.itemName,
          value: item.totalSpend
        }));
        setTopProduct(transformedData);
      } else {
        console.log("Error fetching data", error);
      }
    } catch (error) {
      console.log("Request error", error);
    }
  };

  useEffect(() => {
    if (date) {
      getTopProduct();
    }
  }, [date]);

  return (
    <div className="bg-white rounded-lg w-full px-5 py-2 space-y-4 overflow-x-auto">
      <h3 className="text-[16px] font-bold">Top Products By Supplier</h3>
      <ResponsiveContainer width="100%" height={450} >
        <BarChart layout="vertical" data={topProduct} margin={{ left: -50, right: 100, bottom: -25 }}>
          <XAxis
            type="number"
            stroke="#4A5568"
            fontSize={10}
            axisLine={false}
            tickLine={false}
            tick={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#4A5568"
            axisLine={false}
            tickLine={false}
            fontSize={10}
            width={100}
            interval={0}
          />
          <Tooltip content={renderCustomTooltip} cursor={{ fill: 'transparent' }} />
          <Bar shape={<CustomBar />} barSize={30} dataKey="value" fill="#8884d8">
            <LabelList dataKey="value" position="right" fontSize={10} />
            {topProduct.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductBySpend;
