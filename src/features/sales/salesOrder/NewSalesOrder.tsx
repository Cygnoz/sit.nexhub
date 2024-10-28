import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../Components/Button";
import SearchBar from "../../../Components/SearchBar";
import CehvronDown from "../../../assets/icons/CehvronDown";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import PrinterIcon from "../../../assets/icons/PrinterIcon";
import NewCustomerModal from "../../Customer/CustomerHome/NewCustomerModal";
import ManageSalesPerson from "../SalesPerson/ManageSalesPerson";
import NewSalesOrderTable from "./NewSalesOrderTable";
import ScanEye from "../../../assets/icons/ScanEye";
import UserRound from "../../../assets/icons/UserRound";

import Upload from "../../../assets/icons/Upload";
import CustomerModal from "./CustomerModal";

type Props = {};

const NewSalesOrder = ({}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInterState, setIsInterState] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setIsInterState(false);
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
        <Link to={"/sales/salesorder"}>
          <div className="flex justify-center items-center h-11 w-11 bg-[#FFFFFF] rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <h4 className="font-bold text-xl text-textColor ">
            Create Sales Order
          </h4>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 py-5 rounded-lg">
        <div className="col-span-8">
          <div className="bg-[#FFFFFF] p-5 min-h-max rounded-xl relative ">
            <p className="text-textColor text-xl font-bold">
              Enter Sales Order details
            </p>

            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5 relative">
                  <label className="block text-sm mb-1 text-labelColor">
                    Sales Order#
                  </label>
                  <input
                    placeholder=""
                    value={"SO0001"}
                    type="text"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
                  />
                </div>
                <div className="col-span-7 relative">
                  <label className="block text-sm mb-1 text-labelColor">
                    Select Customer 
                  </label>
                  <div
                    className="relative w-full"
                    onClick={() => toggleDropdown("customer")}
                  >
                    <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                      <p>Select or Add  a Customer</p>
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
                            <p className="text-xs text-gray-500">
                              Phone: 9643287899
                            </p>
                          </div>
                          <div className="ms-auto text-2xl cursor-pointer relative -mt-2 pe-2">
                            &times;
                          </div>
                        </div>
                      </div>
                      <div className="hover:bg-gray-100 grid grid-col-12 h-12 items-center cursor-pointer border border-slate-400 rounded-lg">
                        <NewCustomerModal page="sales" />
                      </div>
                      
                    </div>
                  )}
      

      <div>
      <p
        className="mt-3 text-bold"
        style={{
          color: '#820000',
          display: 'flex',
          fontWeight: 'bold',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={handleOpenModal}
      >
        <UserRound color='#820000' />
        <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>
          See customer details
        </span>
      </p>
      {isModalOpen && <CustomerModal onClose={handleCloseModal} />}
    </div>

      
                </div>

             
               

                
                <div className="col-span-5 relative">
  <label className="block text-sm mb-1 text-labelColor">
    Place of Supply
  </label>
  <select className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
    <option value="" className="text-gray">
      Select place of supply
    </option>
    <option value="SO0001">SO0001</option>
    <option value="SO0002">SO0002</option>
    {/* <!-- Add more options as needed --> */}
  </select>
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 mt-5">
    <CehvronDown color="gray" />
  </div>
</div>

                
                <div className="col-span-7 relative">
                  <label className="block text-sm mb-1 text-labelColor">
                    Shipment Preference 
                  </label>
                  <div
                    className="relative w-full"
                    onClick={() => toggleDropdown("customer")}
                  >
                    <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                      <p>Train </p>
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
                            <p className="text-xs text-gray-500">
                              Phone: 9643287899
                            </p>
                          </div>
                          <div className="ms-auto text-2xl cursor-pointer relative -mt-2 pe-2">
                            &times;
                          </div>
                        </div>
                      </div>
                      <div className="hover:bg-gray-100 grid grid-col-12 h-12 items-center cursor-pointer border border-slate-400 rounded-lg">
                        <NewCustomerModal page="sales" />
                      </div>
                    </div>
                  )}
                </div>
                
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
                  <label className="block text-sm mb-1 text-labelColor">
                    Reference#
                  </label>
                  
                  <input
                    placeholder="reference"
                    type="text"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
                  />
                </div>
                <div className="col-span-7">
                  <label className="block text-sm mb-1 text-labelColor">
                    Sales Order Date
                  </label>
                  <div className="relative w-full">
                    <input
                      type="date"
                      className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 px-2"
                      value="2024-12-31"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
                  <label className="block text-sm mb-1 text-labelColor">
                    Payment Mode 
                  </label>
                  <div className="relative w-full">
                    <select className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                      <option value="" className="text-gray">
                        Select Payment Mode
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                  
                </div>

                <div className="col-span-7">
                  <label className="block text-sm mb-1 text-labelColor">
                    Payment Terms
                  </label>
                  <div className="relative w-full">
                    <select className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
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
                <div className="col-span-5">
                  <label className="block text-sm mb-1 text-labelColor">
                    Delivery Method
                  </label>
                  <div className="relative w-full">
                    <select className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                      <option value="" className="text-gray">
                        Select Delivery Method
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                </div>
                <div className="col-span-7 relative">
                  <label className="block text-sm mb-1 text-labelColor">
                    Sales Person
                  </label>
                  <div
                    className="relative w-full"
                    onClick={() => toggleDropdown("salesperson")}
                  >
                    <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                      <p>Select Salesperson</p>
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                  {openDropdownIndex === "salesperson" && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-full space-y-1"
                    >
                      <ManageSalesPerson />
                    </div>
                  )}
                </div>
                <div className="col-span-5">
                  <label className="block text-sm mb-1 text-labelColor">
                 Expected Shipment Date
                  </label>


                  <div className="relative w-full">
                    <select className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                        <input
                      type="date"
                      className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 px-2"
                      value="2024-12-31"
                    />
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                  
                </div>


       
              </div>
            </div>
          </div>
          

          <div className="mt-9">
            <p className="font-bold text-base">Add Item</p>
           <NewSalesOrderTable/>
          </div>

          <div>
            <button className="mt-0" onClick={toggleView}>
              <p className="text-black my-3 text-sm flex gap-1 items-center">
                <ScanEye />
                <b>{isExpanded ? "View less" : "View more"}</b>
              </p>
            </button>

            {isExpanded && (
              <div>
                <form>
                  <div className="grid grid-cols-12 gap-4 py-5">
                    <div className="bg-secondary_main p-0 min-h-max rounded-xl relative col-span-12">
                      <div className="grid grid-cols-2 gap-5 mt-0">
                        <div className="relative col-span-1">
                          <div className="w-full">
                            <label htmlFor="otherExpense" className="">
                              Other expenses
                              <input
                                name="otherExpense"
                                id="otherExpense"
                                // value={
                                //   bill.otherExpense == 0
                                //     ? ""
                                //     : bill.otherExpense
                                // }
                                // onChange={handleChange}
                                // placeholder="Other expense"
                                className="border-inputBorder w-full text-sm border rounded text-dropdownText p-2 h-9 mt-2"
                              />
                            </label>
                          </div>
                        </div>
                        <div className="relative col-span-1">
                          <div className="w-full">
                            <label
                              htmlFor="otherExpenseReason"
                              className="block text-sm mb-1 text-labelColor"
                            >
                              Other Expense Reason
                              <input
                                name="otherExpenseReason"
                                id="otherExpenseReason"
                                // onChange={handleChange}
                                // value={bill.otherExpenseReason}
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
                            <label htmlFor="vehicleNo" className="">
                              Vehicle Number
                              <input
                                name="vehicleNo"
                                id="vehicleNo"
                                // onChange={handleChange}
                                // value={bill.vehicleNo}
                                placeholder="Enter vehicle number"
                                className="border-inputBorder w-full text-sm border rounded text-dropdownText p-2 h-9 mt-2"
                              />
                            </label>
                          </div>
                        </div>
                        <div className="relative col-span-1">
                          <div className="w-full">
                            <label
                              htmlFor="freight"
                              className="block text-sm mb-1 text-labelColor"
                            >
                              Freight Amount
                              <input
                                name="freight"
                                id="freight"
                                // value={bill.freight == 0 ? "" : bill.freight}
                                // onChange={handleChange}
                                placeholder="Enter freight Amount"
                                className="border-inputBorder w-full text-sm border rounded text-dropdownText p-2 h-9 mt-2"
                              />
                            </label>
                          </div>
                        </div>
                        <div className="relative col-span-1">
                          <div className="w-full">
                            <label
                              htmlFor="roundOff"
                              className="block text-sm mb-1 text-labelColor"
                            >
                              Round off Amount
                              <input
                                name="roundOff"
                                id="roundOff"
                                // value={bill.roundOff==0?"":bill.roundOff}
                                // onChange={handleChange}
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

        
        </div>
        
        <div className="col-span-4">
          <div className="bg-secondary_main p-5 min-h-max rounded-xl relative  mt-0">
            <div className="mt-5">
              <label htmlFor="addNotes" className="">
                Add Note
                <input
                  name="addNotes"
                  id="addNotes"
                  // value={bill.addNotes}
                  // onChange={handleChange}
                  placeholder="Note"
                  className="border-inputBorder w-full text-sm border rounded  p-2 h-[57px] mt-2 "
                />
              </label>
            </div>
            <div className="mt-4">
              <label htmlFor="termsAndConditions" className="">
                Terms & Conditions
                <input
                  name="termsAndConditions"
                  id="termsAndConditions"
                  // value={bill.termsAndConditions}
                  // onChange={handleChange}
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
                  <div className="text-center">Maximum File Size: 1 MB</div>
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

            <div className=" pb-4  text-dropdownText border-b-2 border-slate-200 space-y-2">
              <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p>Sub Total</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                0.00
                  </p>
                </div>
              </div>

              <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p> Total Quantity</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                    0.00
                  </p>
                </div>
              </div>

              <div className="flex ">
                <div className="w-[75%]">
                  <p> Total Item Discount</p>
                </div>
                <div className="w-full text-end">
                  <p className="text-end">
                   0.00
                  </p>
                </div>
              </div>

              <div>
                {isInterState ? (
                  <div className="flex ">
                    <div className="w-[75%]">
                      {" "}
                      <p> IGST</p>
                    </div>
                    <div className="w-full text-end">
                      {" "}
                      <p className="text-end">
                   0.00
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex ">
                      <div className="w-[75%]">
                        {" "}
                        <p> SGST</p>
                      </div>
                      <div className="w-full text-end">
                        {" "}
                        <p className="text-end">
                         9.00
                        </p>
                      </div>
                    </div>

                    <div className="flex mt-2">
                      <div className="w-[75%]">
                        {" "}
                        <p> CGST</p>
                      </div>
                      <div className="w-full text-end">
                        {" "}
                        <p className="text-end">
                        0.00
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!isInterState && (
                <div className="flex ">
                  <div className="w-[75%]">
                    {" "}
                    <p> Total Tax</p>
                  </div>
                  <div className="w-full text-end">
                    {" "}
                    <p className="text-end">
                     0.00
                    </p>
                  </div>
                </div>
              )}

              <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p>Other Expense</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                    0.00
                  </p>
                </div>
              </div>
              <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p>Fright</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
               0.00
                  </p>
                </div>
              </div>

              <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p>Rount Off Amount</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                 0.00
                  </p>
                </div>
              </div>
              <div className="flex ">
                <div className="w-[150%]">
                  {" "}
                  <p>Bill Discount</p>
                  <div className=""></div>
                </div>

                <div className=" ">
                  <div className="border border-inputBorder rounded-lg flex items-center justify-center p-1 gap-1">
                    <input
                      // value={bill.transactionDiscount}
                      // onChange={handleChange}
                      step="0.01"
                      name="transactionDiscount"
                      type="text"
                      placeholder="0"
                      className="w-[30px]  focus:outline-none text-center"
                    />
                    <select
                      className="text-xs   text-zinc-400 bg-white relative"
                      // value={bill.transactionDiscountType}
                      // onChange={handleChange}
                      name="transactionDiscountType"
                    >
                      <option value="percentage">%</option>
                      <option value="currency">
                        {/* {oneOrganization.baseCurrency} */}
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center  text-gray-700 ms-1">
                      <CehvronDown color="gray" height={15} width={15} />
                    </div>
                  </div>
                </div>
                <div className="w-full text-end ">
                  {" "}
                  <p className="text-end">
                    <p className="text-end">0.00
                     
                    </p>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex text-black my-4">
              <div className="w-[75%] font-bold">
                {" "}
                <p>Total</p>
              </div>
              <div className="w-full text-end font-bold text-base">
                {" "}
                <p className="text-end">0.00
                 
                </p>
              </div>
            </div>

        

            <div className="flex gap-4 m-5 justify-end">
              {" "}
              <Button variant="secondary" size="sm">
                Cancel
              </Button>
              <Button variant="secondary" size="sm">
                <PrinterIcon height={18} width={18} color="currentColor" />
                Print
              </Button>
              <Button variant="primary" size="sm">
                Save & send
              </Button>{" "}
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};


export default NewSalesOrder;
