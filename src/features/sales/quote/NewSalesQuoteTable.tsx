import { useEffect, useRef, useState } from "react";
import { newPurchaseOrderTableHead } from "../../../assets/constants";
import TrashCan from "../../../assets/icons/TrashCan";
import ChevronDown from "../../../assets/icons/CehvronDown";
import SearchBar from "../../../Components/SearchBar";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";
import PlusCircle from "../../../assets/icons/PlusCircle";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { SalesQuote } from "../../../Types/SalesQuote";

type Row = {
  itemId: string;
  itemImage?: string,
  itemName: string;
  quantity: string;
  sellingPrice: string;
  taxPreference: string;
  taxGroup: string;
  cgst: string;
  sgst: string;
  igst: string;
  cgstAmount: string;
  sgstAmount: string;
  igstAmount: string;
  vatAmount: string | number;
  itemTotaltax: string;
  discountType: string;
  discountAmount: string;
  amount: string;
  itemAmount: string;
  itemStock: string;
};

type Props = {
  salesQuoteState?: any;
  isIntraState?: Boolean;
  setSalesQuoteState?: (value: any) => void;
  oneOrganization?: any;
  isPlaceOfSupplyVisible?: boolean
};


const NewSalesQuoteTable = ({
  salesQuoteState,
  setSalesQuoteState,
  isIntraState,
  oneOrganization,
  isPlaceOfSupplyVisible,
}: Props) => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [openDropdownType, setOpenDropdownType] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [items, setItems] = useState<any>([]);
  // const { request: getAllItemsRequest } = useApi("get", 5003);
  const { request: getallItemSales } = useApi("get", 5003);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [rows, setRows] = useState<Row[]>([
    {
      itemId: "",
      itemImage: "",
      itemName: "",
      quantity: "",
      sellingPrice: "",
      taxPreference: "",
      taxGroup: "",
      cgst: "",
      sgst: "",
      igst: "",
      cgstAmount: "",
      sgstAmount: "",
      igstAmount: "",
      vatAmount: 0,
      itemTotaltax: "",
      discountType: "Percentage",
      discountAmount: "",
      amount: "",
      itemAmount: "",
      itemStock: "",
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

  const addRow = () => {
    const newRow: any = {
      itemId: "",
      itemImage: "",
      itemName: "",
      quantity: "",
      sellingPrice: "",
      taxPreference: "",
      taxGroup: "",
      cgst: "",
      sgst: "",
      igst: "",
      cgstAmount: "",
      sgstAmount: "",
      igstAmount: "",
      vatAmount: "",
      itemTotaltax: "",
      discountType: "Percentage",
      discountAmount: "",
      amount: "",
      itemAmount: "",
      itemStock: "",
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
    newRows[index].sellingPrice = item.sellingPrice || "0";
    newRows[index].quantity = "1";
    newRows[index].itemId = item._id;
    newRows[index].cgst = item.cgst;
    newRows[index].sgst = item.sgst;
    newRows[index].igst = item.igst;
    newRows[index].taxPreference = item.taxPreference;
    newRows[index].taxGroup = item.taxRate;
    newRows[index].itemStock = item.currentStock;


    const sellingPrice = parseFloat(newRows[index].sellingPrice);
    const discountedPrice = calculateDiscountPrice(
      sellingPrice,
      newRows[index].discountAmount,
      newRows[index].discountType
    );

    const { itemAmount, cgstAmount, sgstAmount, igstAmount } = calculateTax(
      discountedPrice,
      newRows[index],
      isIntraState as boolean
    );

    newRows[index].amount = itemAmount;

    newRows[index].cgstAmount = isPlaceOfSupplyVisible ? cgstAmount : "0";
    newRows[index].sgstAmount = isPlaceOfSupplyVisible ? sgstAmount : "0";
    newRows[index].igstAmount = isPlaceOfSupplyVisible ? igstAmount : igstAmount;

    newRows[index].itemAmount =
      !isPlaceOfSupplyVisible
        ? parseFloat(itemAmount).toFixed(2)
        : !isIntraState
          ? (parseFloat(itemAmount) + parseFloat(cgstAmount) + parseFloat(sgstAmount)).toFixed(2)
          : (parseFloat(itemAmount) + parseFloat(igstAmount)).toFixed(2);

    setRows(newRows);

    setSalesQuoteState?.((prevData: any) => ({
      ...prevData,
      items: newRows.map((row) => {
        const updatedItem = { ...row };
        delete updatedItem.itemImage;
        return updatedItem;
      }),
    }));
  };


  const calculateDiscountPrice = (
    totalSellingPrice: number,
    discountAmount: string,
    discountType: string
  ): number => {
    let discount = parseFloat(discountAmount) || 0;
    if (discount < 0) {
      toast.error("Discount cannot be negative");
      return totalSellingPrice;
    }

    if (discountType === "Percentage") {
      if (discount > 100) {
        discount = 100;
        toast.error("Discount cannot exceed 100%");
      }
      return totalSellingPrice - (totalSellingPrice * discount) / 100;
    } else {
      if (discount > totalSellingPrice) {
        discount = totalSellingPrice;
        toast.error("Discount cannot exceed the selling price");
      }
      return totalSellingPrice - discount;
    }
  };

  const calculateTax = (
    discountedPrice: number,
    item: any,
    isIntraState: boolean
  ) => {


    const cgstPercentage = parseFloat(item?.cgst || "0");
    const sgstPercentage = parseFloat(item?.sgst || "0");
    const igstPercentage = parseFloat(item?.igst || "0");

    if (!isIntraState) {
      const cgstAmount = ((discountedPrice * cgstPercentage) / 100).toFixed(2);
      const sgstAmount = ((discountedPrice * sgstPercentage) / 100).toFixed(2);
      return {
        itemAmount: discountedPrice.toFixed(2),
        cgstAmount,
        sgstAmount,
        igstAmount: "0.00",
      };
    } else {
      const igstAmount = ((discountedPrice * igstPercentage) / 100).toFixed(2);
      return {
        itemAmount: discountedPrice.toFixed(2),
        cgstAmount: "0.00",
        sgstAmount: "0.00",
        igstAmount,
      };
    }
  };

  const handleRowChange = (index: number, field: keyof Row, value: string) => {
    const newRows = [...rows];
    const currentStock = parseFloat(newRows[index].itemStock) || 0;
    const enteredQuantity = parseFloat(value) || 0;

    if (field === "quantity" && enteredQuantity > currentStock) {
      toast.error("Quantity exceeds available stock!");
      return;
    }

    newRows[index] = { ...newRows[index], [field]: value };

    const quantity = parseFloat(newRows[index].quantity) || 0;
    const sellingPrice = parseFloat(newRows[index].sellingPrice) || 0;
    const totalSellingPrice = quantity * sellingPrice;

    const discountedPrice = calculateDiscountPrice(
      totalSellingPrice,
      newRows[index].discountAmount,
      newRows[index].discountType
    );

    const { itemAmount, cgstAmount, sgstAmount, igstAmount } = calculateTax(
      discountedPrice,
      newRows[index],
      isIntraState as boolean
    );

    newRows[index].amount = itemAmount;

    if (isPlaceOfSupplyVisible) {
      newRows[index].cgstAmount = cgstAmount;
      newRows[index].sgstAmount = sgstAmount;
      newRows[index].igstAmount = igstAmount;
    } else {
      newRows[index].cgstAmount = "0";
      newRows[index].sgstAmount = "0";
      newRows[index].igstAmount = igstAmount;
    }

    newRows[index].itemAmount = !isPlaceOfSupplyVisible
      ? parseFloat(itemAmount).toFixed(2)
      : !isIntraState
        ? (parseFloat(itemAmount) + parseFloat(cgstAmount) + parseFloat(sgstAmount)).toFixed(2)
        : (parseFloat(itemAmount) + parseFloat(igstAmount)).toFixed(2);

    setRows(newRows);

    setSalesQuoteState?.((prevData: any) => ({
      ...prevData,
      items: newRows.map((row) => {
        const updatedItem = { ...row };
        delete updatedItem.itemImage;
        return updatedItem;
      }),
    }));
  };

  useEffect(() => {
    const updateItemAmounts = (rows: any[], isIntraState: boolean, isPlaceOfSupplyVisible: boolean) => {
      return rows.map((row) => {
        const sellingPrice = parseFloat(row.sellingPrice) || 0;
        const qty = parseFloat(row.quantity) || 1;
        const discountedPrice = calculateDiscountPrice(
          sellingPrice,
          row.discountAmount,
          row.discountType
        );

        const { itemAmount, cgstAmount, sgstAmount, igstAmount } = calculateTax(
          discountedPrice,
          row,
          isIntraState
        );

        const finalItemAmount = !isPlaceOfSupplyVisible
          ? (parseFloat(itemAmount) * qty).toFixed(2)
          : !isIntraState
            ? ((parseFloat(itemAmount) + parseFloat(cgstAmount) + parseFloat(sgstAmount)) * qty).toFixed(2)
            : ((parseFloat(itemAmount) + parseFloat(igstAmount)) * qty).toFixed(2);

        return {
          ...row,
          amount: (parseFloat(itemAmount) * qty).toFixed(2),
          cgstAmount: isPlaceOfSupplyVisible ? (parseFloat(cgstAmount) * qty).toFixed(2) : "0",
          sgstAmount: isPlaceOfSupplyVisible ? (parseFloat(sgstAmount) * qty).toFixed(2) : "0",
          igstAmount: isPlaceOfSupplyVisible ? (parseFloat(igstAmount) * qty).toFixed(2) : igstAmount,
          itemAmount: finalItemAmount,
        };
      });
    };

    const updatedRows = updateItemAmounts(rows, isIntraState as boolean, isPlaceOfSupplyVisible as boolean);

    if (JSON.stringify(rows) !== JSON.stringify(updatedRows)) {
      setRows(updatedRows);

      setSalesQuoteState?.((prevData: any) => ({
        ...prevData,
        items: updatedRows.map((row) => {
          const updatedItem = { ...row };
          delete updatedItem.itemImage;
          return updatedItem;
        }),
        totalTax: updatedRows.reduce((total, row) => {
          return total + parseFloat(row.cgstAmount) + parseFloat(row.sgstAmount) + parseFloat(row.igstAmount);
        }, 0).toFixed(2),
      }));
    }
  }, [isIntraState, isPlaceOfSupplyVisible, rows]);


  const getAllItems = async () => {
    try {
      const url = `${endponits.GET_ALL_ITEMS_SALES}`;
      const apiResponse = await getallItemSales(url);
      const { response, error } = apiResponse;

      if (!error && response) {
        console.log(response.data, "itemsasales");
        setItems(response.data);
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
          itemImage: "",
          itemName: "",
          quantity: "",
          sellingPrice: "",
          taxPreference: "",
          taxGroup: "",
          cgst: "0",
          sgst: "0",
          igst: "0",
          cgstAmount: "",
          sgstAmount: "",
          igstAmount: "",
          vatAmount: "",
          itemTotaltax: "",
          discountType: "Percentage",
          discountAmount: "",
          amount: "0",
          itemAmount: "0",
          itemStock: "",
        },
      ];
      setRows(newRows);
    }
  };

  const calculateTotalSGST = () => {
    return rows.reduce((total, row) => {
      const sgst = !isIntraState ? parseFloat(row.sgstAmount) || 0 : 0;
      return total + sgst;
    }, 0);
  };

  // Function to calculate total CGST
  const calculateTotalCGST = () => {
    return rows.reduce((total, row) => {
      // console.log(row.itemCgst,"cgst");

      const cgst = !isIntraState ? parseFloat(row.cgstAmount) || 0 : 0;
      return total + cgst;
    }, 0);
  };

  // Function to calculate total IGST
  const calculateTotalIGST = () => {
    return rows.reduce((total, row) => {
      const igst = isIntraState ? parseFloat(row.igstAmount) || 0 : 0;
      return total + igst;
    }, 0);
  };

  // Function to calculate total item quantity
  const calculateTotalQuantity = () => {
    return rows.reduce((total, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      return total + quantity;
    }, 0);
  };

  const calculateDiscount = () => {
    return rows.reduce((total, row) => {
      const discount = parseFloat(row.discountAmount) || 0;
      const quantity = parseFloat(row.quantity) || 0;
      const sellingPrice = parseFloat(row.sellingPrice) || 0;

      const totalSellingPrice = sellingPrice * quantity;

      if (row.discountType === "Percentage") {
        return total + (totalSellingPrice * discount) / 100;
      } else {
        return total + discount;
      }
    }, 0);

    return 0;
  };

  // Function to calculate the total subtotal
  const calculateTotalSubtotal = () => {
    return rows.reduce((total, row) => {
      const itemQuantity = parseFloat(row.quantity) || 0;
      const itemPrice = parseFloat(row.sellingPrice) || 0;
      const subtotal = itemQuantity * itemPrice;
      return total + subtotal;
    }, 0);
  };

  useEffect(() => {
    const totalQuantity = calculateTotalQuantity();
    const totalSGST = calculateTotalSGST();
    const totalCGST = calculateTotalCGST();
    const totalIGST = calculateTotalIGST();
    const totalSellingPrice = calculateTotalSubtotal();
    const totalDiscount = calculateDiscount();

    const updatedItems = salesQuoteState?.items.map((item: any) => {
      const itemCGST = parseFloat(item.cgstAmount) || 0;
      const itemSGST = parseFloat(item.sgstAmount) || 0;
      const itemIGST = parseFloat(item.igstAmount) || 0;

      const itemTotaltax = isIntraState ? itemIGST : itemCGST + itemSGST;
      // const totalAmount = (parseFloat(item.amount) || 0) + (itemTotaltax) || 0;
      // console.log(totalAmount);

      return {
        ...item,
        itemTotaltax: itemTotaltax.toFixed(2),
        // itemAmount: totalAmount.toFixed(2),
      };
    });
    setSalesQuoteState?.((prevData: SalesQuote) => ({
      ...prevData,
      totalItem: totalQuantity,
      sgst: totalSGST.toFixed(2),
      cgst: totalCGST.toFixed(2),
      igst: totalIGST.toFixed(2),
      subtotalTotal: totalSellingPrice.toFixed(2),
      totalItemDiscount: totalDiscount.toFixed(2),
      totalTax: (isIntraState
        ? totalIGST
        : totalSGST + totalCGST).toFixed(2),
      itemTotaltax: (isIntraState
        ? totalIGST
        : totalSGST + totalCGST).toFixed(2),
      items: updatedItems,
      subTotal: (totalSellingPrice + (isIntraState
        ? totalIGST
        : totalSGST + totalCGST) - totalDiscount).toFixed(2),
    }));
  }, [rows]);

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
    if (salesQuoteState?.items) {
      setRows(salesQuoteState.items);
    }
  }, [items]);

  useEffect(() => {
    setRows((prevData: any) => {
      if (Array.isArray(prevData)) {
        return prevData?.map((item) => ({
          ...item,
          itemDiscountType: "Percentage",
          itemDiscount: "",
        }));
      }
      return [];
    });
  }, []);

  useEffect(() => {
    getAllItems()
  }, [])

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
            {rows?.map((row: any, index: number) => (
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
                        className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-[40%] space-y-1"
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
                                    Rate: RS.{item.sellingPrice}
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
                            <button className="bg-darkGreen text-darkRed rounded-lg py-4 px-6 flex ]
                            items-center text-sm font-bold border-slate-400 border gap-2 w-full hover:bg-lightRed">
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
                    type="number"
                    placeholder="0"
                    className="w-[50px]  text-center focus:outline-none "
                    value={row.quantity}
                    onChange={(e) =>
                      handleRowChange(index, "quantity", e.target.value)
                    }
                  />
                  <div className="text-center text-[10px]">
                    {" "}
                    <p>
                      Stock OnHand: &nbsp;
                      <b className="text-[12px]">{row.itemStock}</b>{" "}
                    </p>
                  </div>
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    type="text"
                    placeholder="0"
                    className="w-[50px]  focus:outline-none text-center"
                    value={row.sellingPrice}
                    onChange={(e) =>
                      handleRowChange(index, "sellingPrice", e.target.value)
                    }
                    disabled
                  />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    disabled
                    type="number"
                    placeholder="0"
                    className="w-[50px] focus:outline-none text-center"
                    value={
                      !isPlaceOfSupplyVisible
                        ? "0" // Set to 0 if place of supply is not visible
                        : !isIntraState
                          ? parseFloat(row.cgstAmount || "0") + parseFloat(row.sgstAmount || "0") === 0
                            ? "nil"
                            : (parseFloat(row.cgstAmount || "0") + parseFloat(row.sgstAmount || "0")).toFixed(2)
                          : parseFloat(row.igstAmount || "0") === 0
                            ? "nil"
                            : parseFloat(row.igstAmount || "0").toFixed(2)
                    }
                  />


                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <div className="flex items-center justify-center gap-2 w-full">
                    <input
                      type="number"
                      placeholder="0"
                      className="w-[50px]  focus:outline-none text-center"
                      value={row.discountAmount}
                      onChange={(e) =>
                        handleRowChange(index, "discountAmount", e.target.value)
                      }
                    />
                    <div className="relative">
                      <select
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            "discountType",
                            e.target.value
                          )
                        }
                        value={row.discountType}
                        className="text-xs appearance-none w-[60px] p-1 text-zinc-400 bg-white border border-inputBorder rounded-lg"
                      >
                        <option value="Percentage">%</option>
                        <option value="Currency">
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
                    type="number"
                    placeholder="0"
                    className="w-[50px]  focus:outline-none text-center"
                    value={row.amount}
                    onChange={(e) =>
                      handleRowChange(index, "amount", e.target.value)
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
          className="bg-darkGreen text-darkRed rounded-lg py-2 px-1 flex items-center text-sm font-bold"
          onClick={addRow}
        >
          <PlusCircle color="darkRed" />
          Add Item
        </button>
      </div>
    </div>
  );
};

export default NewSalesQuoteTable;