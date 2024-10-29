import Ellipsis from "../../../assets/icons/Ellipsis";
import PlusCircle from "../../../assets/icons/PlusCircle";
import Table from "./Table";
import ArrowDownIcon from "../../../assets/icons/ArrowDownIcon";
import ArrowUpIcon from "../../../assets/icons/ArrowUpIcon";
import { useEffect, useRef, useState } from "react";
import PrinterIcon from "@heroicons/react/20/solid/PrinterIcon";
import CehvronDown from "../../../assets/icons/CehvronDown";
import Calender from "../../../assets/icons/Calender";
import SearchBar from "../../../Components/SearchBar";

type Props = {};

function DayBook({}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
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
      text: "Import Journal",
      onClick: () => {
        console.log("Import Sales Order clicked");
      },
    },
    {
      icon: <ArrowUpIcon />,
      text: "Export Journal",
      onClick: () => {
        console.log("Export Sales Order clicked");
      },
    },
    {
      icon: <ArrowUpIcon />,
      text: "Manage Journal",
      onClick: () => {
        console.log("Export Current View clicked");
      },
    },
  ];

  return (
    <>
      <div className="mx-5 my-4 bg-slate-50 h-[100vh]">
        <div className="flex items-center">
          <div>
            <h3 className="font-bold text-2xl text-textColor">Day Book</h3>
            <p className="text-sm text-gray mt-1">
              Maintain a detailed record of all transactions in one place with
              the Day Book section.
            </p>
          </div>
          <div className="ml-auto gap-3 flex items-center">
            <div className="flex text-dropdownText gap-4">
              <div className="relative border-2 border-slate-200 flex rounded-md px-2 py-1 text-sm items-center">
                <div className="pointer-events-none inset-y-0 flex items-center px-2 text-gray-700">
                  <Calender color="currentColor" height={18} width={18} />
                </div>
                Select From Date
                <div className="pointer-events-none inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <CehvronDown color="gray" />
                </div>
              </div>
              <div className="relative border-2 border-slate-200 flex rounded-md px-2 py-1 text-sm items-center">
                Select To Date
                <div className="pointer-events-none inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <CehvronDown color="gray" />
                </div>
              </div>
              <div className="ml-auto flex items-center">
                <button className="flex border px-2 py-1 border-gray-300 rounded-lg bg-secondary_active">
                  <PrinterIcon color="gray" height={18} width={20} />
                  <span className="text-sm text-neutral-500">Print</span>
                </button>
              </div>
            </div>
            <PlusCircle color="white" />
            <div className="relative">
              <div onClick={toggleDropdown} className="cursor-pointer">
                <Ellipsis />
              </div>
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl z-10"
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
        </div>
        <div className="mt-5 bg-white p-5 rounded-xl">
          <SearchBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            placeholder="Search Currency"
          />
          <Table />
        </div>
      </div>
    </>
  );
}

export default DayBook;
