import React, { useEffect, useState } from 'react';
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Tooltips from '../../../Components/tooltip/Tooltip';
import useApi from '../../../Hooks/useApi';
import { endponits } from '../../../Services/apiEndpoints';
import NoData from '../../../Components/charts/Nodata';
import Dropdown from '../../../Components/dropdown/Dropdown';

type Props = {
  date: any;
};

// const colors = ['#f2c6b8', '#a72522', '#fbe6c3', '#eef1d6', '#e3e7e5', '#8fd3f4', '#ffcc00'];

const colors = ["#75CAFF", "#0099F8", "#B9F0DB", '#eef1d6', '#e3e7e5', "#65AEDB", "#EEEEEE"];

const renderCustomTooltip: React.FC<any> = ({ payload }) => {
  if (payload && payload.length) {
    return (
      <Tooltips
        content={`${payload[0].value}`}
        textColor="#ffffff"
        bgColor="#0099F8"
        arrowColor="#0099F8"
        width="80px"
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

function StockLevelOvertime({ date }: Props) {
  const { request: getStockLevelOver } = useApi("get", 7003);
  const [stockLevel, setStockLevel] = useState<[]>([]);
  const { request: fetchAllCategories } = useApi("put", 7003);
  const [allCategoryData, setAllcategoryData] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<typeof allCategoryData[0] | null>(null);

  const getStockLevel = async () => {
    try {
      const { response, error } = await getStockLevelOver(`${endponits.INVENTORY_DASH_STOCK_LEVEL_OVER_CATEGORY}?date=${date}&category=${selectedOption?.id}`);
      if (response && !error) {
        console.log('stocke', response.data);

        // Transform API response into required format
        const formattedData = response?.data?.topItems?.map((item: any) => ({
          name: item.itemName.split(' ')[0],
          value: item.currentStock,
        }));

        setStockLevel(formattedData);
      } else {
        console.log('err', error);
      }
    } catch (error) {
      console.log('er', error);
    }
  };
  const loadCategories = async () => {
    try {
      const url = `${endponits.GET_ALL_BRMC}`;
      const body = { type: "category" };
      const { response, error } = await fetchAllCategories(url, body);

      if (!error && response) {
        console.log("res", response.data);

        // Transform data to { id, name }
        const formattedCategories = response.data.map((item: any) => ({
          id: item.categoriesName,
          name: item.categoriesName, // Keeping 'name' same as 'categoriesName'
        }));

        setAllcategoryData(formattedCategories);
        setSelectedOption(formattedCategories[0])
      } else {
        console.error("Failed to fetch Category data.");
      }
    } catch (error) {
      console.error("Error in fetching Category data", error);
    }
  };



  useEffect(() => {
    loadCategories();
  }, [])

  useEffect(() => {
    if (date && selectedOption) {
      getStockLevel();
    }
  }, [date, selectedOption])



  // Get the max value to dynamically adjust domain
  const maxSpent = Math.max(...stockLevel.map((item: any) => item.value), 100000);

  return (
    <div className="bg-white rounded-lg w-full px-8 h-full">
      <div className='flex justify-between items-center'>
        <h3 className="text-[16px] mt-6 font-bold">Stock Level Over Category</h3>
        <div className='mt-3'>
          <Dropdown
            value={selectedOption}
            options={allCategoryData}
            onSelect={setSelectedOption}
            getDisplayValue={(option) => (option ? option.name : 'Select Category')}
            getFilterValue={(option) => option.name}
          />
        </div>
      </div>
      {stockLevel?.length > 0 ? <ResponsiveContainer width="100%" height={400}>
        <BarChart layout="vertical" data={stockLevel} margin={{ left: -50, right: 100 }}>
          <XAxis
            type="number"
            stroke="#4A5568"
            fontSize={10}
            axisLine={false}
            tickLine={false}
            domain={[0, maxSpent]}
          />
          <YAxis
            type="category"
            dataKey="value"
            stroke="#4A5568"
            axisLine={false}
            tickLine={false}
            fontSize={10}
            width={100}
            interval={0}
          />
          <Tooltip content={renderCustomTooltip} cursor={{ fill: 'transparent' }} />
          <Bar shape={<CustomBar />} barSize={30} dataKey="value" fill="#8884d8">
            <LabelList dataKey="name" position="right" fontSize={10} />
            {stockLevel.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
        :
        <NoData parentHeight="400px" />
      }
    </div>
  );
}

export default StockLevelOvertime;
