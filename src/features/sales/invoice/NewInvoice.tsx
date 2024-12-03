import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../../Components/Button";
import SearchBar from "../../../Components/SearchBar";
import CehvronDown from "../../../assets/icons/CehvronDown";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import PrinterIcon from "../../../assets/icons/PrinterIcon";
import NewCustomerModal from "../../Customer/CustomerHome/NewCustomerModal";
// import ManageSalesPerson from "../SalesPerson/ManageSalesPerson";
import Upload from "../../../assets/icons/Upload";
import { invoice } from "../../../Types/Invoice";
import useApi from "../../../Hooks/useApi";
import toast from "react-hot-toast";
import { endponits } from "../../../Services/apiEndpoints";
import ViewMoreOrder from "../salesOrder/ViewMoreOrder";
import NewSalesQuoteTable from "../quote/NewSalesQuoteTable";

type Props = {};
interface Customer {
  taxType: string;
}

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getEndOfMonthDate = (date: Date) => {
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return endOfMonth.toISOString().split('T')[0];
};

const calculateDueDate = (invoiceDate: string, term: string) => {
  const date = new Date(invoiceDate);

  switch (term) {
    case "Due on Receipt":
      return invoiceDate; 
    case "Due end of the month":
      const endOfMonthDate = getEndOfMonthDate(date);
      const endOfMonth = new Date(endOfMonthDate);
      endOfMonth.setDate(endOfMonth.getDate() + 1);
      return endOfMonth.toISOString().split('T')[0];
    case "Due end of next month":
      const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 2, 0);
      const endOfNextMonth = getEndOfMonthDate(nextMonthDate);
      const nextMonth = new Date(endOfNextMonth);
      nextMonth.setDate(nextMonth.getDate() + 1);
      return nextMonth.toISOString().split('T')[0];
    case "Net 15":
      date.setDate(date.getDate() + 15);
      break;
    case "Net 30":
      date.setDate(date.getDate() + 30);
      break;
    case "Net 45":
      date.setDate(date.getDate() + 45);
      break;
    case "Net 60":
      date.setDate(date.getDate() + 60);
      break;
    default:
      return invoiceDate;
  }

  return date.toISOString().split('T')[0];
};

