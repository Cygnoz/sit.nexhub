import { useEffect, useRef, useState } from "react";
import ArrowDownIcon from "../../../assets/icons/ArrowDownIcon";
import ArrowUpIcon from "../../../assets/icons/ArrowUpIcon";
import RefreshIcon from "../../../assets/icons/RefreshIcon";
import HoriBarChart from "../../../Components/charts/HoriBarChart";
import PieCharts from "../../../Components/charts/Piechart";
import TopDataTable from "../../../Components/charts/TopDataTable";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import InventoryCards from "./InventoryCards";
// import MonthYearDropdown from "../../../Components/dropdown/MonthYearDropdown"; 
import Brchart from "../../../Components/charts/BarChart";

type DropdownItem = {
  icon: JSX.Element;
  text: string;
  onClick: () => void;
};

// Extend DashboardData to include required properties
interface DashboardData {
  totalInventoryValue: number;
  totalSalesValue: number;
  inventoryValueChange: number;
  recentlyAddedItemsCount: number;
  salesValueChange: number;
  underStockItemsCount: number;
  stockLevels: {
    categoryName: string;
    items: { itemName: string; stock: number }[];
  }[];
  topSellingProducts: any[]; // Define a more specific type if known
  topSellingProductCategories: any[]; // Define a more specific type if known
  frequentlyOrderedItems: any[]; // Define a more specific type if known
}

type Props = {};

function DashboardHome({}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { request: getDashboard } = useApi("get", 5003);
  const [data, setData] = useState<DashboardData | null>(null); // Set initial state to null

  const getDashboards = async (month: number, year: number) => {
    const formattedMonth = (month + 1).toString().padStart(2, "0");
    const url = `${endponits.GET_INVENTORY_DASHBOARD}/${year}-${formattedMonth}-01`;
    try {
      const apiResponse = await getDashboard(url);
      const { response, error } = apiResponse;
      if (!error && response) {
        setData(response.data); // Ensure response.data matches DashboardData
        console.log(response.data, "get status");
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  // const handleDateChange = (month: number, year: number) => {
  //   getDashboards(month, year);
  // };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    getDashboards(currentMonth, currentYear);
  }, []);

  const dropdownItems: DropdownItem[] = [
    {
      icon: <ArrowDownIcon />,
      text: "Import Items",
      onClick: () => {
        console.log("Import Sales Order clicked");
      },
    },
    {
      icon: <ArrowUpIcon />,
      text: "Export Items",
      onClick: () => {
        console.log("Export Sales Order clicked");
      },
    },
    {
      icon: <ArrowUpIcon />,
      text: "Export Current View",
      onClick: () => {
        console.log("Export Current View clicked");
      },
    },
    {
      icon: <RefreshIcon color="#4B5C79" />,
      text: "Refresh List",
      onClick: () => {
        console.log("Refresh List clicked");
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        getDashboards(currentMonth, currentYear); // Refresh the data
      },
    },
  ];

  return (
    <div className="mx-5  space-y-8 text-[#303F58]">
      <div className="flex items-center relative">
        <div>
          <h3 className="font-bold text-2xl text-textColor">
            Inventory Overview
          </h3>
        </div>
        <div className="ml-auto gap-3 flex items-center">
          {/* <MonthYearDropdown onDateChange={handleDateChange} /> */}
          <div onClick={toggleDropdown} className="cursor-pointer">
            {/* Add your ellipsis icon here if needed */}
          </div>
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-16 right-4 mt-2 w-48 bg-white shadow-xl z-10"
            >
              <ul className="py-1 text-dropdownText">
                {dropdownItems.map((item, index) => (
                  <li
                    key={index}
                    onClick={item.onClick}
                    className="px-4 py-2 flex items-center gap-2 hover:bg-orange-100 rounded-md text-sm cursor-pointer"
                  >
                    {item.icon}
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <InventoryCards data={data} />

      {/* Top suppliers and supplier retention rate over time */}
      <div className="grid grid-cols-3 gap-5">
        <div className="flex justify-center col-span-2">
          {data && data.topSellingProducts && (
            <TopDataTable data={data.topSellingProducts} />
          )}
        </div>
        <div className="flex justify-center">
          {data && data.topSellingProductCategories && (
            <Brchart data={data.topSellingProductCategories} />
          )}
        </div>
        <div className="col-span-2 flex justify-center">
          {data && data.stockLevels && (
            <HoriBarChart 
              data={data.stockLevels} 
              categories={data.stockLevels.map(item => item.categoryName)} 
            />
          )}
        </div>
        <div className="flex justify-center">
          {data && data.frequentlyOrderedItems && (
            <PieCharts data={data.frequentlyOrderedItems} />
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
