import { useState, useRef, useEffect } from "react";
import DotIcon from "../../../../../../assets/icons/DotIcon";
import Button from "../../../../../../Components/Button";
import Check from "../../../../../../assets/icons/Check";
import AddNewItem from "./AddNewItem";
import CehvronDown from "../../../../../../assets/icons/CehvronDown";


type Item = {
  id: number;
  product: string;
  hsnSac: string;
  qty: number;
  rate: number;
  gross: number;
  discount: number;
  netAmount: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
  batchNo: string;
};

type Props = {
  items?: Item[];
};

function ItemsTable({ items = [] }: Props) {
  const tableHead = [
    "Sl.no",
    "Product",
    "Hsn/Sac",
    "Qty",
    "Rate",
    "Gross",
    "Discount",
    "Net Amount",
    "Tax %",
    "Tax Amount",
    "Total",
    "Batch No",
  ];

  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [expandDropDown, setExpandDropDown] = useState<string | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);

  // Close the dropdown if the click is outside the table
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        setOpenDropdownIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleExpand = (key: string) => {
    setExpandDropDown((prevKey) => (prevKey === key ? null : key));
  };

  const toggleDropdown = (index: number) => {
    setOpenDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="overflow-x-auto hide-scrollbar h-[300px]">
      <table
        ref={tableRef}
        className="min-w-full border-collapse text-xs text-textColor h-[100px]"
      >
        <thead>
          <tr>
            {tableHead.map((item, index) => (
              <th
                key={index}
                className="border font-semibold text-xs min-w-min border-[#F4F4F4] py-2 px-5 text-textColor bg-[#f5f9fc] whitespace-nowrap"
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id} className="hover:bg-gray-50 text-center">
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {index + 1}
              </td>
              <td onClick={() => toggleDropdown(index)} className="relative">
                <div
                  className={`border px-4 py-3 whitespace-nowrap cursor-pointer ${
                    openDropdownIndex === index
                      ? "border-x-darkRed border-y-darkRed bg-lightPink"
                      : "border-[#F4F4F4]"
                  }`}
                >
                  {item.product}
                  {openDropdownIndex === index && (
                    <div className="absolute z-10 w-[200%] -ms-5  bg-white rounded-md mt-3.5 p-2 space-y-1 max-h-72 overflow-y-auto hide-scrollbar" style={{boxShadow:"1px 1px 5px 0.5px"}}>
                      <div className="flex gap-3 mb-4 items-center">
                        <DotIcon color={"#DD2020"} size={15} />
                        <p className="text-textColor font-bold text-sm">
                          Line Item
                        </p>
                      </div>
                      <div
                        className="h-9 rounded-md border border-neutral-200 my-5 flex"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExpand("dropdown1");
                        }}
                      >
                        <div className="flex items-center px-3 text-loremcolor text-sm">
                          I Phone 15
                        </div>
                        <div className="items-center justify-end ml-auto flex pe-2">

<CehvronDown color={"gray"}/>               </div>
                      </div>
                      {expandDropDown === "dropdown1" && (
                        <div className="space-y-1">
                          <div className="flex items-center px-3 text-loremcolor text-sm h-9 bg-[#f2f2f2]">
                            I Phone 15
                          </div>
                          <div className="flex items-center px-3 text-loremcolor text-sm h-9 bg-[#f2f2f2]">
                            I Phone 15 Plus
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end py-3 gap-2">
                        <Button variant="secondary" size="sm">
                          Cancel
                        </Button>
                        <button className="bg-[#32A370] px-2 rounded-md text-white font-semibold flex items-center justify-center gap-1">
                          <Check />
                          Confirm
                        </button>
                      </div>
                      <div className="flex items-center justify-center">
                        <p className="font-bold">OR</p>
                      </div>
                      <div
                        className="w-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <AddNewItem />
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.hsnSac}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.qty}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.rate.toFixed(2)}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.gross.toFixed(2)}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.discount.toFixed(2)}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.netAmount.toFixed(2)}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.taxPercent}%
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.taxAmount.toFixed(2)}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.total.toFixed(2)}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.batchNo}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ItemsTable;
