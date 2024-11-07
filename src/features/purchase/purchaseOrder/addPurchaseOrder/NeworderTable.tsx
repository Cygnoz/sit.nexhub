import { useEffect, useRef, useState } from "react";
import { newPurchaseOrderTableHead } from "../../../../assets/constants";
import TrashCan from "../../../../assets/icons/TrashCan";
import ChevronDown from "../../../../assets/icons/CehvronDown";
import SearchBar from "../../../../Components/SearchBar";
import { PurchaseOrder } from "./PurchaseOrderBody";
import { endponits } from "../../../../Services/apiEndpoints";
import useApi from "../../../../Hooks/useApi";
import PlusCircle from "../../../../assets/icons/PlusCircle";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

type Row = {
  itemImage?: string;
  itemId: string;
  itemName: string; 
  itemQuantity: number;
  itemCostPrice: number;
  itemTax:number;
  itemDiscount: number;
  itemDiscountType: string;
  itemAmount: number;
  itemSgst: number;
  itemCgst: number;
  itemIgst: number;
  itemVat: number;
  itemSgstAmount: number; 
  itemCgstAmount: number; 
  itemIgstAmount: number; 
  itemVatAmount: number;  
};

type Props = {
  purchaseOrderState?: any;
  isInterState?: Boolean;
  setPurchaseOrderState?: (value: any) => void;
  oneOrganization?: any;
  isNonTaxable?: Boolean;
};

const NewOrderTable = ({
  purchaseOrderState,
  setPurchaseOrderState,
  isInterState,
  oneOrganization,
}: Props) => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [openDropdownType, setOpenDropdownType] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [items, setItems] = useState<any>([]);
  const { request: getAllItemsRequest } = useApi("get", 5003);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [rows, setRows] = useState<Row[]>([
    {
      itemId: "",
      itemName: "",
      itemQuantity: 0,
      itemCostPrice: 0,
      itemTax: 0,
      itemDiscount: 0,
      itemDiscountType: "percentage",
      itemAmount: 0,
      itemSgst: 0,
      itemCgst: 0,
      itemIgst: 0,
      itemVat: 0,
      itemSgstAmount: 0,
      itemCgstAmount: 0,
      itemIgstAmount: 0,
      itemVatAmount: 0
    },
  ]);

  const toggleDropdown = (id: number | null, type: string | null, row: Row) => {
    if (!row.itemName) {
      setOpenDropdownId((prevId) => (prevId === id ? null : id));
      setOpenDropdownType(type);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpenDropdownId(null);
      setOpenDropdownType(null);
    }
  };

  const addRow = () => {
    const newRow: Row = {
      itemId: "",
      itemName: "",
      itemQuantity: 0,
      itemCostPrice: 0,
      itemTax: 0,
      itemDiscount: 0,
      itemDiscountType: "percentage",
      itemAmount: 0,
      itemSgst: 0,
      itemCgst: 0,
      itemIgst: 0,
      itemVat: 0,
      itemSgstAmount: 0,
      itemCgstAmount: 0,
      itemIgstAmount: 0,
      itemVatAmount: 0
    };
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
  };

  const handleItemSelect = (item: any, index: number) => {
    setOpenDropdownId(null);
    setOpenDropdownType(null);
  
    const newRows = [...rows];
    newRows[index].itemName = item.itemName;
    newRows[index].itemImage = item.itemImage;
    newRows[index].itemCostPrice = item.costPrice;
    newRows[index].itemQuantity = 1;
    newRows[index].itemId = item._id;
    newRows[index].itemCgst = item.cgst;
    newRows[index].itemSgst = item.sgst;
    newRows[index].itemIgst = item.igst;
  
    const costPrice = newRows[index].itemCostPrice;
    const discountedPrice = calculateDiscountPrice(
      costPrice,
      newRows[index].itemDiscount,
      newRows[index].itemDiscountType
    );
  
    const { itemAmount, cgstAmount, sgstAmount, igstAmount } = calculateTax(
      discountedPrice,
      newRows[index], 
      isInterState as boolean
    );

    newRows[index].itemAmount = itemAmount;
    newRows[index].itemCgstAmount = cgstAmount;
    newRows[index].itemSgstAmount = sgstAmount;
    newRows[index].itemIgstAmount = igstAmount;
    if(isInterState){
      newRows[index].itemTax=igstAmount

    }
    else{
      newRows[index].itemTax=cgstAmount+sgstAmount
    }
  
    setRows(newRows);
  
    setPurchaseOrderState?.((prevData: any) => ({
      ...prevData,
      itemTable: newRows.map((row) => {
        const updatedItem = { ...row };
        delete updatedItem.itemImage;
        return updatedItem;
      }),
    }));
  };
  
  
  const calculateDiscountPrice = (
    totalCostPrice: number,
    discountValue: number,
    discountType: string
): number => {
  let discount = typeof discountValue === 'string' ? Number(discountValue) : discountValue;
    if (discount < 0) {
        toast.error("Discount cannot be negative");
        return totalCostPrice; 
    }

    if (discountType === "percentage") {
        if (discount > 100) {
            discount = 100; 
            toast.error("Discount cannot exceed 100%");
        }
        return totalCostPrice - (totalCostPrice * discount) / 100;
    } else {
        if (discount > totalCostPrice) {
            discount = totalCostPrice; 
            toast.error("Discount cannot exceed the selling price");
        }
        return totalCostPrice - discount;
    }
};

  
  

