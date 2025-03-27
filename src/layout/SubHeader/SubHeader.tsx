import { useEffect, useState } from "react";
import navlist from "../../assets/constants";
import { Link } from "react-router-dom";
import ItemEllipsis from "../../Components/ellipsis/Ellipsis";
import HomeIcon from "../../assets/icons/HomeIcon";

type Props = {
  activeIndex: number | null;
};

const SubHeader = ({ activeIndex }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);

  useEffect(() => {
    const savedSelectedIndex = localStorage.getItem("savedSelectedIndex");
    if (savedSelectedIndex !== null) {
      setSelectedIndex(Number(savedSelectedIndex));
    }
  }, [activeIndex]);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    localStorage.setItem("savedSelectedIndex", index.toString());
  };

  return (
    <div className="bg-[#e6e9eb] flex mx-7 justify-between px-5 py-3 my-4 items-center rounded-full 
     overflow-x-auto whitespace-nowrap">
    
    <div className="flex items-center gap-4">
      <Link to={"/landing"}>
        <div className="bg-white px-3 py-2 rounded-full text-sm">
          <HomeIcon color="#585953" size={24} />
        </div>
      </Link>
      
      {/* Horizontal Scroll for Mobile */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {activeIndex !== null &&
          navlist[activeIndex] &&
          navlist[activeIndex].subhead &&
          navlist[activeIndex].subhead.map((item, index) => (
            <Link to={item.subRoute} key={index}>
              <div
                className={`font-medium py-2 px-4 rounded-full cursor-pointer ${
                  selectedIndex === index ? "bg-white" : "hover:bg-white"
                }`}
                onClick={() => handleSelect(index)}
              >
                {item.headName}
              </div>
            </Link>
          ))}
      </div>
    </div>
  
    <div>{activeIndex === 1 && <ItemEllipsis />}</div>
  </div>
  
  );
};

export default SubHeader;