const initialSalesQuoteState: invoice = {

  customerId: "",
  customerName: "",
  placeOfSupply: "",
  reference: "",

  salesInvoiceDate: getCurrentDate(),
  dueDate: getCurrentDate(),

  paymentMode: "",
  paymentTerms: "Due on Receipt",
  deliveryMethod: "",
  expectedShipmentDate: "",
  salesOrderNumber: "",

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
      amount: "",
      itemAmount: ""
    },
  ],

  totalItemDiscount: "",
  subtotalTotal: "",
  note: "",
  tc: "",

  otherExpenseAmount: "",
  otherExpenseReason: "",
  vehiclestring: "",
  freightAmount: "",
  roundOffAmount: "",

  otherExpenseAccountId: "",
  freightAccountId: "",
  paidAmount: "",
  depositAccountId: "",


  totalDiscount: "",
  discountTransactionType: "Percentage",
  discountTransactionAmount: "",
  transactionDiscount: "",
  subTotal: "",
  totalItem: "",

  cgst: "",
  sgst: "",
  igst: "",
  vat: "",
  totalTax: "",
  totalAmount: "",
  salesOrderId:""
};
const NewInvoice = ({ }: Props) => {
  const [isIntraState, setIsIntraState] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<[]>([]);
  const [oneOrganization, setOneOrganization] = useState<any | []>([]);
  const [selectedCustomer, setSelecetdCustomer] = useState<any>("");
  const [placeOfSupplyList, setPlaceOfSupplyList] = useState<any | []>([]);
  const [countryData, setcountryData] = useState<any | any>([]);
  const [isPlaceOfSupplyVisible, setIsPlaceOfSupplyVisible] = useState<boolean>(true);
  const [prefix, setPrifix] = useState("")
  const [allAccounts, setAllAccounts] = useState<any>([]);

  const [invoiceState, setInvoiceState] = useState<invoice>(initialSalesQuoteState);
  console.log(invoiceState);


  const { request: AllCustomer } = useApi("get", 5002);
  const { request: getOneOrganization } = useApi("get", 5004);
  const { request: getCountries } = useApi("get", 5004);
  const { request: getPrfix } = useApi("get", 5007);
  const { request: getAccounts } = useApi("get", 5001);
  const { request: getOneInvoice } = useApi("get", 5007);


  const navigate = useNavigate()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const invoiceId = queryParams.get("id");

  const getBills = async () => {
    try {
      const url = `${endponits.GET_ONE_SALES_ORDER}/${invoiceId}`;
      const { response, error } = await getOneInvoice(url);

      if (!error && response) {
        console.log(response.data, "response");
        setInvoiceState((prevData) => ({
          ...prevData,
          ...response.data,
          salesOrderNumber: response.data.salesOrder,
          salesOrderId:response.data._id
        }));

        const matchingSupplier = customerData.find((sup: any) => sup._id === response.data.customerId);
        if (matchingSupplier) {
          setSelecetdCustomer(matchingSupplier);
        }
      }
    } catch (error) {
      console.log("Error in fetching bill", error);
    }
  };

  useEffect(() => {
    const customerUrl = `${endponits.GET_ALL_CUSTOMER}`;
    fetchData(customerUrl, setCustomerData, AllCustomer);
  }, [])
  useEffect(() => {
    getBills()
  }, [selectedCustomer, oneOrganization])

  const handleGoBack = () => {
    navigate(-1)
    setInvoiceState(initialSalesQuoteState)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const totalTax = parseFloat(invoiceState?.totalTax);
    const totalAmount = parseFloat(invoiceState.subtotalTotal + totalTax) || 0;
    let discountValue = parseFloat(invoiceState.discountTransactionAmount) || 0;

    setInvoiceState((prevState) => {
      let newState = { ...prevState, [name]: value };
      if (name === "paymentTerms") {
        newState.dueDate = calculateDueDate(prevState.salesInvoiceDate, value);
      }
      else if (name === "dueDate") {
        newState.paymentTerms = "Custom";
      }
      else if (name === "transactionDiscountType") {
        newState.discountTransactionType = value;

        if (value === "Percentage") {
          const percentageDiscount = (discountValue / totalAmount) * 100;
          if (percentageDiscount > 100) {
            toast.error("Discount cannot exceed 100%");
            discountValue = 0; // Reset if exceeds 100%
          }
          newState.discountTransactionAmount = percentageDiscount ? percentageDiscount.toFixed(2) : '0';
        } else {
          const currencyDiscount = (discountValue / 100) * totalAmount;
          newState.discountTransactionAmount = currencyDiscount ? currencyDiscount.toFixed(2) : '0';
        }
      }
      else if (name === "discountTransactionAmount") {
        discountValue = parseFloat(value) || 0;

        if (prevState.discountTransactionType === "Percentage") {
          if (discountValue > 100) {
            discountValue = 0;
            toast.error("Discount cannot exceed 100%");
          }
          const discountAmount = (discountValue / 100) * totalAmount;
          newState.discountTransactionAmount = discountValue ? discountValue.toString() : '0';
          newState.transactionDiscount = discountAmount ? discountAmount.toFixed(2) : '0';
        } else {
          if (discountValue > totalAmount) {
            discountValue = totalAmount;
            toast.error("Discount cannot exceed the subtotal amount");
          }
          newState.discountTransactionAmount = discountValue ? discountValue.toString() : '0';
          newState.transactionDiscount = discountValue ? discountValue.toFixed(2) : '0';
        }
      }

      return newState;
    });
  };


  useEffect(() => {
    if (new Date(invoiceState.dueDate) < new Date(invoiceState.salesInvoiceDate)) {
      setInvoiceState((prevState) => ({
        ...prevState,
        dueDate: invoiceState.salesInvoiceDate,
      }));
    }
  }, [invoiceState.salesInvoiceDate]);

  const calculateTotal = () => {
    const {
      totalItemDiscount,
      subtotalTotal,
      totalTax,
      roundOffAmount,
      otherExpenseAmount,
      freightAmount,
    } = invoiceState;

    // Calculate total with all components
    const totalAmount =
      Number(subtotalTotal) +
      Number(otherExpenseAmount) +
      Number(totalTax) +
      Number(freightAmount) -
      (Number(totalItemDiscount) + Number(roundOffAmount));

    return totalAmount.toFixed(2);
  };

  useEffect(() => {
    const newGrandTotal = calculateTotal();
    const {
      discountTransactionType,
      discountTransactionAmount = "0",
      transactionDiscount = "0",
    } = invoiceState;

    const transactionDiscountValueAMT =
      discountTransactionType === "Percentage"
        ? (Number(discountTransactionAmount) / 100) * Number(newGrandTotal)
        : Number(discountTransactionAmount);

    const roundedDiscountValue = Math.round(transactionDiscountValueAMT * 100) / 100;
    const updatedGrandTotal = Math.round((Number(newGrandTotal) - roundedDiscountValue) * 100) / 100;

    if (Number(transactionDiscount) !== roundedDiscountValue || Number(invoiceState.totalAmount) !== updatedGrandTotal) {
      setInvoiceState((prevState) => ({
        ...prevState,
        transactionDiscount: roundedDiscountValue.toFixed(2),
        totalAmount: updatedGrandTotal.toFixed(2),
      }));
    }
  }, [
    invoiceState.discountTransactionAmount,
    invoiceState.discountTransactionType,
    invoiceState.subtotalTotal,
    invoiceState.totalTax,
    invoiceState.totalItemDiscount,
    invoiceState.roundOffAmount,
    invoiceState.otherExpenseAmount,
    invoiceState.freightAmount,
  ]);

  useEffect(() => {
    setInvoiceState((prevState: any) => ({
      ...prevState,
      totalDiscount: ((parseFloat(prevState.totalItemDiscount) || 0) + (parseFloat(prevState.transactionDiscount) || 0)).toFixed(2),
    }));
  }, [invoiceState.transactionDiscount, invoiceState.totalItemDiscount]);

  const checkTaxType = (customer: Customer) => {
    if (customer.taxType === "GST") {
      setIsPlaceOfSupplyVisible(true);
    } else {
      setIsPlaceOfSupplyVisible(false);
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
  const getSalesInvoicePrefix = async () => {
    try {
      const prefixUrl = `${endponits.GET_INVOICE_PREFIX}`;
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

  const handleplaceofSupply = () => {
    if (oneOrganization.organizationCountry) {
      const country = countryData.find(
        (c: any) =>
          c.name.toLowerCase() ===
          oneOrganization.organizationCountry.toLowerCase()
      );
      if (oneOrganization) {
        setInvoiceState((preData) => ({
          ...preData,
          placeOfSupply: selectedCustomer.billingState,
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
  useEffect(() => {

    if (
      invoiceState?.placeOfSupply !==
      oneOrganization.state
    ) {
      setIsIntraState(true);
    } else {
      setIsIntraState(false);

    }
  }, [
    invoiceState?.placeOfSupply,
  ]);

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
  useEffect(() => {
    const organizationUrl = `${endponits.GET_ONE_ORGANIZATION}`;
    const allAccountsUrl = `${endponits.Get_ALL_Acounts}`;

    fetchData(allAccountsUrl, setAllAccounts, getAccounts);
    fetchData(organizationUrl, setOneOrganization, getOneOrganization);
    handleplaceofSupply();
    fetchCountries();
    getSalesInvoicePrefix();
    if (selectedCustomer) {
      checkTaxType(selectedCustomer);
    }
  }, [selectedCustomer]);


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

  const toggleDropdown = (key: string | null) => {
    setOpenDropdownIndex(key === openDropdownIndex ? null : key);
    const customerUrl = `${endponits.GET_ALL_CUSTOMER}`;
    setSearchValue("")

    fetchData(customerUrl, setCustomerData, AllCustomer);
  };


  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpenDropdownIndex(null);
    }
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

  const { request: newSalesInvoiceApi } = useApi("post", 5007);
  const handleSave = async () => {
    try {
      const url = `${endponits.ADD_SALES_INVOICE}`;
      const { response, error } = await newSalesInvoiceApi(
        url,
        invoiceState
      );
      if (!error && response) {
        toast.success(response.data.message);
        handleGoBack()
      } else {
        toast.error(error?.response.data.message);
      }
    } catch (error) { }
  };

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
                <div className="col-span-5">
                  <label className="text-sm mb-1 text-labelColor">
                    Select Customer
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
                      className="absolute z-10 bg-white  shadow  rounded-md mt-1 p-2   space-y-1 max-w-72 max-h-80 overflow-y-auto  hide-scrollbar"
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
                            className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100
                                border border-slate-400 rounded-lg bg-lightPink"
                            onClick={() => {
                              setInvoiceState((prevState) => ({
                                ...prevState,
                                customerId: customer._id, customerName: customer.customerDisplayName
                              }));
                              setOpenDropdownIndex(null);
                              setSelecetdCustomer(customer);
                            }}
                            style={{ cursor: "pointer" }}
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
                                {customer.mobile &&
                                  <p className="text-xs text-gray-500">
                                    Phone: {customer.mobile}
                                  </p>}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <></>
                      )}
                      <div className="hover:bg-gray-100  cursor-pointe border border-slate-400 rounded-lg py-4">
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
                        value={invoiceState.placeOfSupply}
                        onChange={handleChange}
                        className="block appearance-none w-full h-9 text-zinc-400 bg-white border
        border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight
        focus:outline-none focus:bg-white focus:border-gray-500"
                      >
                        <option value="" disabled selected hidden>Select place Of Supply</option>
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

                <div className={`col-span-${isPlaceOfSupplyVisible ? "5" : "7"} relative`}>
                  <label className="block text-sm mb-1 text-labelColor">
                    Invoice#
                  </label>
                  <input
                    readOnly
                    value={prefix}
                    type="text"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
                  />
                </div>

                <div className={`col-span-${isPlaceOfSupplyVisible ? "7" : "5"} relative`}>
                  <label className="block text-sm  text-labelColor">
                    Sales Order Number
                    <input
                      name="salesOrderNumber"
                      id="salesOrderNumber"
                      value={invoiceState.salesOrderNumber}
                      onChange={handleChange}
                      placeholder="Enter Order Number"
                      className="border-inputBorder w-full text-sm border rounded text-dropdownText  mt-1 p-2 h-9 "
                    />
                  </label>
                </div>


              </div>


              <div className="grid grid-cols-12 gap-4">


                <div className={`col-span-${isPlaceOfSupplyVisible ? "5" : "5"} relative`}>
                  <label className="block text-sm mb-1 text-labelColor">
                    Reference#
                  </label>
                  <input
                    placeholder="reference"
                    type="text"
                    onChange={handleChange}
                    value={invoiceState?.reference}
                    name="reference"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
                  />
                </div>

                <div className="col-span-7">
                  <label className="block text-sm mb-1 text-labelColor">
                    Invoice Date
                  </label>
                  <div className="relative w-full">
                    <input
                      type="date"
                      onChange={handleChange}
                      name="salesInvoiceDate"
                      value={invoiceState.salesInvoiceDate}
                      className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 px-2"
                    />
                  </div>
                </div>



              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
                  <label className="block text-sm mb-1 text-labelColor">
                    Expected Shipment Date
                  </label>
                  <div className="relative w-full">
                    <input
                      type="date"
                      onChange={handleChange}
                      name="expectedShipmentDate"
                      className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 px-2"
                      value={invoiceState?.expectedShipmentDate}
                    />
                  </div>
                </div>
                <div className="col-span-7">
                  <label className="block text-sm mb-1 text-labelColor">
                    Due Date
                  </label>
                  <div className="relative w-full">
                    <input
                      type="date"
                      onChange={handleChange}
                      name="dueDate"
                      value={invoiceState.dueDate}
                      min={invoiceState.salesInvoiceDate}
                      className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 px-2"
                    />
                  </div>
                </div>


              </div>
              <div className="grid grid-cols-12 gap-4">
                {/* <div className="col-span-5 relative">
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
                      <ManageSalesPerson />
                    </div>
                  )}
                </div> */}

                <div className="col-span-5">
                  <label className="block text-sm mb-1 text-labelColor">
                    Payment Terms
                  </label>
                  <div className="relative w-full">
                    <select
                      value={invoiceState.paymentTerms}
                      onChange={handleChange}
                      name="paymentTerms"
                      className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                      <option value="" className="text-gray">
                        Select Payment Terms
                      </option>
                      <option value="Due on Receipt" selected>Due on Receipt</option>
                      <option value="Due end of the month">Due end of the month</option>
                      <option value="Due end of next month">Due end of next month</option>
                      <option value="Net 15">Net 15</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 45">Net 45</option>
                      <option value="Net 60">Net 60</option>
                      <option value="Custom">Custom</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                </div>


                <div className="col-span-7">
                  <label className="block text-sm mb-1 text-labelColor">
                    Delivery Method
                  </label>
                  <div className="relative w-full">
                    <select
                      value={invoiceState.deliveryMethod}
                      name="deliveryMethod"
                      onChange={handleChange}
                      className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                      <option value="" disabled hidden selected className="text-gray">
                        Select Shipment Preference
                      </option>
                      <option value="Road">Road</option>
                      <option value="Rail">Rail</option>
                      <option value="Air">Air</option>
                      <option value="Sea">Sea</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-9">
                <p className="font-bold">Add Item</p>
                <NewSalesQuoteTable
                  salesQuoteState={invoiceState}
                  setSalesQuoteState={setInvoiceState}
                  oneOrganization={oneOrganization}
                  isIntraState={isIntraState}
                  isPlaceOfSupplyVisible={isPlaceOfSupplyVisible}
                />
              </div>
            </div>
            <div className="mt-3">
              <ViewMoreOrder
                page="invoice"
                allAccounts={allAccounts}
                salesOrderState={invoiceState}
                setSalesOrderState={setInvoiceState}
              />
            </div>
          </div>

        </div>
        <div className="col-span-4">
          <div className="bg-secondary_main p-5 text-sm rounded-xl space-y-4 text-textColor">
            <div className="text-sm">
              <label htmlFor="" className="">
                Add Note
                <input
                  onChange={handleChange}
                  value={invoiceState?.note}
                  name="note"
                  id=""
                  placeholder="Note"
                  className="border-inputBorder w-full text-sm border rounded  p-2 h-[57px] mt-2 "
                />
              </label>
            </div>
            <div className="mt-4">
              <label htmlFor="tc" className="">
                Terms & Conditions
                <input
                  name="tc"
                  id="tc"
                  value={invoiceState.tc}
                  onChange={handleChange}
                  placeholder="Add Terms & Conditions of your business"
                  className="border-inputBorder w-full text-sm border rounded p-2 h-[57px] mt-2"
                />
              </label>
            </div>
            <div className="mt-4">
              <label className="block mb-1">
                Attach files to Sales Order
                <div className="border-dashed border border-neutral-300 p-2 rounded  gap-2 text-center h-[68px] mt-3">
                  <div className="flex gap-1 justify-center items-center">
                    <Upload />
                    <span>Upload File</span>
                  </div>
                  <p className="text-xs mt-1 text-gray-600">
                    Maximum File Size : 1MB
                  </p>
                </div>
                {/* <input type="file" className="hidden" name="documents" /> */}
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
                    {invoiceState.subtotalTotal
                      ? invoiceState.subtotalTotal
                      : "0.00"}{" "}
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
                    {invoiceState.totalItem
                      ? invoiceState.totalItem
                      : "0"}
                  </p>
                </div>
              </div>

              <div className="flex ">
                <div className="w-[75%]">
                  <p> Total Item Discount</p>
                </div>
                <div className="w-full text-end">
                  <p className="text-end">
                    {oneOrganization.baseCurrency}{" "}
                    {invoiceState.totalDiscount ? invoiceState.totalDiscount : "0.00"}
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
                      {invoiceState.igst
                        ? invoiceState.igst
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
                        {invoiceState.sgst
                          ? invoiceState.sgst
                          : "0.00"}
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
                        {invoiceState.cgst
                          ? invoiceState.cgst
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* {!isIntraState && ( */}
              <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p> Total Tax</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                    {" "}
                    {oneOrganization.baseCurrency}{" "}
                    {invoiceState?.totalTax}
                  </p>
                </div>
              </div>
              {/* )} */}

              <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p>Other Expense</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                    {oneOrganization?.baseCurrency}{" "}
                    {invoiceState.otherExpenseAmount
                      ? invoiceState.otherExpenseAmount
                      : "0.00"}
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
                    {oneOrganization?.baseCurrency}{" "}
                    {invoiceState.freightAmount
                      ? invoiceState.freightAmount
                      : "0.00"}
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
                    {oneOrganization.baseCurrency}{" "}
                    {invoiceState.roundOffAmount
                      ? invoiceState.roundOffAmount
                      : "0.00"}
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
                      onChange={handleChange}
                      value={invoiceState?.discountTransactionAmount}
                      name="discountTransactionAmount"
                      type="number"
                      step="0.01"
                      placeholder="0"
                      className="w-[60px] focus:outline-none text-center"
                    />
                    <select
                      className="text-xs text-zinc-400 bg-white relative"
                      onChange={handleChange}
                      value={invoiceState?.discountTransactionType}
                      name="transactionDiscountType"
                    >
                      <option value="Percentage">%</option>
                      <option value="Currency">
                        {oneOrganization.baseCurrency}
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-gray-700 ms-1">
                      <CehvronDown color="gray" height={15} width={15} />
                    </div>
                  </div>
                </div>
                <div className="w-full text-end">
                  <p className="text-end">
                    {oneOrganization.baseCurrency}{" "}
                    {invoiceState.transactionDiscount // Previously `discountTransactionAmount`
                      ? invoiceState.transactionDiscount
                      : "0.00"}
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
                <p className="text-end">
                  {invoiceState?.totalAmount &&
                    `${oneOrganization.baseCurrency} ${invoiceState.totalAmount}`
                  }
                </p>

              </div>
            </div>
            <div>
              <label className="block text-sm mb-1 text-labelColor">
                Deposit Account
              </label>
              <div className="relative w-full">
                <select
                  onChange={handleChange}
                  value={invoiceState.depositAccountId}
                  name="depositAccountId"
                  className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                >
                  <option value="" selected hidden disabled>Select Account</option>
                  {allAccounts
                    .filter((item: { accountSubhead: string }) => item.accountSubhead === "Bank" || item.accountSubhead === "Cash")
                    .map((item: { _id: string; accountName: string }) => (
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
            <div className="text-sm">
              <label htmlFor="vehiclestring" className="">
                Paid Amount
                <input
                  value={invoiceState.paidAmount}
                  name="paidAmount"
                  type="number"
                  onChange={handleChange}
                  placeholder="Enter Paid Amount"
                  className="border-inputBorder w-full text-sm border rounded p-2 h-9 mt-2"
                />
              </label>
            </div>




            <div className="flex gap-4 m-5 justify-end">
              {" "}
              <Button variant="secondary" size="sm" onClick={handleGoBack}>
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

export default NewInvoice;