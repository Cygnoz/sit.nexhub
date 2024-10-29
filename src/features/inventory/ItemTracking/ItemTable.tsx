import { useEffect, useRef, useState } from "react";
import { itemTrackingHead } from "../../../assets/constants/inventory";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import SearchBar from "../../../Components/SearchBar";

type Props = {};

const ItemTable = ({}: Props) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [allItemTracking, setAllItemTracking] = useState<[] | any>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const { request: getAllItemTracking } = useApi("get", 5003);

  const toggleDropdown = (index: number | null) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      toggleDropdown(null);
    }
  };

  useEffect(() => {
    if (openDropdownIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownIndex]);

  const getItemTracking = async () => {
    try {
      const url = `${endponits.GET_ALL_ITEM_TRANKING}`;
      const { response, error } = await getAllItemTracking(url);
      if (!error && response) {
        setAllItemTracking(response.data);
      } else {
        console.log(error, "error in fetching all item tracking");
      }
    } catch (error) {
      console.error("Error in getItemTracking", error);
    }
  };

  const filteredItems = allItemTracking.filter((item: any) => {
    const searchValueLower = searchValue.toLowerCase();
  
    const itemDate = item.date.split(" ")[0]; 
  
    const isWithinDateRange =
      (!fromDate || fromDate <= itemDate) && 
      (!toDate || itemDate <= toDate);
  
    return (
      item.itemName?.toLowerCase().includes(searchValueLower) &&
      isWithinDateRange
    );
  });
  

  const formatDate = (dateString: string) => {
    const datePart = dateString.split(" ")[0]; 
    const [day, month, year] = datePart.split("/"); 
    return `${day}/${month}/${year}`; 
  };

  useEffect(() => {
    getItemTracking();
  }, []);

  return (
    <>
      <div className="bg-white p-4 mt-7 rounded-lg relative">
        <div className="flex items-center justify-between mb-5 gap-4">
          <div className="w-full">
            <SearchBar
              placeholder="Search by item name"
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />
          </div>
          <div className="flex space-x-4 mb-5 mt-1">
            
          <input
            type="text"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            placeholder="From Date"
            className="hidden pl-3 text-sm w-[100%] mt-4 placeholder-[#495160] rounded-md text-start bg-white  border border-inputBorder  h-[39px]  leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
            />
          <input
            type="text"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            placeholder="To Date"
            className="pl-3 hidden text-sm w-[100%] mt-4 placeholder-[#495160] rounded-md text-start bg-white  border border-inputBorder  h-[39px]  leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
            />
        </div>
        </div>

       

        <div className="rounded-lg border-2 border-tableBorder">
          <table className="min-w-full bg-white relative pb-4">
            <thead className="text-[12px] text-center text-dropdownText">
              <tr className="bg-lightPink">
                {itemTrackingHead.map((item, index) => (
                  <th
                    className="py-2 px-4 font-medium border-b border-tableBorder relative"
                    key={index}
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-dropdownText text-center text-[13px] relative">
              {filteredItems && filteredItems.length>0? filteredItems.map((item: any, index: number) => (
                <tr className="relative" key={index}>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {formatDate(item.date)}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.itemName}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.action}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.creditQuantity}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.stakeholder}
                  </td>
                </tr>
              )):  <tr>
              <td
                colSpan={5} 
                className="text-center py-4 border-y border-tableBorder"
              >
                <p className="text-red-500">No Data Found!</p>
              </td>
            </tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ItemTable;
