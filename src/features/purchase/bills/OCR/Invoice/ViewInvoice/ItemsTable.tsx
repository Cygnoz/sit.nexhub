import { useState, useRef, useEffect } from "react";
import DotIcon from "../../../../../../assets/icons/DotIcon";
import Button from "../../../../../../Components/Button";
import Check from "../../../../../../assets/icons/Check";
import AddNewItem from "./AddNewItem";
import CehvronDown from "../../../../../../assets/icons/CehvronDown";

type Item = {
  id: string;
  product_name: string;
  hsn_sac: string;
  quantity: string;
  rate: string;
  gross: string;
  discount: string;
  net_amount: string;
  tax: string;
  tax_amount: string;
  total_amount: string;
  batch_no: string | null;
  expiry_date?: string | null;
};

type Props = {
  allItems?:any
  items?: Item[];
  invoice?: any;
  setInvoice?: (invoice: any) => void;
};

function ItemsTable({ items = [], invoice, setInvoice ,allItems}: Props) {
  const tableHead = [
    "Sl.No",
    "Product Name",
    "HSN/SAC",
    "Quantity",
    "Rate",
    "Gross",
    "Discount",
    "Net Amount",
    "Tax %",
    "Tax Amount",
    "Total",
    "Batch Number",
    "Expiry Date",
  ];

  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [expandDropDown, setExpandDropDown] = useState<string | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [invoiceSelectedItem, setSelectedInvoiceItem] = useState<any>(null);
  const [matchingItem, setMatchingItem] = useState<any>(null);
  const [finalItem, setFinalItem] = useState<any>(null);



  const handleExpand = (key: string) => {
    setExpandDropDown((prevKey) => (prevKey === key ? null : key));
  };

  const toggleDropdown = (index: number) => {
    const selectedItem = items[index]?.product_name?.toLowerCase().trim();
    
    const isProductAlreadyExists = allItems?.some(
      (item: any) => 
        item.itemName?.toLowerCase().trim() === selectedItem
    );
  
    if (isProductAlreadyExists) {
      // console.log("Product already exists in allItems. Dropdown will not open.");
      return;
    }
  
    setOpenDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  

  const handleItemsMatch = () => {
    if (!invoiceSelectedItem) {
      console.error("No invoice item available.");
      return;
    }
    if (!allItems || allItems.length === 0) {
      console.error("No item data available.");
      return;
    }   

    const invoiceItem = invoiceSelectedItem.product_name?.toLowerCase().trim();
    if (!invoiceItem) {
      return;
    }

    const normalizedInvoiceItem = invoiceItem.replace(/\s+/g, "").toLowerCase();

    const matchingItem = allItems.filter((items: any) => {
      const normalizedItemName = items.itemName
        .replace(/\s+/g, "")
        .toLowerCase();

      const isSubstringMatch = normalizedItemName.includes(normalizedInvoiceItem);

      const itemSubstring = normalizedItemName.substring(0, 5);
      const invoiceitemSubstring = normalizedInvoiceItem.substring(0, 5);

      return isSubstringMatch || itemSubstring === invoiceitemSubstring;
    });

    if (matchingItem.length === 0) {
      console.log(`No matching Item found for '${invoiceItem}'.`);
    } else {
      setMatchingItem(matchingItem);
      // console.log(matchingItem, "match");
    }
  };



  const handleConfirmSelection = (selectedIndex: number) => {
    if (!finalItem) {
      console.error("No item selected.");
      return;
    }
  
    const updatedInvoiceItems = invoice.invoice.items.map((item: any, index: number) => {
      if (index === selectedIndex) {
        return {
          ...item,
          product_name: finalItem.itemName,
        };
      }
      return item;
    });
  
    setInvoice?.((prevInvoice: any) => ({
      ...prevInvoice,
      invoice: {
        ...prevInvoice.invoice,
        items: updatedInvoiceItems,
      },
    }));
    
    setOpenDropdownIndex(null);
    setExpandDropDown(null);
  };
  

  useEffect(() => {
    handleItemsMatch();
  }, [allItems, items, openDropdownIndex ]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



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
              <td
                onClick={() => {
                  toggleDropdown(index);  
                  setSelectedInvoiceItem(item);
                }}
                className="relative"
              >
                <div
                  className={`border px-4 py-3 whitespace-nowrap cursor-pointer ${
                    openDropdownIndex === index
                      ? "border-x-darkRed border-y-darkRed bg-lightPink"
                      : "border-[#F4F4F4]"
                  }`}
                >
                  {item.product_name}
                  {openDropdownIndex === index && (
                    <div
                      className="absolute z-10 w-[100%] -ms-5 bg-white rounded-md mt-3.5 p-2 space-y-1 max-h-72 overflow-y-auto hide-scrollbar"
                      style={{ boxShadow: "1px 1px 5px 0.5px" }}
                    >
                      <div className="flex gap-3 mb-4 items-center">
                        <DotIcon color="#DD2020" size={15} />
                        <p className="text-textColor font-bold text-sm">
                          Line Item
                        </p>
                      </div>
                      <div
                        className="h-9 rounded-md border border-neutral-200 my-5 flex"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <div className="flex w-full" onClick={() => handleExpand("dropdown1")}>
                          <div className="flex items-center px-3 text-loremcolor text-sm">
                            {finalItem?.itemName ? finalItem.itemName : " Select Product"}
                          </div>
                          <div className="items-center justify-end ml-auto flex pe-2 ">
                            <CehvronDown color="gray" />
                          </div>
                        </div>
                      </div>
                      {expandDropDown === "dropdown1" && (
                        <div className="space-y-1">
                          {matchingItem?.length > 0 ?
                            matchingItem.map((item: any) => (
                              <div
                                className="flex items-center px-3 text-loremcolor text-sm h-9 bg-[#f2f2f2]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFinalItem(item);
                                  handleExpand("dropdown1")
                                }}
                                key={item._id}
                              >
                                {item.itemName}
                              </div>
                            )):(<div  className="flex items-center px-3 text-loremcolor  h-9 bg-[#f2f2f2]"><p className="text-darkRed">No Matching Items in the Inventory..!</p></div>)}
                        </div>
                      )}
                      <div className="flex justify-end py-3 gap-2">
                        <Button variant="secondary" size="sm">
                          Cancel
                        </Button>
                        <button
                          className="bg-[#32A370] px-2 rounded-md text-white font-semibold flex items-center justify-center gap-1"
                          onClick={() => {handleConfirmSelection(openDropdownIndex!), toggleDropdown(index) }}
                        >
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
                {item.hsn_sac|| "-"}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.quantity}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.rate ? (item.rate) : "-"}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.gross ? (item.gross) : "-"}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.discount ? (item.discount): "-"}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.net_amount ? (item.net_amount) : "-"}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.tax ? (item.tax) : "-"}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.tax_amount ? (item.tax_amount): "-"}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.total_amount ? (item.total_amount): "-"}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.batch_no|| "-"}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.expiry_date || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ItemsTable;
