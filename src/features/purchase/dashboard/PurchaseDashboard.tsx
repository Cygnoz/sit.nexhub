import { useEffect, useRef, useState } from "react";
import ArrowDownIcon from "../../../assets/icons/ArrowDownIcon";
import RefreshIcon from "../../../assets/icons/RefreshIcon";
import ArrowUpIcon from "../../../assets/icons/ArrowUpIcon";
import Ellipsis from "../../../assets/icons/Ellipsis";
import PurchaseCards from "./PurchaseCards";
import PurchaseOverTime from "./PurchaseOverTime";
import TopProductBySpend from "./TopProductBySpend";
import RecentTransaction from "./RecentTransaction";

type Props = {};

function PurchaseDashboard({}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownItems = [
    {
      icon: <ArrowDownIcon />,
      text: "Import Supplier",
      onClick: () => {
        console.log("Import Sales Order clicked");
      },
    },
    {
      icon: <ArrowUpIcon />,
      text: "Export Supplier",
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
      },
    },
  ];
  return (
    <div className="mx-5 my-4 text-[#303F58]">
      <div className=" flex  items-center relative">
        <div>
          <h3 className="font-bold text-2xl text-textColor">
            Purchase 
          </h3>
          <p className="text-sm text-dropdownText mt-1">
            A comprehensive snapshot of all purchases, to effectively manage
            procurement and budget allocation.{" "}
          </p>
        </div>
        <div className="ml-auto gap-3 flex items-center">
          <select
            name=""
            id=""
            className="border border-outlineButton rounded-lg p-2 text-outlineButton text-sm font-medium"
          >
            <option value="">Select Month</option>
          </select>

          <div onClick={toggleDropdown} className="cursor-pointer">
            <Ellipsis />
          </div>

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-12 right-1 mt-2 w-48 bg-white shadow-xl z-10"
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
      {/* cards */}
      <div className="mt-4">
        <PurchaseCards />
      </div>

      <div className="grid grid-cols-12 gap-4 my-5">
        <div className="col-span-8">
            <PurchaseOverTime/>
        </div>
        <div className="col-span-4">
            <TopProductBySpend/>
        </div>
      </div>
      <RecentTransaction/>
    </div>
  );
}

export default PurchaseDashboard;
