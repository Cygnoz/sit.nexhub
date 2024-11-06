import { useEffect, useState } from "react";
import Header from "./Header/Header";
import SideBar from "./SideBar/SideBar";
import SubHeader from "./SubHeader/SubHeader";
import { Outlet, useLocation } from "react-router-dom";
type Props = {
  children: React.ReactNode;
};
 
const Layout = ({}: Props) => {
  const location=useLocation()
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [subHeaderView,setSubHeaderView]=useState(false)
 
  useEffect(()=>{
    setSubHeaderView(location.pathname.endsWith('info'))
  },[location])
  return (
    <div className="flex">
      <SideBar activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      <div className="w-[100%] h-[100vh] overflow-y-scroll hide-scrollbar">
        <Header />
        {!subHeaderView&&<SubHeader activeIndex={activeIndex} />}
        <Outlet />
      </div>
    </div>
  );
};
 
export default Layout;