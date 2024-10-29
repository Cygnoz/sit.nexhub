import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../Components/Button";
import SearchBar from "../../../Components/SearchBar";
import CehvronDown from "../../../assets/icons/CehvronDown";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import PrinterIcon from "../../../assets/icons/PrinterIcon";
import SettingsIcons from "../../../assets/icons/SettingsIcon";
import NewCustomerModal from "../../Customer/CustomerHome/NewCustomerModal";
import NewInvoiceTable from "./NewInvoiceTable";
import ManageSalesPerson from "../SalesPerson/ManageSalesPerson";
import ScanEye from "../../../assets/icons/ScanEye";
import Upload from "../../../assets/icons/Upload";

type Props = {};

const NewInvoice = ({}: Props) => {
  
  const [searchValue, setSearchValue] = useState<string>("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDropdown = (key: string | null) => {
    setOpenDropdownIndex(key === openDropdownIndex ? null : key);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpenDropdownIndex(null);
    }
  };

  const toggleView = () => {
    setIsExpanded(!isExpanded);
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

  

  return (
    <div className="px-8">
      <div className="flex gap-5">
        <Link to={"/sales/invoice"}>
          <div className="flex justify-center items-center h-11 w-11 bg-[#FFFFFF] rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <h4 className="font-bold text-xl text-textColor ">
            New Invoice
          </h4>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 py-5 rounded-lg">
        <div className="col-span-8">
          <div className="bg-[#FFFFFF] p-5 min-h-max rounded-xl relative ">
            <p className="text-textColor text-xl font-bold">
              Enter Invoice details
            </p>

            <div className=" mt-5 space-y-4">
              <div className="grid grid-cols-12 gap-4">
              <div className="col-span-5 relative">
  <label className="block text-sm mb-1 text-labelColor">
    Customer Name
  </label>
  <div
    className="relative w-full"
    onClick={() => toggleDropdown("customer")}
  >
    <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
      <p>Select Customer</p>
    </div>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <CehvronDown color="gray" />
    </div>
  </div>
  {openDropdownIndex === "customer" && (
    <div
      ref={dropdownRef}
      className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-full space-y-1"
    >
      <SearchBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Select Customer"
      />
      <div className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink">
        <div className="col-span-2 flex items-center justify-center">
          <img
            src="https://i.postimg.cc/MHdYrGVP/Ellipse-43.png"
            alt=""
          />
        </div>
        <div className="col-span-10 flex">
          <div>
            <p className="font-bold text-sm">Joseph</p>
            <p className="text-xs text-gray-500">Phone: 9643287899</p>
          </div>
          <div className="ms-auto text-2xl cursor-pointer relative -mt-2 pe-2">
            &times;
          </div>
        </div>
      </div>
      <div className="hover:bg-gray-100 grid grid-col-12 h-12 items-center cursor-pointer border border-slate-400 rounded-lg">
        <NewCustomerModal page="purchase" />
      </div>
    </div>
  )}
</div>

                <div className="col-span-7">
                  <label className="block text-sm mb-1 text-labelColor">
                    Reference#
                  </label>
                  <input
                    placeholder="reference"
                    type="text"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
                  <label className="block text-sm mb-1 text-labelColor">
                    Invoice#
                  </label>
                  <div
                    className="relative w-full"
                    // onClick={() => toggleDropdown("customer")}
                  >
                    <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                      <p>Select Invoice</p>
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                </div>
  
                <div className="col-span-7 mt-6 flex items-center border rounded-lg border-inputBorder">
                <input
                  placeholder="INV-0002"
                  type="text"
                  className="w-full text-sm p-1.5 pl-2 h-9 border-none outline-none rounded-l-lg"
                  />
                 <div className="p-1.5">
                 <SettingsIcons color="#495160" />
                 </div>
                 </div>


              </div>
            <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5">
  <label className="block text-sm mb-1 text-labelColor">
    Invoice Date
  </label>
  <div className="relative w-full">
    <input
      type="date"
      className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 px-2"
      value="2024-12-31"
    />
  </div>
</div>

              <div className="col-span-7">
                <label className="block text-sm mb-1 text-labelColor">
                  Terms
                </label>
                <div className="relative w-full">
                  <select className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                    <option value="" className="text-gray">
                      Due on Receipt
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
            </div>
           
            </div>
            <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5 relative">
  <label className="block text-sm mb-1 text-labelColor">
    Sales Person
  </label>
  <div
    className="relative w-full"
    onClick={() => toggleDropdown("salesPerson")}
  >
    <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
      <p>Select or Add Sales Person</p>
    </div>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <CehvronDown color="gray" />
    </div>
  </div>
  {openDropdownIndex === "salesPerson" && (
    <div
      ref={dropdownRef}
      className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-full space-y-1"
    >
      <SearchBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Select sales person"
      />
      <div className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink items-center">
        <div className="col-span-11 flex">
          <div>
            <p className="font-bold text-sm">Joey Tribiriyani</p>
            <p className="text-xs text-gray-500">joey@gmail.com</p>
          </div>
        </div>
        <div className="ms-auto text-2xl cursor-pointer relative -mt-2 pe-2">
          &times;
        </div>
      </div>
      <ManageSalesPerson/>
    </div>
  )}
</div>

                <div className="col-span-7">
                  <label className="block text-sm mb-1 text-labelColor">
                   Subject
                  </label>
                  <input
                    placeholder="Let your customer know what this invoice is for"
                    type="text"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
                  />
                </div>
              </div>
            <p className="font-bold">Add Item</p>
            <NewInvoiceTable />  
          
            </div>
       
            <button className="mt-0" onClick={toggleView}>
    <p className="text-black my-0 text-sm flex gap-2 items-center">
      <ScanEye/>
      <b>{isExpanded ? 'View less' : 'View more'}</b>
    </p>
  </button>

  {isExpanded && (
   <div>
   {/* Your form elements go here */}
   <form>
  <div className="grid grid-cols-12 gap-4 py-5">
    <div className="bg-secondary_main p-0 min-h-max rounded-xl relative col-span-12">
      <div className="grid grid-cols-2 gap-5 mt-0">
        <div className="relative col-span-1">
          <div className="w-full">
            <label htmlFor="" className="">
              Other expenses
              <input
                name=""
                id=""
                placeholder="Other expense"
                className="border-inputBorder w-full text-sm border rounded text-dropdownText p-2 h-9 mt-2"
              />
            </label>
          </div>
        </div>
        <div className="relative col-span-1">
          <div className="w-full">
            <label className="block text-sm mb-1 text-labelColor">
              Other Expense Reason
              <input
                name=""
                id=""
                placeholder="other expense reason"
                className="border-inputBorder w-full text-sm border rounded text-dropdownText p-2 h-9 mt-2"
              />
            </label>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 mt-0">
        <div className="relative col-span-1">
          <div className="w-full">
            <label htmlFor="" className="">
              Vehicle Number
              <input
                name=""
                id=""
                placeholder="Enter vehicle number"
                className="border-inputBorder w-full text-sm border rounded text-dropdownText p-2 h-9 mt-2"
              />
            </label>
          </div>
        </div>
        <div className="relative col-span-1">
          <div className="w-full">
            <label className="block text-sm mb-1 text-labelColor">
              Freight Amount
              <input
                name=""
                id=""
                placeholder="Enter freight Amount"
                className="border-inputBorder w-full text-sm border rounded text-dropdownText p-2 h-9 mt-2"
              />
            </label>
          </div>
        </div>
        <div className="relative col-span-1">
          <div className="w-full">
            <label className="block text-sm mb-1 text-labelColor">
              Round off Amount 
              <input
                name=""
                id=""
                placeholder="Enter round off amount"
                className="border-inputBorder w-full text-sm border rounded text-dropdownText p-2 h-9 mt-2"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</form>



 </div>

  )}
</div>

      
          <br />
       
        </div>
        <div className="col-span-4">
        <div className="bg-secondary_main p-5 min-h-max rounded-xl relative  mt-0">

        <div className="mt-5">
            <label htmlFor="" className="">
              Add Note
              <input
                name=""
                id=""
                placeholder="Note"
                className="border-inputBorder w-full text-sm border rounded  p-2 h-[57px] mt-2 "
              />
            </label>
          </div>
          <div className="mt-4">
            <label htmlFor="" className="">
              Terms & Conditions
              <input
                name=""
                id=""
                placeholder="Add Terms & Conditions of your business"
                className="border-inputBorder w-full text-sm border rounded p-2 h-[57px] mt-2"
              />
            </label>
          </div>
          <div className="text-sm mt-3">
  <label className="block mb-3">
    Attach files to the Debit Notes 
    <div className="border-inputBorder border-gray-800 w-full border-dashed border p-2 rounded flex flex-col gap-2 justify-center items-center bg-white mb-4 mt-2">
      <span className="text-center inline-flex items-center gap-2">
        <Upload /> 
        Upload File 
      </span>
      <div className="text-center">
        Maximum File Size: 1 MB
      </div>
    </div>
    <p className="text-xs mt-1 text-gray-600"></p>
    <input
      type="file"
      className="hidden"
      value=""
      name="documents"
      // onChange={(e)=>handleFileChange(e)}
    />
  </label>
</div>
<div className="grid grid-cols-12 pb-4 text-dropdownText border-b-2 border-slate-200">
  
  {/* Sub Total */}
  <div className="col-span-9 flex items-center mb-3">
    <p>Sub Total</p>
  </div>
  <div className="col-span-3 flex justify-end items-center mb-3">
    <p className="text-xl">Rs 0.00</p>
  </div>

  {/* Total Item */}
  <div className="col-span-9 flex items-center mb-3">
    <p>Total Item</p>
  </div>
  <div className="col-span-3 flex justify-end items-center mb-3">
    <p className="text-xl">Rs 0.00</p>
  </div>

  {/* Bill Discount */}
  <div className="col-span-9 mb-3">
    <p>
      Bill Discount
      <br />
      <span className="text-[#820000]">Apply after tax</span>
    </p>
  </div>
  <div className="col-span-3 flex justify-end items-center gap-2 mb-3">
    {/* Centered 0% dropdown */}
    <div className="border border-neutral-300 flex items-center justify-center rounded-lg text-xs p-2 mr-2">
  0% <CehvronDown color="currentColor" width={15} height={15} />
</div>

    {/* Rs 0.00 amount */}
    <p className="text-xl">Rs 0.00</p>
  </div>

  {/* Total Discount */}
  <div className="col-span-9 flex items-center mb-3">
    <p>Total Discount</p>
  </div>
  <div className="col-span-3 flex justify-end items-center mb-3">
    <p className="text-xl">Rs 0.00</p>
  </div>

  {/* SGST */}
  <div className="col-span-9 flex items-center mb-3">
    <p>SGST</p>
  </div>
  <div className="col-span-3 flex justify-end items-center mb-3">
    <p className="text-xl">Rs 0.00</p>
  </div>

  {/* CGST */}
  <div className="col-span-9 flex items-center">
    <p>CGST</p>
  </div>
  <div className="col-span-3 flex justify-end items-center">
    <p className="text-xl">Rs 0.00</p>
  </div>

  {/* Total Taxed Amount */}
  <div className="col-span-9 flex items-center mb-3">
    <p>Total Taxed Amount</p>
  </div>
  <div className="col-span-3 flex justify-end items-center mb-3">
    <p className="text-xl">Rs 0.00</p>
  </div>

  {/* Other expense - Freight */}
  <div className="col-span-9 flex items-center mb-3">
    <p>Other expense</p>
  </div>
  <div className="col-span-3 flex justify-end items-center mb-3">
    <p className="text-xl">Rs 0.00</p>
  </div>
  <div className="col-span-9 flex items-center mb-3">
    <p>Freight</p>
  </div>
  <div className="col-span-3 flex justify-end items-center mb-3">
    <p className="text-xl">Rs 0.00</p>
  </div>

  {/* Round off */}
  <div className="col-span-9 flex items-center">
    <p>Round off</p>
  </div>
  <div className="col-span-3 flex justify-end items-center">
    <p className="text-xl">Rs 0.00</p>
  </div>

  {/* Total */}
  <div className="col-span-9 flex items-center mt-1">
    <p className="font-bold text-base text-black">Total</p>
  </div>
  <div className="col-span-3 flex justify-end items-center mt-1">
    <p className="text-xl font-bold">Rs 0.00</p>
  </div>
</div>

{/* Action buttons */}
<div className="flex gap-4 m-5 justify-end">
  <Button variant="secondary" size="sm">
    Cancel
  </Button>
  <Button variant="secondary" size="sm">
    <PrinterIcon height={18} width={18} color="currentColor" />
    Print
  </Button>
  <Button variant="primary" size="sm">
    Save & send
  </Button>
</div>
</div>
</div>
</div>
</div>


  );
};

export default NewInvoice;

