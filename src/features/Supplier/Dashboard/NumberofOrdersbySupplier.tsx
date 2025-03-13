import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import NoData from "../../../Components/charts/Nodata";
import Tooltips from "../../../Components/tooltip/Tooltip";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";

type Props = {
  date?: any;
};

const renderCustomTooltip = ({ payload }: any) => {
  if (payload && payload.length) {
    return (
      <Tooltips
        content={`${payload[0].value}`}
        textColor="#ffffff"
        bgColor="#4A5568"
        arrowColor="#4A5568"
        width="50px"
      />
    );
  }
  return null;
};

const NumberOfOrdersBySupplier = ({ date }: Props) => {
  const { request: getNoOfOrderBySupplier } = useApi("get", 5009);
  const [chartData, setChartData] = useState<any>([]);

  const formatApiData = (apiData: any) => {
    const formattedData: any[] = [];
    const supplierNames = new Set<string>();
  
    // Collect all unique supplier names
    apiData.forEach((entry: any) => {
      entry.topSuppliers.forEach((supplier: any) => {
        supplierNames.add(supplier.supplierName);
      });
    });
  
    // Format data with missing suppliers filled as 0
    apiData.forEach((entry: any) => {
      const formattedDate = new Date(entry.date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
  
      const dataPoint: any = { date: formattedDate };
  
      // Initialize all suppliers with 0
      supplierNames.forEach((supplier) => {
        dataPoint[supplier] = 0;
      });
  
      // Fill actual data
      entry.topSuppliers.forEach((supplier: any) => {
        dataPoint[supplier.supplierName] = supplier.totalOrders;
      });
  
      formattedData.push(dataPoint);
    });
  
    return { formattedData, supplierNames: Array.from(supplierNames) };
  };
  

  const getNoOfOrderBySupp = async () => {
    try {
      const { response, error } = await getNoOfOrderBySupplier(
        `${endponits.SUPPLIER_DASH_TOP_ORDERS_BY_SUPPLIER}?date=${date}`
      );

      if (response && !error) {
        console.log("orderBy", response.data?.topOrdersByDay);
        const { formattedData } = formatApiData(response.data?.topOrdersByDay);
        setChartData(formattedData);
      } else {
        console.error("API Error:", error);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    if (date) {
      getNoOfOrderBySupp();
    }
  }, [date]);

  console.log("Chart",chartData);
  
  

  return (
    <div className="bg-white rounded-lg w-full py-6">
      <h3 className="ms-10 mb-6 text-[16px] font-bold">
        Number of Orders by Supplier
      </h3>
      {chartData.length>0?<div className="-ms-7">
      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={chartData}>
          <XAxis
            dataKey="date"
            stroke="#A0AEC0"
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#A0AEC0"
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <CartesianGrid vertical={false} stroke="#E2E8F0" />
          <RechartsTooltip content={renderCustomTooltip} cursor={false} />
          <Legend
            iconType="circle"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ marginTop: 2, paddingTop: 30 }}
          />

          {/* Render smooth curved lines dynamically */}
          {chartData.length > 0 &&
            Object.keys(chartData[0])
              .filter((key) => key !== "date")
              .map((supplier, index) => (
                <Line
                  key={supplier}
                  type="basis" // Smooth curved lines
                  dataKey={supplier}
                  stroke={`hsl(${index * 60}, 50%, 40%)`} // Soft colors
                  strokeWidth={2}
                  strokeOpacity={0.6} // Light line effect
                  dot={false}
                />
              ))}
        </LineChart>
      </ResponsiveContainer>
      </div>:
      <NoData parentHeight="400px"/>
      }
    </div>
  );
};

export default NumberOfOrdersBySupplier;