const calculateTax = (
  discountedPrice: number,
  item: any, 
  isInterState: boolean
) => { 
  
  const cgstPercentage = item.itemCgst || 0;
  const sgstPercentage = item.itemSgst || 0;
  const igstPercentage = item.itemIgst || 0;


  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (!isInterState) {
    cgstAmount = (discountedPrice * cgstPercentage) / 100;
    sgstAmount = (discountedPrice * sgstPercentage) / 100;
  } else {
    igstAmount = (discountedPrice * igstPercentage) / 100;
  }

  return {
    itemAmount: discountedPrice,
    cgstAmount,
    sgstAmount,
    igstAmount,
  };
};

  

const handleRowChange = (index: number, field: keyof Row, value: string) => {
  const newRows = [...rows];
  newRows[index] = { ...newRows[index], [field]: value };

  const quantity = newRows[index].itemQuantity || 0;
  const costPrice = newRows[index].itemCostPrice || 0;
  const totalCostPrice = quantity * costPrice;

  const discountedPrice = calculateDiscountPrice(
    totalCostPrice,
    newRows[index].itemDiscount,
    newRows[index].itemDiscountType
  );

  // Pass the individual item to calculateTax
  const { itemAmount, cgstAmount, sgstAmount, igstAmount } = calculateTax(
    discountedPrice,
    newRows[index],
    isInterState as boolean
  );

  newRows[index].itemAmount = itemAmount;
  newRows[index].itemCgstAmount = cgstAmount;
  newRows[index].itemSgstAmount = sgstAmount;
  newRows[index].itemIgstAmount = igstAmount;

  setRows(newRows);

  setPurchaseOrderState?.((prevData: any) => ({
    ...prevData,
    itemTable: newRows.map((row) => {
      const updatedItem = { ...row };
      delete updatedItem.itemImage;
      return updatedItem;
    }),
  }));
};

  
  


  const getAllItems = async () => {
    try {
      const url = `${endponits.GET_ALL_ITEM}`;
      const apiResponse = await getAllItemsRequest(url);
      // console.log(apiResponse, "api response");
      const { response, error } = apiResponse;

      if (!error && response) {
        setItems(response.data);
        // console.log(response);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      const newRows = rows.filter((_, i) => i !== index);
      setRows(newRows);
    } else {
      const newRows = [
        {
          itemId: "",
          itemName: "",
          itemQuantity: 0,
          itemCostPrice: 0,
          itemTax: 0,
          itemDiscount: 0,
          itemDiscountType: "percentage",
          itemAmount: 0,
          itemSgst: 0,
          itemCgst: 0,
          itemIgst: 0,
          itemVat: 0,
          itemSgstAmount: 0,
          itemCgstAmount: 0,
          itemIgstAmount: 0,
          itemVatAmount: 0
        },
      ];
      setRows(newRows);
    }
  };

  const calculateTotalSGST = () => {
    return rows.reduce((total, row) => {
      const sgst = !isInterState ? (row.itemSgstAmount) || 0 : 0;
      return total + sgst;
    }, 0);
  };

  // Function to calculate total CGST
  const calculateTotalCGST = () => {
    return rows.reduce((total, row) => {
      console.log(row.itemCgstAmount,"total cgst");

      const cgst = !isInterState ? (row.itemCgstAmount) || 0 : 0;
      return total + cgst;
    }, 0);
  };

  // Function to calculate total IGST
  const calculateTotalIGST = () => {
    return rows.reduce((total, row) => {
      const igst = isInterState ? (row.itemIgstAmount) || 0 : 0;
      return total + igst;
    }, 0);
  };

  // Function to calculate total item quantity
  const calculateTotalQuantity = () => {
    return rows.reduce((total, row) => {
      const quantity = parseFloat(row.itemQuantity?.toString() || '0'); 
      return total + quantity;
    }, 0);
  };
  
  const calculateDiscount = () => {
    const totalDiscount = rows.reduce((total, row) => {
      const discount = Number(row.itemDiscount) || 0; 
            const quantity = row.itemQuantity || 0;
      const costPrice = row.itemCostPrice || 0;
  
      const totalCostPrice = costPrice * quantity;
  
      if (row.itemDiscountType === "percentage") {
        return total + (totalCostPrice * discount) / 100;
      } else {
        return total + discount;
      }
    }, 0);
  
    const roundedTotalDiscount = Math.round(totalDiscount * 100) / 100;
  
    return roundedTotalDiscount;
  };
  

  // Function to calculate the total subtotal
  const calculateTotalSubtotal = () => {
    return rows.reduce((total, row) => {
      const itemQuantity = (row.itemQuantity) || 0;
      const itemPrice = (row.itemCostPrice) || 0;
      const subtotal = itemQuantity * itemPrice;
      return total + subtotal;
    }, 0);
  };
  const filteredItems = () => {
    return items.filter((item: any) => {
      const isSelected = rows.find((row) => row.itemId === item._id);
      return (
        !isSelected &&
        item.itemName.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
  };

  useEffect(() => {
    if (openDropdownId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

  useEffect(() => {
    const updatedRows = rows.map((row) => {
      const discountedPrice = calculateDiscountPrice(
        row.itemCostPrice * row.itemQuantity, 
        row.itemDiscount,
        row.itemDiscountType
      );
  
      const taxDetails = calculateTax(
        discountedPrice,
        row, 
        isInterState as boolean
      );
  
      return {
        ...row,

        itemAmount: taxDetails.itemAmount, 
        itemCgstAmount: taxDetails.cgstAmount,
        itemSgstAmount: taxDetails.sgstAmount,
        itemIgstAmount: taxDetails.igstAmount,
      };
    });
  
    setRows(updatedRows);
  }, [
    purchaseOrderState?.destinationOfSupply,
    purchaseOrderState?.sourceOfSupply,
    isInterState,
  ]);
  
  

  useEffect(() => {
      const updatedRows = rows.map((row) => ({
        ...row,
        itemDiscountType: "",
        itemDiscount: 0,
      }));

      setRows(updatedRows);

      setPurchaseOrderState?.((prevData: any) => ({
        ...prevData,
        itemTable: updatedRows.map((row) => {
          const updatedItem = { ...row };
          delete updatedItem.itemImage;
          return updatedItem;
        }),
      }));
    
  }, []);

  useEffect(() => {
    const totalQuantity = calculateTotalQuantity();
    const totalSGST = calculateTotalSGST();
    const totalCGST = calculateTotalCGST();
    const totalIGST = calculateTotalIGST();
    const totalSellingPrice = calculateTotalSubtotal();
    const totalDiscount = calculateDiscount();
  
    setPurchaseOrderState?.((prevData: PurchaseOrder) => ({
      ...prevData,
      totalItem: totalQuantity,
      sgst: totalSGST,
      cgst: totalCGST,
      igst: totalIGST,
      subTotal: totalSellingPrice,
      itemTotalDiscount: totalDiscount,
      totalTaxAmount: isInterState 
      ? totalIGST 
      : totalSGST + totalCGST,    }));
  }, [rows]);  
  

  useEffect(() => {
      setRows((prevData: any) => {
        if (Array.isArray(prevData)) {
          return prevData.map((item) => ({
            ...item,
            itemDiscountType: "percentage",
            itemDiscount: "",
          }));
        }
        return [];
      });
    
  }, []);

  useEffect(() => {
    getAllItems();
  }, []);

  return (
    <div>
      <div className="rounded-lg border-2 border-tableBorder mt-5">
        <table className="min-w-full bg-white rounded-lg relative pb-4 border-dropdownText">
          <thead className="text-[12px] text-center text-dropdownText">
            <tr className="bg-lightPink">
              {newPurchaseOrderTableHead.map((item, index) => (
                  <th
                    className="py-2 px-4 font-medium border-b border-tableBorder relative"
                    key={index}
                  >
                    {item}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px] ">
            {rows.map((row: any, index: number) => (
              <tr key={index}>
                <td className="border-y py-3 px-2 border-tableBorder">
                  <div
                    className="relative w-full"
                    onClick={() => toggleDropdown(index, "searchProduct", row)}
                  >
                    {row.itemName ? (
                      <div className="cursor-pointer gap-2 grid grid-cols-12 appearance-none items-center justify-center h-9 text-zinc-400 bg-white text-sm">
                        <div className="flex items-start col-span-4">
                          <img
                            className="rounded-full h-10 w-10 "
                            src={row.itemImage}
                            alt=""
                          />
                        </div>
                        <div className="col-span-8  text-start">
                          <p className="text-textColor">{row.itemName}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="cursor-pointer flex appearance-none items-center justify-center h-9 text-zinc-400 bg-white text-sm">
                        <p>Type or click</p>
                        <ChevronDown color="currentColor" />
                      </div>
                    )}
                  </div>
                  {openDropdownId === index &&
                    openDropdownType === "searchProduct" && (
                      <div
                        ref={dropdownRef}
                        className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-[30%] space-y-1"
                      >
                        <SearchBar
                          searchValue={searchValue}
                          onSearchChange={setSearchValue}
                          placeholder="Select Item"
                        />
                        {items.length > 0 ? (
                          filteredItems().map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                              onClick={() => handleItemSelect(item, index)}
                            >
                              <div className="col-span-2 flex justify-center">
                                <img
                                  className="rounded-full h-10"
                                  src={item.itemImage}
                                  alt=""
                                />
                              </div>
                              <div className="col-span-10 flex">
                                <div className="text-start">
                                  <p className="font-bold text-sm text-black">
                                    {item.itemName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Rate: {item.sellingPrice}
                                  </p>
                                </div>
                                <div className="ms-auto text-2xl cursor-pointer relative -mt-2 pe-2">
                                  &times;
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center border-slate-400 border rounded-lg">
                            <p className="text-[red] text-sm py-4">
                              Items Not Found!
                            </p>
                          </div>
                        )}
                        <div>
                          <Link to={"/inventory/Item/new"}>
                            <button className="bg-darkGreen text-darkRed rounded-lg py-4 px-6 flex items-center text-sm font-bold border-slate-400 border gap-2 w-full hover:bg-lightRed">
                              <PlusCircle color="darkRed" />
                              <p> Add New Item</p>
                            </button>
                          </Link>
                        </div>
                      </div>
                    )}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    type="text"
                    placeholder="0"
                    className="w-[50px]  focus:outline-none text-center"
                    value={row.itemQuantity || ""}
                    onChange={(e) =>
                      handleRowChange(index, "itemQuantity", e.target.value)
                    }
                  />
               
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    type="text"
                    placeholder="0"
                    className="w-[50px]  focus:outline-none text-center"
                    value={row.itemCostPrice}
                    onChange={(e) =>
                      handleRowChange(index, "itemCostPrice", e.target.value)
                    }
                    disabled
                  />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {
                   <input
                   disabled
                   type="text"
                   placeholder="0"
                   className="w-[50px] focus:outline-none text-center"
                   value={
                     !isInterState
                       ? (
                           ((row.itemCgstAmount) || 0) + ((row.itemSgstAmount) || 0) === 0
                             ? "nil"
                             : ((row.itemCgstAmount) + (row.itemSgstAmount))
                         )
                       : ((row.itemIgstAmount) || 0) === 0
                       ? "nil"
                       : (row.itemIgstAmount)
                   }
                 />
                 
                 
                  }
                </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    <div className="flex items-center justify-center gap-2 w-full">
                      <input
                        type="text"
                        placeholder="0"
                        className="w-[50px]  focus:outline-none text-center"
                        value={row.itemDiscount}
                        onChange={(e) =>
                          handleRowChange(index, "itemDiscount", e.target.value)
                        }
                      />
                      <div className="relative">
                        <select
                          onChange={(e) =>
                            handleRowChange(
                              index,
                              "itemDiscountType",
                              e.target.value
                            )
                          }
                          value={row.itemDiscountType}
                          className="text-xs appearance-none w-[60px] p-1 text-zinc-400 bg-white border border-inputBorder rounded-lg"
                        >
                          <option value="percentage">%</option>
                          <option value="currency">
                            {oneOrganization?.baseCurrency}
                          </option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <ChevronDown color="gray" height={15} width={15} />
                        </div>
                      </div>
                    </div>
                  </td>
                

                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    disabled
                    type="text"
                    placeholder="0"
                    className="w-[50px]  focus:outline-none text-center"
                    value={row.itemAmount}
                    onChange={(e) =>
                      handleRowChange(index, "itemAmount", e.target.value)
                    }
                  />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <div
                    className="text-center flex justify-center gap-2"
                    onClick={() => removeRow(index)}
                  >
                    <TrashCan color="darkRed" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-[60%] mt-0">
        <button
          type="button"
          className="bg-darkGreen text-darkRed rounded-lg py-2 px-6 flex items-center text-sm font-bold"
          onClick={addRow}
        >
          <PlusCircle color="darkRed" />
          Add Item
        </button>
      </div>
    </div>
  );
};

export default NewOrderTable;
