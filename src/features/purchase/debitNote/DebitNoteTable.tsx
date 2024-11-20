import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import { DebitNoteBody } from "../../../Types/DebitNot";
import { newDebitTableHead } from "../../../assets/constants";
import CheveronDownIcon from "../../../assets/icons/CheveronDownIcon";
import SearchBar from "../../../Components/SearchBar";
import PlusCircle from "../../../assets/icons/PlusCircle";
import TrashCan from "../../../assets/icons/TrashCan";

type Row = {
  itemImage?: string;
  itemId: string;
  itemName: string; 
  itemQuantity: number  | string;
  itemCostPrice: number | string;
  itemTax:number | string;
  itemAmount: number | string;
  itemSgst: number | string;
  itemCgst: number | string;
  itemIgst: number | string;
  itemVat: number | string;
  itemSgstAmount: number | string; 
  itemCgstAmount: number | string; 
  itemIgstAmount: number | string; 
  itemVatAmount: number | string; 
  itemPurchaseQuantity:number | string; 
  taxPreference:string
};

type Props = {
  purchaseOrderState?: any;
  isInterState?: Boolean;
  setPurchaseOrderState?: (value: any) => void;
  oneOrganization?: any;
  isNonTaxable?: Boolean;
  selectedBill?:any
};

const DebitNoteTable = ({
  purchaseOrderState,
  setPurchaseOrderState,
  isInterState,
  selectedBill
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
      itemQuantity: "",
      itemCostPrice: "",
      itemTax: "",
      itemAmount: "",
      itemSgst: "",
      itemCgst: "",
      itemIgst: "",
      itemVat: "",
      itemSgstAmount: "",
      itemCgstAmount: "",
      itemIgstAmount: "",
      itemVatAmount: "",
      itemPurchaseQuantity:"",
      taxPreference:""
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
      itemQuantity: "",
      itemCostPrice: "",
      itemTax: "",
      itemAmount: "",
      itemSgst: "",
      itemCgst: "",
      itemIgst: "",
      itemSgstAmount: "",
      itemCgstAmount: "",
      itemIgstAmount: "",
      itemVat:"",
      itemVatAmount:"",
      itemPurchaseQuantity:"",
      taxPreference:"",
    };
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
  };

  const handleItemSelect = (item: any, index: number) => {
    setOpenDropdownId(null);
    setOpenDropdownType(null);
    console.log(item,"item")


    const newRows = [...rows];
    newRows[index].itemName = item.itemName;
    newRows[index].itemCostPrice = item.costPrice;
    newRows[index].itemQuantity = 1;
    newRows[index].itemId = item.itemId;
    newRows[index].itemCgst = item.itemCgst;
    newRows[index].itemSgst = item.itemSgst;
    newRows[index].itemIgst = item.itemIgst;
    newRows[index].itemAmount = item.itemAmount;
    newRows[index].itemCostPrice = item.itemCostPrice;
    newRows[index].itemPurchaseQuantity=item.itemQuantity;
    newRows[index].taxPreference=item.taxPreference;


    const costPrice = Number(newRows[index].itemCostPrice);
    const quantity = Number(newRows[index].itemQuantity);
    const totalCostPrice = quantity * costPrice;

    const { itemAmount, cgstAmount, sgstAmount, igstAmount } = calculateTax(
      totalCostPrice,
      newRows[index],
      isInterState as boolean
    );

    newRows[index].itemAmount = itemAmount;
    newRows[index].itemCgstAmount = cgstAmount;
    newRows[index].itemSgstAmount = sgstAmount;
    newRows[index].itemIgstAmount = igstAmount;
    
    console.log(igstAmount, sgstAmount,cgstAmount,"igstsvdjgjgh")

    if (isInterState) {
      newRows[index].itemTax = igstAmount;
      newRows[index].itemCgstAmount = "";
      newRows[index].itemSgstAmount = "";
    } else {
      newRows[index].itemTax = cgstAmount + sgstAmount;
      newRows[index].itemIgstAmount = "";
    }

    setRows(newRows);

    

    setPurchaseOrderState?.((prevData: any) => ({
      ...prevData,
      items: newRows.map((row) => {
        const updatedItem = { ...row };
        delete updatedItem.itemImage;
        return updatedItem;
      }),
    }));
  };

  const calculateTax = (
    totalCostPrice: number,
    item: any,
    isInterState: boolean
  ) => {

    const cgstPercentage = item.itemCgst || 0;
    const sgstPercentage = item.itemSgst || 0;
    const igstPercentage = item.itemIgst || 0;

    console.log(cgstPercentage,sgstPercentage,igstPercentage,"qwertyui")


    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    if (!isInterState) {
      cgstAmount = (totalCostPrice * cgstPercentage) / 100;
      sgstAmount = (totalCostPrice * sgstPercentage) / 100;
    } else {
      igstAmount = (totalCostPrice * igstPercentage) / 100;
    }

    return {
      itemAmount: totalCostPrice,
      cgstAmount,
      sgstAmount,
      igstAmount,
    };
  };

  const handleRowChange = (index: number, field: keyof Row, value: string) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };

    const quantity = Number(newRows[index].itemQuantity);
    const costPrice = Number(newRows[index].itemCostPrice);
    const purchaseQuantity = Number(newRows[index].itemPurchaseQuantity);

    if (quantity > purchaseQuantity) {
      newRows[index].itemQuantity = purchaseQuantity.toString()
      
      toast.error("The entered quantity exceeds available stock."); 
      return; 
    }

    const totalCostPrice = quantity * costPrice;

    const { itemAmount, cgstAmount, sgstAmount, igstAmount } = calculateTax(
      totalCostPrice,
      newRows[index],
      isInterState as boolean
    );

    newRows[index].itemAmount = itemAmount;
    newRows[index].itemCgstAmount = cgstAmount;
    newRows[index].itemSgstAmount = sgstAmount;
    newRows[index].itemIgstAmount = igstAmount;
    if(isInterState){
      newRows[index].itemTax=igstAmount
      newRows[index].itemCgstAmount=""
      newRows[index].itemSgstAmount=""

    }
    else{
      newRows[index].itemTax=cgstAmount+sgstAmount
      newRows[index].itemIgstAmount=""
    }

    setRows(newRows);

    setPurchaseOrderState?.((prevData: any) => ({
      ...prevData,
      items: newRows.map((row) => {
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
  
      // Update both rows and purchaseOrderState
      setRows(newRows);
      setPurchaseOrderState?.((prevData: any) => ({
        ...prevData,
        items: newRows, // Directly use newRows without mapping
      }));
    } else {
      const defaultRow = {
        itemId: "",
        itemName: "",
        itemQuantity: "",
        itemCostPrice: "",
        itemTax: "",
        
        itemAmount: "",
        itemSgst: "",
        itemCgst: "",
        itemIgst: "",
        itemVat: "",
        itemSgstAmount: "",
        itemCgstAmount: "",
        itemIgstAmount: "",
        itemVatAmount: "",
        itemPurchaseQuantity:"",
        taxPreference:""
      };
  
      // Reset rows to default row
      setRows([defaultRow]);
  
      // Update purchaseOrderState with the default row
      setPurchaseOrderState?.((prevData: any) => ({
        ...prevData,
        items: [defaultRow], // Set default row
      }));
    }
  };
  
  console.log(rows,"rows")
  
  const calculateTotalSGST = () => {
    return rows.reduce((total, row) => {
      const sgst = !isInterState ? (Number(row.itemSgstAmount) || 0) : 0;
      return total + sgst;
    }, 0);
  };
  

  // Function to calculate total CGST
  const calculateTotalCGST = () => {
    return rows.reduce((total, row) => {
      console.log(row.itemCgstAmount,"total cgst");

      const cgst = !isInterState ? (Number(row.itemCgstAmount) || 0 ): 0;
      return total + cgst;
    }, 0);
  };

  // Function to calculate total IGST
  const calculateTotalIGST = () => {
    return rows.reduce((total, row) => {
      const igst = isInterState ? (Number(row.itemIgstAmount) || 0) : 0;
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
  
  // Function to calculate the total subtotal
  const calculateTotalSubtotal = () => {
    return rows.reduce((total, row) => {
      const itemQuantity = Number(row.itemQuantity) || 0;
      const itemPrice = Number(row.itemCostPrice) || 0;
      const subtotal = itemQuantity * itemPrice;
      return total + subtotal;
    }, 0);
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
    const totalQuantity = calculateTotalQuantity();
    const totalSGST = calculateTotalSGST();
    const totalCGST = calculateTotalCGST();
    const totalIGST = calculateTotalIGST();
    const totalSellingPrice = calculateTotalSubtotal();

    
  
    setPurchaseOrderState?.((prevData: DebitNoteBody) => ({
      ...prevData,
      totalItem: totalQuantity,
      sgst: isInterState?"": totalSGST ,
      cgst: isInterState?"":totalCGST,
      igst: isInterState?totalIGST:"",
      subTotal: totalSellingPrice,
      totalTaxAmount: isInterState 
      ? totalIGST 
      : totalSGST + totalCGST, 
      grandTotal:totalSellingPrice+purchaseOrderState.totalTaxAmount

    }));
  }, [rows,purchaseOrderState.totalTaxAmount]);  
  

  useEffect(() => {
    const updatedRows = rows.map((row) => {
      const originalPrice = (Number(row.itemCostPrice) || 0) * (Number(row.itemQuantity) || 0);
  
      const taxDetails = calculateTax(
        originalPrice,
        row,
        isInterState as boolean
      );

  
      return {
        ...row,
        itemAmount: taxDetails.itemAmount,
        itemCgstAmount: taxDetails.cgstAmount > 0 ? taxDetails.cgstAmount : "",
        itemSgstAmount: taxDetails.sgstAmount > 0 ? taxDetails.sgstAmount : "",
        itemIgstAmount: taxDetails.igstAmount > 0 ? taxDetails.igstAmount : "",
      };
    });
  
    setRows(updatedRows);
    setPurchaseOrderState?.((prevData: any) => ({
      ...prevData,
      items: updatedRows.map((row) => {
        const updatedItem = { ...row };
        delete updatedItem.itemImage;
        return updatedItem;
      }),
    }));
    
  }, [ isInterState, purchaseOrderState?.destinationOfSupply,
    purchaseOrderState?.sourceOfSupply,]);
  
  

  useEffect(() => {
    if (selectedBill.length==0) {
      const defaultRow = {
        itemId: "",
        itemName: "",
        itemQuantity: "",
        itemCostPrice: "",
        itemTax: "",
      
        itemAmount: "",
        itemSgst: "",
        itemCgst: "",
        itemIgst: "",
        itemVat: "",
        itemSgstAmount: "",
        itemCgstAmount: "",
        itemIgstAmount: "",
        itemVatAmount: "",
        itemPurchaseQuantity:"",
        taxPreference:"",
      };
  
      setRows([defaultRow]);
  
      setPurchaseOrderState?.((prevData: any) => ({
        ...prevData,
        items: [defaultRow], 
        grandTotal:0
      }));
    }
  }, [selectedBill]);   

  const filterItems = () => {
    return selectedBill?.itemTable?.filter((item: any) =>
      item.itemName.toLowerCase().includes(searchValue.toLowerCase()) && 
      items.some((i: any) => i._id === item.itemId) 
    );
  };
  

  useEffect(() => {
    getAllItems();
  }, []);
console.log(selectedBill,"slectedBill")
  return (
    <div>
      <div className="rounded-lg border-2 border-tableBorder mt-5">
        <table className="min-w-full bg-white rounded-lg relative pb-4 border-dropdownText">
          <thead className="text-[12px] text-center text-dropdownText">
            <tr className="bg-lightPink">
              {newDebitTableHead.map((item, index) => (
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
                        <CheveronDownIcon color="currentColor" />
                      </div>
                    )}
                  </div>
                  {openDropdownId === index && openDropdownType === "searchProduct" && (
  <div
    ref={dropdownRef}
    className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-[30%] space-y-1"
  >
    <SearchBar
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      placeholder="Select Item"
    />
    {selectedBill && Object.keys(selectedBill).length > 0 ? (
      items.length > 0 ? (
        filterItems()?.length > 0 ? (  // Check if filtered items exist
          filterItems().map((item: any, idx: number) => (
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
              </div>
            </div>
          ))
        ) : (
          <div className="text-center border-slate-400 border rounded-lg">
            <p className="text-[red] text-sm py-4">Items Not Found!</p>
          </div>
        )
      ) : (
        <div className="text-center border-slate-400 border rounded-lg">
          <p className="text-[darkRed] text-sm py-4 px-4">Please select a bill to view items !</p>
        </div>
      )
    ) : (
      <div className="text-center border-slate-400 border rounded-lg">
        <p className="text-[darkRed] text-sm py-4 px-4">Please select a bill to view items !</p>
      </div>
    )}
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
                  /> <br />
                  Stock : {row.itemPurchaseQuantity?row.itemPurchaseQuantity:"0"}
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

export default DebitNoteTable;
