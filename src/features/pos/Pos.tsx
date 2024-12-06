import { useEffect, useState } from "react";
import PosHeader from "./PosHeader";
import ServicesIcon from "../../assets/icons/ServicesIcon";
import ProductsIcon from "../../assets/icons/ProductsIcon";
import defaultCustomerImage from "../../assets/Images/Rectangle 5558.png";
import Info from "../../assets/icons/Info";
import PosServices from "./posServices/PosServices";
import AddItemsPos from "./AddItemsPos";
import PosProducts from "./posProducts/PosProducts";
import useApi from "../../Hooks/useApi";
import { endponits } from "../../Services/apiEndpoints";
type Props = {};

function Pos({ }: Props) {
  const [tabSwitch, setTabSwitch] = useState<string>("products");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    console.log("Customer selected in POS:", customer);
  };
  const handleTabSwitch = (tabName: string) => {
    setTabSwitch(tabName);
  };
  const [goodsItems, setGoodsItems] = useState<any[]>([]);
  const [serviceItems, setServiceItems] = useState<any[]>([]);
console.log(serviceItems);

  const { request: GetAllItems } = useApi("get", 5003);

  const fetchAllItems = async () => {
    try {
      const url = `${endponits.GET_ALL_ITEMS_TABLE}`;
      const { response, error } = await GetAllItems(url);
      if (!error && response) {
        const allItems = response.data;
        const filteredGoods = allItems.filter((item: any) => item.itemType === "goods");
        const filteredServices = allItems.filter((item: any) => item.itemType === "service");
        setGoodsItems(filteredGoods); 
        setServiceItems(filteredServices); 
      } else {
        console.error("Error in response:", error);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchAllItems();
  }, []);


  return (
    <>
      <PosHeader onSelectCustomer={handleSelectCustomer} />
      <div className="flex justify-between px-5 gap-7">
        <div className="w-[65%]">
          <div className="flex justify-between items-center gap-3">
               {/* Products Tab */}
               <div
              className={`w-[50%] py-2 px-3 rounded-lg flex items-center gap-3 cursor-pointer ${tabSwitch === "products" ? "border-[1.5px] border-[#820000] bg-[#F3E6E6]" : "bg-white"
                }`}
              onClick={() => handleTabSwitch("products")}
            >
              <div className={`${tabSwitch === "products" ? "bg-[#820000]" : "bg-[#ECD9D9]"}  rounded-full p-2`}>
                <ProductsIcon color={`${tabSwitch === "products" ? "#FFFEFB" : "#303F58"}`} />
              </div>
              <div>
                <p className="text-textColor font-bold text-sm">Products</p>
                <p className="text-dropdownText font-semibold text-[10px]">300 Items</p>
              </div>
            </div>
            {/* Services Tab */}
            <div
              className={`w-[50%] py-2 px-3 rounded-lg flex items-center gap-3 cursor-pointer ${tabSwitch === "services" ? "border-[1.5px] border-[#820000] bg-[#F3E6E6]" : "bg-white"
                }`}
              onClick={() => handleTabSwitch("services")}
            >
              <div className={`${tabSwitch === "services" ? "bg-[#820000]" : "bg-[#ECD9D9]"}  rounded-full p-2`}>
                <ServicesIcon color={`${tabSwitch === "services" ? "#FFFEFB" : "#303F58"}`} />
              </div>
              <div>
                <p className="text-textColor font-bold text-sm">Services</p>
                <p className="text-dropdownText font-semibold text-[10px]">110 Items</p>
              </div>
            </div>

         
          </div>

          {/* Tabs Content */}
          <div className="mt-2">
            {tabSwitch === "services" && (
              <div>
                <PosServices items={serviceItems} />
              </div>
            )}
            {tabSwitch === "products" && (
              <div>
                <PosProducts items={goodsItems} />
              </div>
            )}
          </div>
        </div>

        <div className="w-[35%]">
          <div className="bg-white py-1.5 px-4 rounded-lg flex gap-3">
            <img src={selectedCustomer?.customerProfile || defaultCustomerImage} className="w-10 h-10 rounded-full" alt="" />
            <p className="text-[#495160] text-xs">Customer <br />
              <span className="text-[#37393A] text-xs font-bold">{selectedCustomer?.customerDisplayName}</span>
            </p>
            <div className="border border-[#DDDDDD] ms-2"></div>
            <p className="flex justify-center items-center text-[#585953] text-xs
           font-semibold gap-1
           "><Info color="#585953" size={14} /> See more details</p>
          </div>
          <AddItemsPos />
        </div>
      </div>
    </>
  );
}

export default Pos;
