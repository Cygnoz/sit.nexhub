import { useState } from "react";
import Header from "../../layout/Header/Header";
import PosHeader from "./PosHeader";
import ServicesIcon from "../../assets/icons/ServicesIcon";
import ProductsIcon from "../../assets/icons/ProductsIcon";
import defaultCustomerImage from "../../assets/Images/Rectangle 5558.png";
import Info from "../../assets/icons/Info";
type Props = {};

function Pos({ }: Props) {
  const [tabSwitch, setTabSwitch] = useState<string>("services");

  const handleTabSwitch = (tabName: string) => {
    setTabSwitch(tabName);
  };

  return (
    <>
      <Header />
      <PosHeader />
      <div className="flex justify-between mt-4 px-5 gap-7">
        <div className="w-[70%]">
          <div className="flex justify-between items-center gap-3">
            {/* Services Tab */}
            <div
              className={`w-[50%] py-2 px-3 rounded-lg flex items-center gap-3 cursor-pointer ${
                tabSwitch === "services" ? "border-[1.5px] border-[#820000] bg-[#F3E6E6]" : "bg-white"
              }`}
              onClick={() => handleTabSwitch("services")}
            >
              <div className={`${  tabSwitch === "services" ? "bg-[#820000]" :"bg-[#ECD9D9]"}  rounded-full p-2`}>
                <ServicesIcon color={`${tabSwitch === "services" ? "#FFFEFB" :"#303F58"}`} />
              </div>
              <div>
                <p className="text-textColor font-bold text-sm">Services</p>
                <p className="text-dropdownText font-semibold text-[10px]">110 Items</p>
              </div>
            </div>

            {/* Products Tab */}
            <div
              className={`w-[50%] py-2 px-3 rounded-lg flex items-center gap-3 cursor-pointer ${
                tabSwitch === "products" ? "border-[1.5px] border-[#820000] bg-[#F3E6E6]" : "bg-white"
              }`}
              onClick={() => handleTabSwitch("products")}
            >
               <div className={`${  tabSwitch === "products" ? "bg-[#820000]" :"bg-[#ECD9D9]"}  rounded-full p-2`}>
              <ProductsIcon color={`${tabSwitch === "products" ? "#FFFEFB" :"#303F58"}`} />
              </div>
              <div>
                <p className="text-textColor font-bold text-sm">Products</p>
                <p className="text-dropdownText font-semibold text-[10px]">300 Items</p>
              </div>
            </div>
          </div>

          {/* Tabs Content */}
          <div className="mt-4">
            {tabSwitch === "services" && (
              <div>
                <p>Services Component Content</p>
              </div>
            )}
            {tabSwitch === "products" && (
              <div>
                <p>Products Component Content</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-[30%]">
          <div className="bg-white py-2 px-4 rounded-lg flex gap-3">
            <img src={defaultCustomerImage} className="w-10 h-10 rounded-full" alt="" />
            <p className="text-[#495160] text-xs">Customer <br />
            <span className="text-[#37393A] text-xs font-bold">Mr. Ralph Edwards</span>
            </p>
            <div className="border border-[#DDDDDD] ms-2"></div>
           <p className="flex justify-center items-center text-[#585953] text-xs
           font-semibold gap-1
           "><Info color="#585953" size={14}/> See more details</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Pos;
