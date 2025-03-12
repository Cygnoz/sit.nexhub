import { Link, useNavigate } from "react-router-dom";
import logo from "../../../public/nexHuLogo.png";
import navlist from "../../assets/constants";
import { useEffect } from "react";

type Props = {
  activeIndex: number | null;
  setActiveIndex: (index: number) => void;
};

const SideBar = ({ activeIndex, setActiveIndex }: Props) => {
  useEffect(() => {
    const savedIndex = localStorage.getItem("savedIndex");
    if (savedIndex !== null) {
      setActiveIndex(Number(savedIndex));
    }
  }, [activeIndex]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    localStorage.setItem("savedIndex", index.toString());
    localStorage.setItem("savedSelectedIndex",'0')
  };
  const navigate=useNavigate()
  return (
    <aside className="bg-[#FFFFFF] h-[100vh] overflow-y-scroll hide-scrollbar w-[72px]">
      <nav className="pb-5">
        <div onClick={()=>navigate('/landing')} className="flex justify-between items-center px-6 pt-7 pb-1 cursor-pointer">
        <img src={logo} alt="logo" />
        
        </div>
        <p className="text-[#0099F8] text-[12px] font-semibold px-4">NHub</p>
      </nav>
      <ul className="flex-col">
        {navlist.map((item, index) => (
          <div className="flex justify-center" key={index}>
            <ul>
              <Link to={item.route}>
                <li className={`pb-3`} onClick={() => handleClick(index)}>
                  <div
                    className={`px-2 py-2 rounded-lg  flex justify-center ${
                      activeIndex === index ? "bg-[#D6EFFF]" : ""
                    }`}
                  >
                    {item.icon && <item.icon   color={activeIndex === index ? "#0099F8" : "#8D9BA2"}/>}
                  </div>
                  <p className="text-[8px] text-center text-[#8D9BA2]">
                    {item.nav}
                  </p>
                </li>
              </Link>
            </ul>
          </div>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
