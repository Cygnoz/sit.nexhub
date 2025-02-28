import { useState, useRef, useEffect } from "react";
import DotIcon from "../../../../../../assets/icons/DotIcon";
import Button from "../../../../../../Components/Button";
import Check from "../../../../../../assets/icons/Check";
import CehvronDown from "../../../../../../assets/icons/CehvronDown";
import CheveronDownIcon from "../../../../../../assets/icons/CheveronDownIcon";
import AddNewItem from "./AddNewItem";

type Item = {
  id: string;
  itemName: string;
  hsn_sac: string;
  itemQuantity: string;
  itemCostPrice: string;
  gross: string;
  itemDiscount: string;
  net_amount: string;
  itemCgstAmount: string | number;
  itemAmount: string;
  batch_no: string | null;
  expiry_date?: string | null;
  itemCgst: string;
  itemSgst: string;
  itemIgst: string;
  itemSgstAmount: string | number;
  itemIgstAmount: string | number;
  itemTax: string | number;
};

type Props = {
  allItems?: any[];
  items?: Item[];
  invoice?: any;
  setInvoice?: (invoice: any) => void;
};

function ItemsTable({ items = [], invoice, setInvoice, allItems = [] }: Props) {
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

  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );
  const [expandDropDown, setExpandDropDown] = useState<string | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [invoiceSelectedItem, setSelectedInvoiceItem] = useState<Item | null>(
    null
  );
  const [matchingItem, setMatchingItem] = useState<Item[]>([]);
  const [finalItem, setFinalItem] = useState<any | null>(null);
  const [expandedItemIndex, setExpandedItemIndex] = useState<number | null>(
    null
  );

  const handleItemDetailExpand = (index: number) => {
    setExpandedItemIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleExpand = (key: string) => {
    setExpandDropDown((prevKey) => (prevKey === key ? null : key));
  };

  const toggleDropdown = (index: number) => {
    if (!items[index]) return; // Prevent accessing undefined items
    const selectedItem = items[index]?.itemName?.toLowerCase().trim();

    const isProductAlreadyExists = allItems.some(
      (item) => item.itemName?.toLowerCase().trim() === selectedItem
    );

    if (isProductAlreadyExists) {
      setMatchingItem([]);
      setFinalItem(null);
    }

    setOpenDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleItemsMatch = () => {
    if (!invoiceSelectedItem || !invoiceSelectedItem.itemName) {
      console.error("No invoice item available.");
      return;
    }
    if (!allItems || allItems.length === 0) {
      console.error("No item data available.");
      return;
    }

    const invoiceItemName = invoiceSelectedItem.itemName.trim().toLowerCase();
    const invoiceWords = invoiceItemName.split(/\s+/); // Split words

    const matches = allItems.filter((item) => {
      const normalizedItemName = item.itemName.trim().toLowerCase();
      return (
        normalizedItemName.includes(invoiceItemName) ||
        invoiceItemName.includes(normalizedItemName) ||
        invoiceWords.some((word) => normalizedItemName.includes(word))
      );
    });

    const calculateSimilarity = (name: string) => {
      name = name.toLowerCase();

      if (name === invoiceItemName) return 100;

      if (name.startsWith(invoiceItemName)) return 90;

      if (name.includes(invoiceItemName)) return 80;

      const matchingWords = invoiceWords.filter((word) =>
        name.includes(word)
      ).length;
      return matchingWords * 10;
    };

    const sortedMatches = matches.sort((a, b) => {
      return calculateSimilarity(b.itemName) - calculateSimilarity(a.itemName);
    });

    setMatchingItem(sortedMatches);
  };

  const handleConfirmSelection = (selectedIndex: number) => {
    if (!finalItem || !invoice) {
      console.error("No item selected or invoice is missing.");
      return;
    }
    console.log(finalItem, "final item");

    const updatedInvoiceItems = invoice.invoice?.items?.map(
      (item: Item, index: number) =>
        index === selectedIndex
          ? {
              ...item,
              itemName: finalItem.itemName,
              itemId: finalItem._id,
              itemSgst: finalItem.sgst,
              itemCgst: finalItem.cgst,
              itemIgst: finalItem.igst,
              itemTax: finalItem.igst,
              hsn_sac:finalItem.hsnCode
            }
          : item
    );
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
  }, [allItems, items, openDropdownIndex]);

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
                className={`border px-4 py-3 whitespace-nowrap cursor-pointer relative ${
                  openDropdownIndex === index
                    ? "border-[#F4F4F4] bg-lightPink"
                    : "border-[#F4F4F4]"
                }`}
              >
                <div>
                  {item.itemName}
                  {openDropdownIndex === index && (
                    <div
                      className="absolute z-10  -ms-5 bg-white rounded-md mt-3.5 p-2 space-y-1 max-h-72 overflow-y-auto hide-scrollbar"
                      style={{ boxShadow: "1px 1px 5px 0.5px", width: "500px" }}
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
                        <div
                          className="flex w-full"
                          onClick={() => handleExpand("dropdown1")}
                        >
                          <div className="flex items-center px-3 text-loremcolor text-sm">
                            {finalItem?.itemName
                              ? finalItem.itemName
                              : " Select Product"}
                          </div>
                          <div className="items-center justify-end ml-auto flex pe-2 ">
                            <CehvronDown color="gray" />
                          </div>
                        </div>
                      </div>
                      {expandDropDown === "dropdown1" && (
                        <div className="space-y-1">
                          {matchingItem?.length > 0 ? (
                            matchingItem.map((item: any, index: number) => (
                              <div
                                className="px-3 py-2 text-loremcolor text-sm bg-[#f2f2f2]"
                                key={item._id}
                              >
                                <div className="flex items-center">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFinalItem(item);
                                      handleExpand("dropdown1");
                                    }}
                                  >
                                    {item.itemName}
                                  </button>
                                  <button
                                    className="ml-auto"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleItemDetailExpand(index);
                                    }}
                                  >
                                    <div
                                      className={
                                        expandedItemIndex === index
                                          ? "rotate-180 transition-transform"
                                          : "transition-transform"
                                      }
                                    >
                                      {" "}
                                      <CheveronDownIcon color={"gray"} />
                                    </div>
                                  </button>
                                </div>

                                {/* Expand Details Only for the Active Item */}
                                {expandedItemIndex === index && (
                                  <div className="grid grid-cols-4 gap-4 text-xs text-[#8f96ab] mt-2">
                                    <div className="text-start">
                                      <div className="flex items-center gap-1">
                                        <DotIcon color={"#8f96ab"} size={12} />
                                        Purchase Rate
                                      </div>
                                      <p className="ms-3 text-[#343e50] font-bold">
                                        {item.costPrice}
                                      </p>
                                    </div>
                                    <div className="text-start">
                                      <div className="flex items-center gap-1">
                                        <DotIcon color={"#8f96ab"} size={12} />
                                        Sales Rate
                                      </div>
                                      <p className="ms-3 text-[#343e50] font-bold">
                                        {item.sellingPrice}
                                      </p>
                                    </div>
                                    <div className="text-start">
                                      <div className="flex items-center gap-1">
                                        <DotIcon color={"#8f96ab"} size={12} />
                                        MRP
                                      </div>
                                      <p className="ms-3 text-[#343e50] font-bold">
                                        {item.saleMrp}
                                      </p>
                                    </div>
                                    <div className="text-start">
                                      <div className="flex items-center gap-1">
                                        <DotIcon color={"#8f96ab"} size={12} />
                                        HSN
                                      </div>
                                      <p className="ms-3 text-[#343e50] font-bold">
                                        {item.hsnCode}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center px-3 text-loremcolor h-9 bg-[#f2f2f2]">
                              <p className="text-darkRed">
                                No Matching Items in the Inventory..!
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex justify-end py-3 gap-2">
                        <Button variant="secondary" size="sm">
                          Cancel
                        </Button>
                        <button
                          className="bg-[#32A370] px-2 rounded-md text-white font-semibold flex items-center justify-center gap-1"
                          onClick={() => {
                            handleConfirmSelection(openDropdownIndex!),
                              toggleDropdown(index);
                          }}
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
                        <AddNewItem selectedItem={invoiceSelectedItem} />
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.hsn_sac || "-"}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.itemQuantity}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.itemCostPrice ? item.itemCostPrice : "-"}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.gross ? item.gross : "-"}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.itemDiscount ? item.itemDiscount : "-"}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.net_amount ? item.net_amount : "-"}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.itemTax ? item.itemTax : "-"}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.itemCgstAmount ? item.itemCgstAmount : "-"}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.itemAmount ? item.itemAmount : "-"}
              </td>
              <td className="border border-[#F4F4F4] px-4 py-3 whitespace-nowrap">
                {item.batch_no || "-"}
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
