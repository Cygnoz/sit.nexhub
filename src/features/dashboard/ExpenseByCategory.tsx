import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { endponits } from "../../Services/apiEndpoints";
import useApi from "../../Hooks/useApi";
import NoData from "../../Components/charts/Nodata";

type Props = {
  date: string;
};

const COLORS = ["#F7E7CD", "#EDDADA", "#A8B5A1", "#D1D5DB", "#E5E7EB", "#8FA3A0"];

// Custom Label Styling
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#303F58"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="14px"
      fontWeight="bold"
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
        <p className="text-gray-600">{`₹${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

function ExpenseByCategory({ date }: Props) {
  const { request: getExpByCategory } = useApi("get", 5004);
  const [expenseByCategory, setExpenseByCategory] = useState<any>([]);

  const getExpCat = async () => {
    try {
      const { response, error } = await getExpByCategory(
        `${endponits.MAIN_DASH_EXPENSE_BY_CATEGORY}?date=${date}`
      );
      if (response && !error) {
        console.log("API Response:", response?.data?.category);

        // Transform API response
        const transformedData = response?.data?.category?.map((item: any, index: number) => ({
          name: item.category,
          value: parseFloat(item.total),
          color: COLORS[index % COLORS.length],
        }));

        setExpenseByCategory(transformedData);
      } else {
        console.log("Error:", error);
      }
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  useEffect(() => {
    if (date) {
      getExpCat();
    }
  }, [date]);

  return (
    <div className="bg-white rounded-lg w-full p-8  overflow-x-auto">
      <p className="text-[#303F58] font-semibold text-base">Expenses by Category</p>

      {expenseByCategory.length > 0 ? (
        <div className="flex flex-col items-center mt-5">
          {/* Legend */}
          <div className="flex flex-col items-start w-full">
            {expenseByCategory.map((item: any, index: number) => (
              <div key={index} className="flex items-center mb-2">
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></span>
                <p className="text-[#3f4856] ">
                  {item.name} <span className="text-[#303F58] ms-5">{item.value}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Pie Chart */}
          <PieChart width={280} height={250}>
            <Pie
              data={expenseByCategory}
              dataKey="value"
              nameKey="name"
              label={renderCustomizedLabel}
              labelLine={false}
              innerRadius={50}
              outerRadius={110}
              paddingAngle={5}
              cornerRadius={10}
            >
              {expenseByCategory.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </div>
      ) : (
        <NoData parentHeight="400px" />
      )}
    </div>
  );
}

export default ExpenseByCategory;
