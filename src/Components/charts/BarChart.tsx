import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, Cell } from "recharts";
import Tooltips from "../../Components/tooltip/Tooltip";
import BackgroundImage from "../../assets/Images/Active clients.png";
import NoData from "./Nodata";

interface CategoryData {
  categoryName: string;
  salesValue: number;
}

interface BrchartProps {
  data: CategoryData[];
}

const colors = ["#75CAFF", "#0099F8", "#B9F0DB", "#65AEDB", "#EEEEEE"];

const renderCustomTooltip = ({ payload }: any) => {
  if (payload && payload.length) {
    return (
      <Tooltips
        content={`$${payload[0].value}`}
        textColor="#ffffff"
        bgColor="#0099F8"
        arrowColor="#0099F8"
        width="60px"
      />
    );
  }
  return null;
};

const renderCustomizedLabel = (props: any) => {
  const { x, y, width } = props;
  const radius = 10;
  const spacing = -10;
  return (
    <g transform={`translate(${x + width / 2}, ${y + spacing})`}>
      <circle cx={0} cy={-radius} r={radius} fill="none" strokeWidth={0} />
      <image
        href={BackgroundImage}
        x={-radius}
        y={-radius * 2}
        width={radius * 2}
        height={radius * 2}
      />
    </g>
  );
};

const CustomBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  const radius = 10;

  return (
    <g>
      <path
        d={`M${x},${y + radius} 
             L${x},${y + height} 
             L${x + width},${y + height} 
             L${x + width},${y + radius} 
             Q${x + width},${y} ${x + width - radius},${y} 
             L${x + radius},${y} 
             Q${x},${y} ${x},${y + radius}`}
        fill={fill}
      />
    </g>
  );
};

const Brchart: React.FC<BrchartProps> = ({ data }) => {
  const formattedData = data.map(({ categoryName, salesValue }) => ({
    name: categoryName,
    value: salesValue,
  }));

  return (
    <div className="bg-white rounded-lg w-full py-8">
    <h3 className="ms-10 text-base font-semibold text-textColor">
      Top Selling Products Categories
    </h3>
    <h4 className="ms-10 mb-3 py-4 text-[10px] text-[#4A5568]">Sales Volume</h4>
    
    {formattedData && formattedData.length > 0 ? (
      <BarChart width={420} height={280} data={formattedData}>
        <XAxis
          stroke="#4A5568"
          fontSize={10}
          axisLine={false}
          tickLine={false}
          dataKey="name"
        />
        <YAxis
          stroke="#4A5568"
          axisLine={false}
          tickLine={false}
          fontSize={10}
        />
        <Tooltip
          content={renderCustomTooltip}
          cursor={{ fill: "transparent" }}
        />
        <Bar shape={<CustomBar />} barSize={40} dataKey="value" fill="#8884d8">
          <LabelList dataKey="name" content={renderCustomizedLabel} />
          {formattedData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    ) : (
      <div className="text-center text-gray-500 text-sm py-8">
        <NoData />
      </div>
    )}
  
    <div className="flex justify-center">
      <h3 className="text-center text-[10px] text-[#4A5568] pt-3">
        Product Category
      </h3>
    </div>
  </div>
  
  );
};

export default Brchart;
