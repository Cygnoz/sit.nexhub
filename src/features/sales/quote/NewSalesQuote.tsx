import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../../../Components/SearchBar";
import CehvronDown from "../../../assets/icons/CehvronDown";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import NewCustomerModal from "../../Customer/CustomerHome/NewCustomerModal";
import ManageSalesPerson from "../SalesPerson/ManageSalesPerson";
import SettingsIcons from "../../../assets/icons/SettingsIcon";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";
import { SalesQuote } from "../../../Types/SalesQuote";
import toast from "react-hot-toast";
import Upload from "../../../assets/icons/Upload";
import NewSalesQuoteTable from "./NewSalesQuoteTable"
 
type Props = {};
 
interface Customer {
  taxType: string;
 
}
 
const NewSalesQuote = ({ }: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [oneOrganization, setOneOrganization] = useState<any | []>([]);
  const [placeOfSupplyList, setPlaceOfSupplyList] = useState<any | []>([]);
  const [countryData, setcountryData] = useState<any | any>([]);
  const [customerData, setCustomerData] = useState<[]>([]);
  const [selectedCustomer, setSelecetdCustomer] = useState<any>("");
  const [prefix, setPrifix] = useState("")
  const [isIntraState, setIsIntraState] = useState<boolean>(false);
 
 
  const { request: getOneOrganization } = useApi("get", 5004);
  const { request: getCountries } = useApi("get", 5004);
  const { request: AllCustomer } = useApi("get", 5002);
  const { request: getPrfix } = useApi("get", 5007);
 
  const [salesQuoteState, setSalesQuoteState] = useState<SalesQuote>({
    customerId: "",
    customerName: "",
    placeOfSupply: "",
    reference: "",
    salesQuoteDate: "",
    expiryDate: "",
    subject: "",
 
    items: [
      {
        itemId: "",
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
        discountType: "",
        discountAmount: "",
        amount: ""
      },
    ],
    totalItemDiscount: "",
    note: "",
    tc: "",
    totalDiscount: "",
    // discountType: "",
    discountTransactionType: "percentage",
    discountTransactionAmount: "",
    // discountTax: "",
    transactionDiscount: "",
    subTotal: "",
    totalItem: "",
 
    cgst: "",
    sgst: "",
    igst: "",
    vat: "",
    totalTax: "",
    totalAmount: ""
  });
 
// console.log(salesQuoteState,"dfghjklkjhgfkl");
 
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
 
  const toggleDropdown = (key: string | null) => {
    setOpenDropdownIndex(key === openDropdownIndex ? null : key);
    const customerUrl = `${endponits.GET_ALL_CUSTOMER}`;
 
    fetchData(customerUrl, setCustomerData, AllCustomer);
  };
 
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpenDropdownIndex(null);
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
 
 
  const getSalesQuotePrefix = async () => {
    try {
      const prefixUrl = `${endponits.GET_LAST_SALES_QUOTE_PREFIX}`;
      const { response, error } = await getPrfix(prefixUrl);
 
      if (!error && response) {
        setPrifix(response.data)
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log("Error in fetching Purchase Order Prefix", error);
    }
  };
 
  const calculateTotal = () => {
    const {
      subTotal,
      sgst,
      cgst,
      igst,
      totalDiscount,
      discountTransactionType,
      transactionDiscount,
    } = salesQuoteState;
 
 
    const subTotalValue = parseFloat(subTotal) || 0;
    const sgstValue = parseFloat(sgst) || 0;
    const cgstValue = parseFloat(cgst) || 0;
    const igstValue = parseFloat(igst) || 0;
    const totalDiscountValue = parseFloat(totalDiscount) || 0;
 
 
    const taxAmount = isIntraState ? igstValue : sgstValue + cgstValue;
    // console.log(taxAmount, "tax amount");
 
    let totalTaxedAmount = 0;
    let transactionDiscountValue = 0;
 
 
    const totalBeforeTax =
      subTotalValue;
 
 
    transactionDiscountValue =
      discountTransactionType === "percentage"
        ? ((parseFloat(transactionDiscount) || 0) / 100) * totalBeforeTax
        : parseFloat(transactionDiscount) || 0;
    if (salesQuoteState.discountTransactionAmount !== transactionDiscountValue.toFixed(2)) {
      setSalesQuoteState(prevState => ({
        ...prevState,
        discountTransactionAmount: transactionDiscountValue.toFixed(2),
      }));
    }
 
    // console.log(transactionDiscountValue, "transaction discount before tax");
 
    totalTaxedAmount = totalBeforeTax + taxAmount - totalDiscountValue;
    // console.log(totalTaxedAmount, "Before tax calculation with discount");
 
    salesQuoteState.totalTax = totalTaxedAmount.toFixed(2);
    return totalTaxedAmount.toFixed(2)
  };
 
  const handleplaceofSupply = () => {
    if (oneOrganization.organizationCountry) {
      const country = countryData.find(
        (c: any) =>
          c.name.toLowerCase() ===
          oneOrganization.organizationCountry.toLowerCase()
      );
      if (oneOrganization) {
        setSalesQuoteState((preData) => ({
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
  // console.log(customerData, "cd");
 
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
 
 
    if (name === "transactionDiscount") {
      let discountValue = parseFloat(value) || 0;
      const totalAmount = parseFloat(salesQuoteState.subTotal) || 0;
 
      if (salesQuoteState.discountTransactionType === "percentage") {
        if (discountValue > 100) {
          discountValue = 100;
          toast.error("Discount cannot exceed 100%");
        }
      } else {
        if (discountValue > totalAmount) {
          discountValue = totalAmount;
          toast.error("Discount cannot exceed the subtotal amount");
        }
      }
 
      setSalesQuoteState((prevState: any) => ({
        ...prevState,
        [name]: discountValue.toString(),
      }));
    } else {
      setSalesQuoteState((prevState: any) => ({
        ...prevState,
        [name]: value,
      }));
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
 
  const filteredCustomer = filterByDisplayName(
    customerData,
    "customerDisplayName",
    searchValue
  );
  useEffect(() => {
 
    if (
      salesQuoteState?.placeOfSupply !==
      oneOrganization.state
    ) {
      setIsIntraState(true);
    } else {
      setIsIntraState(false);
 
    }
  }, [
    salesQuoteState?.placeOfSupply,
  ]);
 
  useEffect(() => {
    setSalesQuoteState((prevState: any) => ({
      ...prevState,
      totalDiscount: (parseFloat(prevState.totalItemDiscount) || 0) + (parseFloat(prevState.discountTransactionAmount) || 0),
    }));
  }, [salesQuoteState.discountTransactionAmount, salesQuoteState.totalItemDiscount]);
 
 
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
  useEffect(() => {
    handleplaceofSupply();
    fetchCountries();
    getSalesQuotePrefix()
  }, [oneOrganization]);
 
  useEffect(() => {
    const organizationUrl = `${endponits.GET_ONE_ORGANIZATION}`;
 
    fetchData(organizationUrl, setOneOrganization, getOneOrganization);
    // console.log(oneOrganization.state);
 
  }, []);
  const [isPlaceOfSupplyVisible, setIsPlaceOfSupplyVisible] = useState<boolean>(false);
 
  const checkTaxType = (customer: Customer) => {
    if (customer.taxType === "GST") {
      setIsPlaceOfSupplyVisible(true);
    } else {
      setIsPlaceOfSupplyVisible(false); // Hide the Place of Supply field
    }
  };
 
  useEffect(() => {
    if (selectedCustomer) {
      checkTaxType(selectedCustomer);
    }
  }, [selectedCustomer]);
 
 
  return (
    <div className="px-8">
      <div className="flex gap-5">
        <Link to={"/sales/quote"}>
          <div className="flex justify-center items-center h-11 w-11 bg-[#FFFFFF] rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <h4 className="font-bold text-xl text-textColor ">
            Create Sales Quote
          </h4>
        </div>
      </div>
 
      <div className="grid grid-cols-12 gap-4 py-5 rounded-lg">
        <div className="col-span-8">
          <div className="bg-[#FFFFFF] p-5 min-h-max rounded-xl relative ">
            <div className=" mt-5 space-y-4">
              <div className="grid grid-cols-12 gap-4">
              <div className={`col-span-${isPlaceOfSupplyVisible ? "5" : "7"}`}>
                  <label className="text-sm mb-1 text-labelColor">
                    Customer Name
                  </label>
                  <div
                    className="relative w-full"
                    onClick={() => toggleDropdown("customer")}
                  >
                    <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border
                         border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer">
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
                      className="absolute z-10 bg-white  shadow  rounded-md mt-1 p-2   space-y-1 max-w-72 overflow-y-auto  hide-scrollbar"
                      style={{ width: "80%" }}
                    >
                      <SearchBar
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        placeholder="Serach customer"
                      />
                      {filteredCustomer ? (
                        filteredCustomer.map((customer: any) => (
                          <div
                            className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointe
                                border border-slate-400 rounded-lg bg-lightPink"
                            onClick={() => {
                              setSalesQuoteState((prevState) => ({
                                ...prevState,
                                customerId: customer._id, customerName: customer.customerDisplayName
                              }));
                              setOpenDropdownIndex(null);
                              setSelecetdCustomer(customer);
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
                        <></>
                      )}
                      <div className="hover:bg-gray-100 cursor-pointe border border-slate-400 rounded-lg py-4">
                        <NewCustomerModal page="purchase" />
                      </div>
                    </div>
                  )}
                </div>
                {isPlaceOfSupplyVisible && (
                  <div className="col-span-7">
                    <label className="block text-sm mb-1 text-labelColor">
                      Place Of Supply
                    </label>
                    <div className="relative w-full">
                      <select
                        name="placeOfSupply"
                        onChange={handleChange}
                        value={salesQuoteState.placeOfSupply}
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
 
 
 
                <div className={`col-span-${isPlaceOfSupplyVisible ? "5" : "5"}`}>
                  <label className="block text-sm mb-1 text-labelColor">
                    Quote#
                  </label>
                  <div className=" flex items-center border rounded-lg border-inputBorder">
 
                    <input
                      readOnly
                      value={prefix}
                      type="text"
                      className="w-full text-sm p-1.5 pl-2 h-9 border-none outline-none rounded-l-lg"
                    />
                    <div className="p-1.5">
                      <SettingsIcons color="#495160" />
                    </div>
                  </div>
                </div>
 
                <div className="col-span-7">
                  <label className="block text-sm mb-1 text-labelColor">
                    Reference#
                  </label>
                  <input
                  name="reference"
                    placeholder="reference"
                    type="text"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
                    onChange={handleChange}
                    value={salesQuoteState.reference}
                  />
                </div>
 
 
                <div className="col-span-5">
                  <label className="block text-sm mb-1 text-labelColor">
                    Quote Date
                  </label>
                  <div className="relative w-full">
                    <input
                      type="date"
                      className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 px-2"
                    />
                  </div>
                </div>
 
 
 
                <div className="col-span-7 relative">
                  <label className="block text-sm mb-1 text-labelColor">
                    Expiry Date
                  </label>
                  <div className="relative w-full">
                    <input
                      type="date"
                      className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 px-2"
                    />
                  </div>
                </div>
 
                <div className="col-span-5">
                  <label className="block text-sm mb-1 text-labelColor">
                    Subject
                  </label>
                  <input
                    placeholder="subject"
                    type="text"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
                  />
                </div>
                <div className="col-span-7 relative">
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
                            <p className="font-bold text-sm">
                              Joey Tribiriyani
                            </p>
                            <p className="text-xs text-gray-500">
                              joey@gmail.com
                            </p>
                          </div>
                        </div>
                        <div className="ms-auto text-2xl cursor-pointer relative -mt-2 pe-2">
                          &times;
                        </div>
                      </div>
                      <ManageSalesPerson />
                    </div>
                  )}
                </div>
              </div>
 
 
 
 
              <p className="font-bold">Add Item</p>
              <NewSalesQuoteTable
                salesQuoteState={salesQuoteState}
                setSalesQuoteState={setSalesQuoteState}
                oneOrganization={oneOrganization}
                isIntraState={isIntraState}
              />
 
              <br />
 
            </div>
          </div>
        </div>
        <div className="col-span-4 h-[70vh] overflow-scroll hide-scrollbar">
          <div className="bg-secondary_main p-5 text-sm rounded-xl space-y-4 text-textColor">
            <div className="text-sm">
              <label htmlFor="" className="">
                Add Note
                <input
                  onChange={handleChange}
                  name="addNotes"
                  id=""
                  placeholder="Note"
                  className="border-inputBorder w-full text-sm border rounded  p-2 h-[57px] mt-2 "
                />
              </label>
            </div>
            <div className="text-sm mt-3">
              <label htmlFor="termsAndConditions" className="">
                Terms & Conditions
                <input
                  onChange={handleChange}
                  name="termsAndConditions"
                  id="termsAndConditions"
                  placeholder="Add Terms & Conditions of your business"
                  className="border-inputBorder w-full text-sm border rounded p-2 h-[57px] mt-2"
                />
              </label>
            </div>
            <div className="mt-4">
              <label className="block mb-1">
                Documents
                <div className="border-dashed border border-neutral-300 p-2 rounded  gap-2 text-center h-[68px] mt-2">
                  <div className="flex gap-1 justify-center">
                    <Upload />
                    <span>Upload File</span>
                  </div>
                  <p className="text-xs mt-1 text-gray-600">
                    Maximum File Size : 1MB
                  </p>
                </div>
                <input type="file" className="hidden" name="documents" />
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
                    Rs{" "}
                    {salesQuoteState.subTotal
                      ? salesQuoteState.subTotal
                      : "0.00"}{" "}
                  </p>
                </div>
              </div>
 
              <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p> Total Item</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                    {salesQuoteState.totalItem
                      ? salesQuoteState.totalItem
                      : "0"}
                  </p>
                </div>
              </div>
 
              <div className="flex ">
                <div className="w-[150%]">
                  {" "}
                  <p>Bill Discount</p>
                </div>
 
                <div className=" ">
                  <div className="border border-inputBorder rounded-lg flex items-center justify-center p-1 gap-1">
                    <input
                      onChange={handleChange}
                      name="transactionDiscount"
                      type="text"
                      placeholder="0"
                      className="w-[30px]  focus:outline-none text-center"
                    />
                    <select
                      className="text-xs   text-zinc-400 bg-white relative"
                      onChange={handleChange}
                      name="transactionDiscountType"
                    >
                      <option value="percentage">%</option>
                      <option value="currency">
                        {oneOrganization.baseCurrency}
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center  text-gray-700 ms-1">
                      <CehvronDown color="gray" height={15} width={15} />
                    </div>
                  </div>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                    <p className="text-end">
                      {oneOrganization.baseCurrency}{" "}
                      {salesQuoteState.discountTransactionAmount
                        ? salesQuoteState.discountTransactionAmount
                        : "0111.00"}
                    </p>
                  </p>
                </div>
              </div>
 
              <div className="flex ">
                <div className="w-[75%]">
                  <p> Total Discount</p>
                </div>
                <div className="w-full text-end">
                  <p className="text-end">
                    {oneOrganization.baseCurrency}{" "}
                    {salesQuoteState.totalDiscount ? salesQuoteState.totalDiscount : "0.00"}
                  </p>
                </div>
              </div>
 
 
              {isIntraState ? (
                <div className="flex ">
                  <div className="w-[75%]">
                    {" "}
                    <p> IGST</p>
                  </div>
                  <div className="w-full text-end">
                    {" "}
                    <p className="text-end">
                      {oneOrganization.baseCurrency}{" "}
                      {salesQuoteState.igst
                        ? salesQuoteState.igst
                        : "0.00"}
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
                        {salesQuoteState.sgst
                          ? salesQuoteState.sgst
                          : "0.00"}
                      </p>
                    </div>
                  </div>
 
                  <div className="flex ">
                    <div className="w-[75%]">
                      {" "}
                      <p> CGST</p>
                    </div>
                    <div className="w-full text-end">
                      {" "}
                      <p className="text-end">
                        {oneOrganization.baseCurrency}{" "}
                        {salesQuoteState.cgst
                          ? salesQuoteState.cgst
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                </>
              )}
 
              <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p> Total Taxed Amount</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                    {" "}
                    {oneOrganization.baseCurrency}{" "}
                    {calculateTotal()}
                  </p>
                </div>
              </div>
              {/* <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p>Other Expense</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                    Rs{" "}
                    {purchaseOrderState.otherExpense
                      ? purchaseOrderState.otherExpense
                      : "0.00"}
                  </p>
                </div>
              </div> */}
              {/* <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p>Fright</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                    Rs{" "}
                    {purchaseOrderState.freight
                      ? purchaseOrderState.freight
                      : "0.00"}
                  </p>
                </div>
              </div> */}
 
              {/* <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p>Rount Off Amount</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                    {oneOrganization.baseCurrency}{" "}
                    {purchaseOrderState.roundOff
                      ? purchaseOrderState.roundOff
                      : "0.00"}
                  </p>
                </div>
              </div> */}
            </div>
            <div className="flex text-black">
              <div className="w-[75%] font-bold">
                {" "}
                <p>Total</p>
              </div>
              <div className="w-full text-end font-bold text-base">
                {" "}
                <p className="text-end">
                  {" "}
                  {oneOrganization.baseCurrency}{" "} {calculateTotal()}
                </p>
              </div>
            </div>
 
 
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default NewSalesQuote;
 