import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import useApi from "../../../Hooks/useApi";
import { useEffect, useState } from "react";
import { endponits } from "../../../Services/apiEndpoints";
import NoData from "../../../Components/charts/Nodata";

type Props = {
  date?: any;
};

// Function to generate a color palette
const generateColors = (count: number) => {
  const colors = ["#0099F8", "#EDDADA", "#75CAFF", "#D1D5DB", "#E5E7EB", "#A8B5A1"];

  return Array.from({ length: count }, (_, index) => colors[index % colors.length]);
};

// Wrap long text for labels
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

// Custom Label Function
const renderLabel = ({ cx, cy, midAngle, outerRadius, name, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 45;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const wrappedText = wrapText(name, 12);

  return (
    <>
      <text
        x={x}
        y={y - (wrappedText.length === 2 ? 14 : 12)}
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
        y={y + (wrappedText.length === 2 ? 12 : 6)}
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

const TopSupplierBySpend = ({ date }: Props) => {
  const { request: getTopSuppliers } = useApi("get", 5009);
  const [topSupplierSpend, setTopSupplierSpend] = useState<any>([]);
  
  const getTopSuppliersData = async () => {
    try {
      const { response, error } = await getTopSuppliers(
        `${endponits.SUPPLIER_DASH_TOP_SUPPLIER_BY_SPEND}?date=${date}`
      );

      if (response && !error) {
        const transformedData = response?.data?.topSuppliers?.map((item: any) => ({
          name: item.supplierName,
          value: item.totalSpend,
        }));

        setTopSupplierSpend(transformedData);
      } else {
        console.error("API Error:", error);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    if (date) {
      getTopSuppliersData();
    }
  }, [date]);

  const COLORS = generateColors(topSupplierSpend.length);

  return (
    <div className="bg-white rounded-lg flex justify-center items-center w-full px-8 py-6 overflow-x-auto">
      <div className="w-full ">
        <h3 className="text-[18px] font-bold text-[#303F58] text-start mb-4">
          Top Suppliers by Spend
        </h3>

        {topSupplierSpend.length > 0 ? (
           <ResponsiveContainer width="100%" height={400} minHeight={300}>
          <PieChart width={500} height={500}>
            <Pie
              data={topSupplierSpend}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={140}
              dataKey="value"
              label={renderLabel}
              labelLine={{ stroke: "#888", strokeWidth: 1, lengthAdjust: "extend" }}
            >
              {topSupplierSpend.map((_entry:any, index:number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          </ResponsiveContainer>
        ) : (
          <NoData parentHeight="400px"/>
        )}
      </div>
    </div>
  );
};

export default TopSupplierBySpend;
