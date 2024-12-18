import { useNavigate } from "react-router-dom";

type IconData = {
  icon: string;
  label: string;
  route: string;
  index: number;
  subIndex: number;
  state?: any; 
};

type IconGridProps = {
  iconData: IconData[];
  mode?: boolean;
};

const IconGrid = ({ iconData, mode }: IconGridProps) => {
  const navigate = useNavigate();

  const handleNavigation = (route: string, index: number, subIndex: number, state?: any) => {
    localStorage.setItem("savedIndex", index.toString());
    localStorage.setItem("savedSelectedIndex", subIndex.toString());
    navigate(route, { state });
  };

  return (
    <div className="flex flex-wrap gap-8 justify-center">
      {iconData.map((item) => (
        <div
          key={`${item.index}-${item.subIndex}`}
          onClick={() =>
            handleNavigation(item.route, item.index, item.subIndex, item.state)
          }
          className={`${mode ? "text-textColor" : "text-white"} flex flex-col items-center w-40 h-28 justify-center px-6 py-4 rounded-2xl 
              bg-gradient-to-b from-[#2C353B] via-[#2C353B] to-transparent  cursor-pointer`}
          style={{
            background: mode
              ? "linear-gradient(180deg, #EAEBEB 0%, rgba(234, 235, 235, 0) 113.86%)"
              : "linear-gradient(180deg, #2C353B -22.77%, rgba(44, 53, 59, 0) 100%)"
          }}
        >
          <img src={item.icon} alt={item.label} className="w-10 h-10 mb-3" />
          <div className="w-[142%]">
            <p className="text-center text-sm w-full font-semibold">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IconGrid;
