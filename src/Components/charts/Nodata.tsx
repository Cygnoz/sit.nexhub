import Nodata from "../../assets/Images/NO_DATA.png";
interface TopCustomersProps {
  parentHeight?: string; // Assuming date is passed as a string (e.g., "2024-03-11")
}

  const NoData: React.FC<TopCustomersProps> = ({ parentHeight }) => {
  return (
    <div
    className={`flex flex-col items-center justify-center ${parentHeight ? `h-[${parentHeight}]` : "h-80"}`}
    style={{ height: parentHeight }}
  >
      <img src={Nodata} alt="No data available" className="mx-auto w-20 h-20" />
      <p className="text-gray-600 mt-4 text-center">
        There is no data available yet.
        <br />
        Please check back later.
      </p>
    </div>
  );
};

export default NoData;
