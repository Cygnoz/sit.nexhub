import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import CehvronDown from "../../../assets/icons/CehvronDown";
import SearchBar from "../../../Components/SearchBar";
import Upload from "../../../assets/icons/Upload";
import SettingsIcons from "../../../assets/icons/SettingsIcon";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";
import NewCustomerModal from "../../Customer/CustomerHome/NewCustomerModal";
import Button from "../../../Components/Button";
import PrinterIcon from "../../../assets/icons/PrinterIcon";
import CreditNoteTable from "./CreditNoteTable";
import { CreditNoteBody } from "../../../Types/Creditnote";
import toast from "react-hot-toast";
// import toast from "react-hot-toast";


interface Customer {
  taxType: string;
}

const initialCreditNoteState: CreditNoteBody = {
  organizationId: "",
  customerId: "",
  customerDisplayName: "",

  placeOfSupply: "",

  invoiceId: "",
  invoiceNumber: "",
  invoiceDate: "",
  invoiceType: "",
  creditNote: "",
  orderNumber: "",
  customerCreditDate: "",
  paymentMode: "",
  depositTo: "",
  subject: "",

  items: [
    {
      itemId: "",
      itemName: "",
      quantity: "",
      sellingPrice: "",
      taxPreference: "",
      itemAmount: "",
      sgst: "",
      cgst: "",
      igst: "",
      vat: "",
      sgstAmount: "",
      cgstAmount: "",
      igstAmount: "",
      vatAmount: "",
      itemTotaltax: "",
    },
  ],

  addNotes: "",
  attachFiles: "",
  termsAndConditions: "",

  subTotal: 0,
  totalItem: 0,
  sgst: 0,
  cgst: 0,
  igst: 0,
  vat: 0,
  totalTax: 0,
  totalAmount: 0,
};

