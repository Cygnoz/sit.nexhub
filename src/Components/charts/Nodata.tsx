import Nodata from "../../assets/Images/NO_DATA.png";

const NoData = () => {
  return (
    <div className="text-center mt-10">
      <img src={Nodata} alt="No data available" className="mx-auto w-20 h-20" />
      <p className="text-gray-600 mt-4">
        There is no data available yet.
        <br />
        Please check back later.
      </p>
    </div>
  );
};

export default NoData;