const NewCreditNote = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [customerData, setCustomerData] = useState<[]>([]);
  const [placeOfSupplyList, setPlaceOfSupplyList] = useState<any | []>([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(null);
  const [oneOrganization, setOneOrganization] = useState<any | []>([]);
  const [isInterState, setIsInterState] = useState<boolean>(false);
  const [countryData, setcountryData] = useState<any | any>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any | []>([]);
  const [isPlaceOfSupplyVisible, setIsPlaceOfSupplyVisible] = useState<boolean>(true);
  const [accounts, setAccounts] = useState<any>([]);
  const [allInvoice, setAllInvoice] = useState<any | []>([]);
  const [DBPrefix, setDBPrefix] = useState<any | []>([]);
  const [creditNoteState, setCreditNoteState] = useState<any>(
    initialCreditNoteState
  );

 
  const [errors,setErrors]=useState({
    invoiceNumber:false,
    invoiceDate:false,
    customerId:false,
    placeOfSupply:false,
    paymentMode:false,
    depositTo:false,
    itemTable:false,
    orderNumber:false,
  })


  const [selectedCustomer, setSelecetdCustomer] = useState<any>("");
  const { request: AllCustomer } = useApi("get", 5002);
  const { request: getOneOrganization } = useApi("get", 5004);
  const { request: getCountries } = useApi("get", 5004);
  const { request: getPrefix } = useApi("get", 5007);
  const { request: getAllInvoice } = useApi("get", 5007);
  const { request: getAccountData } = useApi("get", 5001);
  const { request: newCreditNoteApi } = useApi("post", 5007);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const fetchData = async (
    url: string,
    setData: React.Dispatch<React.SetStateAction<any>>,
    fetchFunction: (url: string) => Promise<any>
  ) => {
    try {
      const { response, error } = await fetchFunction(url);
      if (!error && response) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const filterByDisplayName = (
    data: any[],
    displayNameKey: string,
    searchValue: string
  ) => {
    return data.filter((item: any) =>
      item[displayNameKey]?.toLowerCase().includes(searchValue.toLowerCase())
    );
  };
  const fetchAllInvoices = async () => {
    try {
      const url = `${endponits.GET_ALL_SALES_INVOICE}`;
      const { response, error } = await getAllInvoice(url);
      if (error || !response) {
        setAllInvoice([]);
        return;
      }
      setAllInvoice(response.data.updatedInvoices || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setAllInvoice([]);
    }
  };

  useEffect(() => {
    fetchAllInvoices();
  }, []);

  const handleplaceofSupply = () => {
    if (oneOrganization.organizationCountry) {
      const country = countryData.find(
        (c: any) =>
          c.name.toLowerCase() ===
          oneOrganization.organizationCountry.toLowerCase()
      );
      if (oneOrganization) {
        setCreditNoteState((preData: any) => ({
          ...preData,
          placeOfSupply: oneOrganization.state,
        }));
      }
      if (country) {
        const states = country.states;
        setPlaceOfSupplyList(states);
      } else {
        console.log("Country not found");
      }
    } else {
      console.log("No country selected");
    }
  };

  const fetchCountries = async () => {
    try {
      const url = `${endponits.GET_COUNTRY_DATA}`;
      const { response, error } = await getCountries(url);
      if (!error && response) {
        setcountryData(response.data[0].countries);
      }
    } catch (error) {
      console.log("Error in fetching Country", error);
    }
  };

  useEffect(() => {
    const organizationUrl = `${endponits.GET_ONE_ORGANIZATION}`;
    const allAccountsUrl = `${endponits.Get_ALL_Acounts}`;
    const customerUrl = `${endponits.GET_ALL_CUSTOMER}`;
    const getPrefixUrl = `${endponits.GET_CREDIT_NOTE_PREFIX}`;


    fetchData(getPrefixUrl, setDBPrefix, getPrefix);
    fetchData(customerUrl, setCustomerData, AllCustomer);
    fetchData(organizationUrl, setOneOrganization, getOneOrganization);
    fetchData(allAccountsUrl, setAccounts, getAccountData);
  }, []);

  
  useEffect(() => {
    setCreditNoteState((preData:any) => ({
      ...preData,
      creditNote: DBPrefix,
    }));
  }, [DBPrefix]);

  useEffect(() => {
    handleplaceofSupply();
    fetchCountries();
  }, [oneOrganization]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setCreditNoteState({
      ...creditNoteState,
      [name]: value,
    });
  };
  const filteredCustomer = filterByDisplayName(
    customerData,
    "customerDisplayName",
    searchValue
  );

 
  const handleSave = async () => {
    const newErrors = { ...errors };
  
    newErrors.invoiceNumber = 
    typeof creditNoteState.invoiceNumber === "string" 
      ? creditNoteState.invoiceNumber.trim() === "" 
      : false;
  
  
    if (creditNoteState.customerId.trim() === "") {
      newErrors.customerId = true;
    } else {
      newErrors.customerId = false;
    }
  
   
  
    if (creditNoteState.placeOfSupply.trim() === "") {
      newErrors.placeOfSupply = true;
    } else {
      newErrors.placeOfSupply = false;
    }
    if (creditNoteState.invoiceDate.trim() === "") {
      newErrors.invoiceDate = true;
    } else {
      newErrors.invoiceDate = false;
    }
    if (creditNoteState.paymentMode.trim() === "") {
      newErrors.paymentMode = true;
    } else {
      newErrors.paymentMode = false;
    }
    if (creditNoteState.depositTo.trim() === "") {
      newErrors.depositTo = true;
    } else {
      newErrors.depositTo = false;
    }
  
    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      toast.error("Fill the required fields");
      return;
    }
    try {
      const url = `${endponits.ADD_CREDIT_NOTE}`;
      const { response, error } = await newCreditNoteApi(url, creditNoteState);
      if (!error && response) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/sales/credit-note");
        }, 1000);
      } else {
        toast.error(error?.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };





  const toggleDropdown = (key: string | null) => {
    setOpenDropdownIndex(key === openDropdownIndex ? null : key);
   
    const checkTaxType = (customer: Customer) => {
      if (customer.taxType === "GST") {
        setIsPlaceOfSupplyVisible(true);
      } else {
        setIsPlaceOfSupplyVisible(false);
      }
    };

    useEffect(() => {
      if (selectedCustomer) {
        checkTaxType(selectedCustomer);
      }
    }, [selectedCustomer]);

  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpenDropdownIndex(null);
    }
  };

  useEffect(() => {
    if (
      creditNoteState?.placeOfSupply !==
      oneOrganization.state
    ) {
      setIsInterState(true);
    } else {
      setIsInterState(false);

    }
  }, [creditNoteState?.placeOfSupply,]);

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

  const filteredInvoices =
    selectedCustomer && Object.keys(selectedCustomer).length > 0
      ? allInvoice?.filter(
        (invoice: any) =>
          invoice.customerId === selectedCustomer?._id &&
          (invoice.salesInvoice?.toLowerCase().includes(searchValue.toLowerCase()))
      )
      : [];

  console.log(allInvoice, "test");

console.log(creditNoteState,"hyy");


  return (
    <div className="mx-5 my-4">
      <div className="flex gap-5">
        <Link to={"/sales/credit-note"}>
          <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <h4 className="font-bold text-xl text-textColor">Credit Note</h4>
        </div>

      </div>

      <div className="grid grid-cols-12 gap-4 py-5 rounded-lg">
        <div className="col-span-8">
          <div className="bg-[#FFFFFF] p-5 min-h-max rounded-xl relative ">
            <div className=" mt-5 space-y-4">
              <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
  <label className="text-sm mb-1 text-labelColor">
    Customer Name<span className="text-[#bd2e2e]">*</span>
  </label>
  <div
    className="relative w-full"
    onClick={() => toggleDropdown("customer")}
  >
    <div
      className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border
           border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
    >
      <p>
        {(
          selectedCustomer as { customerDisplayName?: string }
        )?.customerDisplayName ?? "Select Customer"}
      </p>
    </div>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <CehvronDown color="gray" />
    </div>
  </div>
  {openDropdownIndex === "customer" && (
    <div
      ref={dropdownRef}
      className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 space-y-1 max-w-72 overflow-y-auto hide-scrollbar"
      style={{ width: "80%" }}
    >
      <SearchBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Search customer"
      />
      {filteredCustomer ? (
        filteredCustomer.map((customer: any) => (
          <div
            className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer
                border border-slate-400 rounded-lg bg-lightPink"
            onClick={() => {
              // Set the selected customer data in the state
              setCreditNoteState((prevState: any) => ({
                ...prevState,
                customerId: customer._id, 
                customerDisplayName: customer.customerDisplayName, // Fix this assignment
                orderNumber: "",
                invoiceNumber: "",
                invoiceId: "",
                invoiceDate: "",
              }));
              setOpenDropdownIndex(null);
              setSelecetdCustomer(customer); // Ensure selectedCustomer is updated
              setSelectedInvoice([]);
            }}
          >
            <div className="col-span-2 flex items-center justify-center">
              <img
                src="https://i.postimg.cc/MHdYrGVP/Ellipse-43.png"
                alt=""
              />
            </div>
            <div className="col-span-10 flex">
              <div>
                <p className="font-bold text-sm">
                  {customer.customerDisplayName}
                </p>
                <p className="text-xs text-gray-500">
                  Phone: {customer.mobile}
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
          <p className="text-[darkRed] text-sm py-4">Customer Not Found!</p>
        </div>
      )}
      <div className="hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg py-4">
        <NewCustomerModal page="customer" />
      </div>
    </div>
  )}
</div>

                {isPlaceOfSupplyVisible && (
                  <div className="col-span-6">
                    <label className="block text-sm mb-1 text-labelColor">
                      Place Of Supply<span className="text-[#bd2e2e] ">*</span>
                    </label>
                    <div className="relative w-full">
                      <select
                        name="placeOfSupply"
                        onChange={handleChange}
                        value={creditNoteState.placeOfSupply}
                        className="block appearance-none w-full h-9 text-zinc-400 bg-white border
                                   border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight
                                   focus:outline-none focus:bg-white focus:border-gray-500"
                      >
                        <option value="">Select place Of Supply</option>
                        {placeOfSupplyList &&
                          placeOfSupplyList.map((item: any, index: number) => (
                            <option key={index} value={item} className="text-gray">
                              {item}
                            </option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <CehvronDown color="gray" />
                      </div>
                    </div>
                  </div>
                )}



                <div className="col-span-6">
                  <label className="block text-sm mb-1 text-labelColor">
                    Credit Note#
                  </label>
                  <div className=" flex items-center border rounded-lg border-inputBorder">

                    <input
                      readOnly
                      value={creditNoteState.creditNote}
                       name="creditNote"
                       onChange={handleChange}         
                      className="w-full text-sm p-1.5 pl-2 h-9 border-none outline-none rounded-l-lg"
                    />
                    <div className="p-1.5">
                      <SettingsIcons color="#495160" />
                    </div>
                  </div>
                </div>

                <div className="col-span-6">
                  <label className="block text-sm mb-1 text-labelColor">
                    Sales Order Number
                  </label>
                  <input
                    // disabled
                    name="orderNumber"
                    value={creditNoteState.orderNumber}
                    onChange={handleChange}
                    id=""
                    placeholder="Value"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
                  />
                </div>


                <div className="col-span-6">
  <label
    htmlFor=""
    className="block text-sm mb-1 text-labelColor"
    onClick={() => toggleDropdown("invoice")}
  >
    Invoice#<span className="text-[#bd2e2e]">*</span>
  </label>
  <div
    className="relative w-full"
    onClick={() => toggleDropdown("invoice")}
  >
    <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
      <p>
        {selectedInvoice && selectedInvoice.salesInvoice
          ? selectedInvoice.salesInvoice
          : "Select Invoice"}
      </p>
    </div>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <CehvronDown color="gray" />
    </div>
  </div>
  {openDropdownIndex === "invoice" && (
    <div
      ref={dropdownRef}
      className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-[47%] space-y-1 max-h-72 overflow-y-auto hide-scrollbar"
    >
      <SearchBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Search Invoice"
      />
      {filteredInvoices.length > 0 ? (
        filteredInvoices.map((invoice: any) => (
          <div
            key={invoice._id}
            className="gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
            onClick={() => {
              // Map salesInvoice to invoiceNumber
              setCreditNoteState((prevState: any) => ({
                ...prevState,
                invoiceId: invoice._id,
                invoiceNumber: invoice.salesInvoice, // Map salesInvoice to invoiceNumber
                invoiceDate: invoice.salesInvoiceDate,
                orderNumber: invoice.salesOrderNumber,
              }));
              setOpenDropdownIndex(null);
              setSelectedInvoice(invoice);
            }}
          >
            <div className="flex cursor-pointer">
              <div>
                <p className="font-bold text-sm">{invoice.salesInvoice}</p>
                <p className="text-xs text-gray-500">
                  Customer: {invoice.customerName}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center border-slate-400 border rounded-lg">
          <p className="text-[red] text-sm py-4">
            {selectedCustomer && Object.keys(selectedCustomer).length > 0
              ? "Invoice Not Found!"
              : "Please select a customer to view invoices!"}
          </p>
        </div>
      )}
    </div>
  )}
</div>

                <div className="col-span-6">
                  <label className="block text-sm mb-1 text-labelColor">
                    Invoice Type<span className="text-[#bd2e2e] ">*</span>
                  </label>
                  <div className="relative w-full">
                    <select
                      name="invoiceType"
                      value={creditNoteState.invoiceType}
                      onChange={handleChange}
                      className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="" className="text-gray">
                        Select Invoice Type
                      </option>
                      <option value="Registered">Registered</option>
                      <option value="Deemed Export">Deemed Export</option>
                      <option value="SEZ With Payment">SEZ With Payment</option>
                      <option value="SEZ Without Payment">
                        SEZ Without Payment
                      </option>
                      <option value="Export With Payment">
                        Export With Payment
                      </option>
                      <option value="Export Without Payment">
                        Export Without Payment
                      </option>
                      <option value="B2C (Large)">B2C (Large)</option>
                      <option value="B2C Others">B2C Others</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                </div>

                <div className="col-span-6 relative">
                  <label className="block text-sm mb-1 text-labelColor">
                    Customer Credit Date<span className="text-[#bd2e2e] ">*</span>
                  </label>
                  <div className="relative w-full">
                    <input
                      name="customerCreditDate"
                      value={creditNoteState.customerCreditDate}
                      onChange={handleChange}
                      type="date"
                      className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 px-2"
                    />
                  </div>
                </div>

                <div className="col-span-6">
                  <label className="block text-sm mb-1 text-labelColor">
                    Payment Mode<span className="text-[#bd2e2e] ">*</span>
                  </label>
                  <div className="relative w-full">
                    <select
                      onChange={handleChange}
                       name="paymentMode"
                      value={creditNoteState.paymentMode}
                      className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="">Select Payment Mode</option>
                      <option value="Cash">Cash</option>
                      <option value="Credit">Credit</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                </div>

                <div className="col-span-6">
                  <label className="block text-sm mb-1 text-labelColor">
                    Deposit To<span className="text-[#bd2e2e] ">*</span>
                  </label>
                  <div className="relative w-full">
                    <select
                      name="depositTo"
                      onChange={handleChange}
                      value={creditNoteState.depositTo}
                      className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="">Select Account</option>
                      {accounts
                        ?.filter((item: any) => item.accountSubhead === "Bank" || item.accountSubhead == "Cash")
                        ?.map((item: any) => (
                          <option key={item._id} value={item._id}>
                            {item.accountName}
                          </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                </div>

                <div className="col-span-6">
                  <label className="block text-sm text-labelColor">
                    Subject
                    <input
                      name="subject"
                      onChange={handleChange}
                      value={creditNoteState.subject}
                      id=""
                      placeholder="Enter a subject within 250 Characters"
                      className="border-inputBorder w-full text-sm border rounded text-dropdownText  mt-1 p-2 h-9 "
                    />
                  </label>
                </div>
              </div>

              <p className="font-bold">Add Item</p>
              {/* table */}
              <CreditNoteTable
                SalesOrderState={creditNoteState}
                setSalesOrderState={setCreditNoteState}
                isInterState={isInterState}
                oneOrganization={oneOrganization}
                selectedInvoice={selectedInvoice}
              />{""}
              <br />
              <div className="mt-2">
            <label htmlFor="" className="block text-sm mb-1 text-labelColor">
              Add Note
              <input
                name="addNotes"
                id=""
                value={creditNoteState.addNotes}
                onChange={handleChange}
                placeholder="Note"
                className="border-inputBorder w-full text-sm border rounded  p-2 h-[57px] "
              />
            </label>
          </div>

            </div>
          </div>
        </div>
        <div className="col-span-4 text-sm">
          <div className="mt-0">
            <label htmlFor="" className="block text-sm mb-1 text-labelColor">
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
            <label className="block  text-sm mb-1 text-labelColor">
              Attach files to the Debit Notes
              <div className="border-inputBorder border-gray-800 w-full border-dashed border p-2 rounded flex flex-col gap-2 justify-center items-center mt-2  bg-white mb-4 ">
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

          <div className="bg-secondary_main p-5 min-h-max rounded-xl relative ">
            <div className=" pb-4  text-dropdownText border-b-2 border-slate-200 space-y-2">
              <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p>Sub Total</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                    {oneOrganization?.baseCurrency}{" "}
                    {creditNoteState.subTotal ? creditNoteState.subTotal : "0.00"}{" "}
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
                    {creditNoteState.totalItem ? creditNoteState.totalItem : "0"}
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
                        {oneOrganization.baseCurrency}{" "}
                        {creditNoteState.igst ? creditNoteState.igst : "0.00"}
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
                          {oneOrganization.baseCurrency}{" "}
                          {creditNoteState.sgst ? creditNoteState.sgst : "0.00"}
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
                          {oneOrganization.baseCurrency}{" "}
                          {creditNoteState.cgst ? creditNoteState.cgst : "0.00"}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!isInterState && (
                <div className="flex">
                  <div className="w-[75%]">
                    {" "}
                    <p> Total Tax</p>
                  </div>
                  <div className="w-full text-end">
                    {" "}
                    <p className="text-end">
                      {" "}
                      {oneOrganization.baseCurrency}{" "}
                      {creditNoteState.totalTax}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex text-black mt-4">
              <div className="w-[75%] font-bold">
                {" "}
                <p>Total</p>
              </div>
              <div className="w-full text-end font-bold text-base">
                {" "}
                <p className="text-end">
                  {" "}
                  {oneOrganization.baseCurrency}{" "}
                  {creditNoteState.totalAmount
                    ? creditNoteState.totalAmount
                    : "0.00"}
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
              <Button variant="primary" size="sm" onClick={handleSave}> 
                Save & send
              </Button>{" "}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NewCreditNote;