import { Link, useNavigate } from "react-router-dom";
import CheveronLeftIcon from "../../../../assets/icons/CheveronLeftIcon";
import CehvronDown from "../../../../assets/icons/CehvronDown";
import NeworderTable from "./NeworderTable";
import Button from "../../../../Components/Button";
import { useContext, useEffect, useRef, useState } from "react";
import SearchBar from "../../../../Components/SearchBar";
import PrinterIcon from "../../../../assets/icons/PrinterIcon";
import AddSupplierModal from "../../../Supplier/SupplierHome/AddSupplierModal";
import Upload from "../../../../assets/icons/Upload";
import ViewDetails from "./ViewDetails";
import NewCustomerModal from "../../../Customer/CustomerHome/NewCustomerModal";
import { PurchaseOrder } from "./PurchaseOrderBody";
import { endponits } from "../../../../Services/apiEndpoints";
import useApi from "../../../../Hooks/useApi";
import toast  from "react-hot-toast";
import { SupplierResponseContext } from "../../../../context/ContextShare";



type Props = {};

const NewPurchaseOrder = ({}: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selected, setSelected] = useState<string | null>("organization");
  const [supplierData, setSupplierData] = useState<[]>([]);
  const [customerData, setCustomerData] = useState<[]>([]);
  const [selectedCustomer, setSelecetdCustomer] = useState<string>("");
  const [selecteSupplier, setSelecetdSupplier] = useState<any | []>([]);
  const [oneOrganization, setOneOrganization] = useState<any | []>([]);
  const [placeOfSupplyList, setPlaceOfSupplyList] = useState<any | []>([]);
  const [destinationList, setDestinationList] = useState<any | []>([]);
  const [countryData, setcountryData] = useState<any | any>([]);
  const [isInterState, setIsInterState] = useState<boolean>(false);

  const { request: AllSuppliers } = useApi("get", 5009);
  const { request: AllCustomer } = useApi("get", 5002);
  const { request: getOneOrganization } = useApi("get", 5004);
  const { request: getCountries } = useApi("get", 5004);
  const { request: newPurchaseOrderApi } = useApi("post", 5005);
  // const { request: getPrfix } = useApi("get", 5005);
  const { supplierResponse } = useContext(SupplierResponseContext)!;
  const navigate =useNavigate()
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [purchaseOrderState, setPurchaseOrderState] = useState<PurchaseOrder>({
    supplierId: "",
    supplierDisplayName: "",
    supplierBillingCountry: "", 
    supplierBillingState: "",
    taxMode: "",
    sourceOfSupply: "",
    destinationOfSupply: "",
    deliveryAddress: "Organization",
    customerId: "",
    reference: "",
    shipmentPreference: "",
    purchaseOrderDate: new Date().toISOString().slice(0, 10),
    expectedShipmentDate: "",
    paymentTerms: "",
    paymentMode: "",
    items: [
      {
        itemId: "",
        itemName: "",
        itemQuantity: 0,
        itemCostPrice: 0,
        itemTax: "",
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
        itemVatAmount: 0,
        taxPreference:""
      },
    ],
    otherExpense: 0,
    otherExpenseReason: "",
    freight: 0,
    vehicleNo: "",
    addNotes: "",
    termsAndConditions: "",
    attachFiles: "",
    subTotal: 0,
    totalItem: 0,
    sgst: 0,
    cgst: 0,
    igst: 0,
    vat: 0,
    itemTotalDiscount: 0,
    totalTaxAmount: 0,
    roundOff: 0,
    transactionDiscountType: "percentage",
    transactionDiscount: 0,
    transactionDiscountAmount: 0,
    total:0,
    grandTotal: 0,
  });


  const toggleDropdown = (key: string | null) => {
    setOpenDropdownIndex(key === openDropdownIndex ? null : key);
    const supplierUrl = `${endponits.GET_ALL_SUPPLIER}`;
    fetchData(supplierUrl, setSupplierData, AllSuppliers);

  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpenDropdownIndex(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "expectedShipmentDate") {
      const selectedDate = new Date(value);
      const purchaseOrderDate = new Date(purchaseOrderState.purchaseOrderDate);
  
      if (selectedDate < purchaseOrderDate) {
        toast.error("Expected Shipment Date cannot be before the Purchase Order Date.");
        return;
      }
    }

    if (name === "transactionDiscount") {
      let discountValue = parseFloat(value) || 0;

      const totalAmount = purchaseOrderState.subTotal || 0;

      if (purchaseOrderState.transactionDiscountType === "percentage") {
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

      setPurchaseOrderState((prevState: any) => ({
        ...prevState,
        [name]: discountValue,
      }));
    } else {
      setPurchaseOrderState((prevState: any) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

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

  const handleplaceofSupply = () => {
    if (oneOrganization.organizationCountry) {
      const country = countryData.find(
        (c: any) =>
          c.name.toLowerCase() ===
          oneOrganization.organizationCountry.toLowerCase()
      );
      // console.log(country, "country");
      if (oneOrganization) {
        setPurchaseOrderState((preData) => ({
          ...preData,
          destinationOfSupply: oneOrganization.state,
        }));
      }
      if (country) {
        const states = country.states;
        // console.log(states);

        setPlaceOfSupplyList(states);
      } else {
        console.log("Country not found");
      }
    } else {
      console.log("No country selected");
    }
  };
  const handleDestination = () => {
    if (selecteSupplier.billingCountry) {
      const country = countryData.find(
        (c: any) =>
          c.name.toLowerCase() === selecteSupplier.billingCountry.toLowerCase()
      );
      if (selecteSupplier) {
        setPurchaseOrderState((preData) => ({
          ...preData,
          sourceOfSupply: selecteSupplier.billingState,
          supplierDisplayName: selecteSupplier.supplierDisplayName,
          supplierBillingCountry: selecteSupplier.billingCountry,
          supplierBillingState: selecteSupplier.billingState,
        }));
      }

      if (country) {
        const states = country.states;
        setDestinationList(states);
      } else {
        console.log("Country not found");
      }
    } else {
      console.log("No country selected");
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

  const filteredSupplier = filterByDisplayName(
    supplierData,
    "supplierDisplayName",
    searchValue
  );
  const filteredCustomer = filterByDisplayName(
    customerData,
    "customerDisplayName",
    searchValue
  );

  const calculateTotalAmount = () => {
    const {
      roundOff,
      otherExpense ,
      freight,
      itemTotalDiscount,
      totalTaxAmount,
      subTotal ,
    } = purchaseOrderState;

    const totalAmount =
    (  Number(subTotal) +
      Number(otherExpense) +
      Number(totalTaxAmount) +
      Number(freight)) -
      (Number(itemTotalDiscount) +
      Number(roundOff))
          return totalAmount.toFixed(2);
  };

  

  useEffect(() => {
    const newGrandTotal = calculateTotalAmount();
  
    const {
      transactionDiscountType,
      transactionDiscount = 0,
      transactionDiscountAmount = 0,
    } = purchaseOrderState;
  
    const transactionDiscountValueAMT =
      transactionDiscountType === "percentage"
        ? (transactionDiscount / 100) * Number(newGrandTotal)
        : Number(transactionDiscount); 
  
    const roundedDiscountValue = Math.round(transactionDiscountValueAMT * 100) / 100;
  
    const updatedGrandTotal = Math.round((Number(newGrandTotal) - roundedDiscountValue) * 100) / 100;
      if (transactionDiscountAmount !== roundedDiscountValue || purchaseOrderState.grandTotal !== updatedGrandTotal) {
      setPurchaseOrderState((prevState:any) => ({
        ...prevState,
        transactionDiscountAmount: roundedDiscountValue,
        grandTotal: updatedGrandTotal.toFixed(2), 
      }));
    }
  }, [
    purchaseOrderState.transactionDiscount,
    purchaseOrderState.transactionDiscountType,
    purchaseOrderState.subTotal,
    purchaseOrderState.otherExpense,
    purchaseOrderState.totalTaxAmount,
    purchaseOrderState.freight,
    purchaseOrderState.itemTotalDiscount,
    purchaseOrderState.roundOff,
  ]);
  

  const handleSave = async () => {
    try {
      const url = `${endponits.ADD_PURCHASE_ORDER}`;
      const { response, error } = await newPurchaseOrderApi(
        url,
        purchaseOrderState
      );
      if (!error && response) {
        // console.log(response);

        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/purchase/purchase-order")
        }, 1000);
      } else {
        toast.error(error?.response.data.message);
      }
    } catch (error) {}
  };


  const getLastDayOfMonth = (date:any, monthsToAdd = 0) => {
    const year = date.getFullYear();
    const month = date.getMonth() + monthsToAdd + 1; 
    return new Date(year, month, 1); 
  };
  useEffect(() => {
    if (purchaseOrderState.purchaseOrderDate) {
      const billDate = new Date(purchaseOrderState.purchaseOrderDate);
      let dueDate = new Date(billDate);
  
      switch (purchaseOrderState.paymentTerms) {
        case "Net 15":
        case "Net 30":
        case "Net 45":
        case "Net 60":
          const daysToAdd = parseInt(purchaseOrderState.paymentTerms.split(" ")[1], 10);
          dueDate.setDate(billDate.getDate() + daysToAdd);
          break;
        case "End of Next Month":
          dueDate = getLastDayOfMonth(billDate, 1);
          break;
        case "End of This Month":
          dueDate = getLastDayOfMonth(billDate);
          break;
        case "Pay Now":
        case "due on receipt":
          dueDate = billDate;
          break;
      }
  
      setPurchaseOrderState((prevState) => ({
        ...prevState,
        expectedShipmentDate: dueDate.toISOString().split("T")[0],
      }));
    }
  }, [purchaseOrderState.paymentTerms, purchaseOrderState.purchaseOrderDate]);

  useEffect(() => {
    if (purchaseOrderState?.destinationOfSupply == "") {
      setIsInterState(false);
    } else {
      if (
        purchaseOrderState?.sourceOfSupply !==
        purchaseOrderState?.destinationOfSupply
      ) {
        setIsInterState(true);
      } else {
        setIsInterState(false);
      }
    }
  }, [
    purchaseOrderState?.sourceOfSupply,
    purchaseOrderState?.destinationOfSupply,
  ]);



  useEffect(() => {
    const supplierUrl = `${endponits.GET_ALL_SUPPLIER}`;
    const customerUrl = `${endponits.GET_ALL_CUSTOMER}`;
    const organizationUrl = `${endponits.GET_ONE_ORGANIZATION}`;

    fetchData(supplierUrl, setSupplierData, AllSuppliers);
    fetchData(customerUrl, setCustomerData, AllCustomer);
    fetchData(organizationUrl, setOneOrganization, getOneOrganization);
  }, []);
  useEffect(() => {supplierResponse
    handleDestination();
    handleplaceofSupply();
    fetchCountries();
  }, [oneOrganization, selecteSupplier]);



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
    setPurchaseOrderState((prevState: any) => ({
      ...prevState,
      totalDiscount:
        (parseFloat(prevState.totalItemDiscount) || 0) +
        (parseFloat(prevState.transactionDiscountAmount) || 0),
    }));
  }, [purchaseOrderState.transactionDiscountAmount]);

  return (
    <div className="px-8">
      <div className="flex gap-5">
        <Link to={"/purchase/purchase-order"}>
          <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <h4 className="font-bold text-xl text-textColor ">
            New Purchase Order
          </h4>
        </div>
      </div>

      <form>
        <div className="grid grid-cols-12 gap-4 py-5 rounded-lg">
          <div className="col-span-8 h-[70vh] overflow-scroll hide-scrollbar">
            <div className="bg-secondary_main p-5 min-h-max rounded-xl relative ">
              <p className="text-textColor text-xl font-bold">
                Enter Purchase details
              </p>
              <div className=" mt-5 space-y-">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <label className="block text-sm mb-1 text-labelColor">
                      Supplier Name <span className="text-[#bd2e2e] ">*</span>
                    </label>
                    <div
                      className="relative w-full"
                      onClick={() => toggleDropdown("supplier")}
                    >
                      <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                        <p>
                          {selecteSupplier &&
                          selecteSupplier.supplierDisplayName
                            ? selecteSupplier.supplierDisplayName
                            : "Select Supplier"}
                        </p>
                      </div>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <CehvronDown color="gray" />
                      </div>
                    </div>
                    {openDropdownIndex === "supplier" && (
                      <div
                        ref={dropdownRef}
                        className="absolute z-10 bg-white  shadow  rounded-md mt-1 p-2 w-[30%] space-y-1 max-h-72 overflow-y-auto  hide-scrollbar"
                      >
                        <SearchBar
                          searchValue={searchValue}
                          onSearchChange={setSearchValue}
                          placeholder="Select Supplier"
                        />
                        {filteredSupplier.length > 0 ? (
                          filteredSupplier.map((supplier: any) => (
                            <div className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointe border border-slate-400 rounded-lg bg-lightPink cursor-pointer">
                              <div className="col-span-2 flex items-center justify-center">
                                <img
                                  src="https://i.postimg.cc/MHdYrGVP/Ellipse-43.png"
                                  alt=""
                                />
                              </div>
                              <div className="col-span-10 flex cursor-pointer "  onClick={() => {
                                    setPurchaseOrderState((prevState) => ({
                                      ...prevState,
                                      supplierId: supplier._id,
                                    }));
                                    setOpenDropdownIndex(null);
                                    setSelecetdSupplier(supplier);
                                  }}>
                                <div
                                 
                                >
                                  <p className="font-bold text-sm">
                                    {supplier.supplierDisplayName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Phone: {supplier.mobile}
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
                              Supplier Not Found!
                            </p>
                          </div>
                        )}
                        <div className="hover:bg-gray-100 cursor-pointe border border-slate-400 rounded-lg py-4">
                          <AddSupplierModal page="purchase" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 mt-2 gap-4">
                 {purchaseOrderState.supplierId &&
                <>
                    <div>
                      <label className="block text-sm mb-1 text-labelColor">
                        Destination Of Supply
                      </label>
                      <div className="relative w-full">
                        <select
                          onChange={handleChange}
                          name="destinationOfSupply"
                          value={purchaseOrderState.destinationOfSupply}
                          className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        >
                          <option value="">Select Destination Of Supply</option>
                          {placeOfSupplyList &&
                            placeOfSupplyList.map((item: any, index: number) => (
                              <option
                                key={index}
                                value={item}
                                className="text-gray"
                              >
                                {item}
                              </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <CehvronDown color="gray" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-labelColor">
                        Source of Supply
                      </label>
                      <div className="relative w-full">
                        <select
                          onChange={handleChange}
                          name="sourceOfSupply"
                          value={purchaseOrderState.sourceOfSupply}
                          className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        >
                          <option value="">Select Source Of Supply</option>
                          {destinationList &&
                            destinationList.map((item: any, index: number) => (
                              <option
                                key={index}
                                value={item}
                                className="text-gray"
                              >
                                {item}
                              </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <CehvronDown color="gray" />
                        </div>
                      </div>
                    </div>
                </>
                  }
                </div>
                <div className="grid grid-cols-12 gap-4 my-3">
                  <div className="col-span-5 ">
                    <label
                      className="block text-sm mb-1 text-labelColor"
                      htmlFor=""
                    >
                      Delivery Address
                    </label>
                    <div className="flex items-center  text-textColor text-sm">
                      <div className="flex gap-2 justify-center items-center ">
                        <div className="grid place-items-center mt-1">
                          <input
                            id="customer"
                            type="radio"
                            name="deliveryAddress"
                            className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border hidden ${
                              selected === "customer"
                                ? "border-8 border-neutral-400"
                                : "border-1 border-neutral-400"
                            }`}
                            onChange={() => {
                              setSelected("customer");
                              setPurchaseOrderState((prevData) => ({
                                ...prevData,
                                deliveryAddress: "customer",
                              }));
                            }}
                            checked={selected === "customer"}
                          />
                          <div
                            id="customer"
                            className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                              selected === "customer"
                                ? "bg-neutral-100"
                                : "bg-transparent"
                            }`}
                          />
                        </div>
                        <label
                          htmlFor="customer"
                          className="text-start font-medium hidden"
                        >
                          Customer
                        </label>
                      </div>
                      <div className="flex gap-2  justify-center items-center">
                        <div className="grid place-items-center mt-1">
                          <input
                            id="organization"
                            type="radio"
                            name="deliveryAddress"
                            className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border  ${
                              selected === "organization"
                                ? "border-8 border-neutral-400"
                                : "border-1 border-neutral-400"
                            }`}
                            onChange={() => {
                              setSelected("organization");
                              setPurchaseOrderState((prevData) => ({
                                ...prevData,
                                deliveryAddress: "organization",
                              }));
                            }}
                            checked={selected === "organization"}
                          />
                          <div
                            id="organization"
                            className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                              selected === "organization"
                                ? "bg-neutral-100"
                                : "bg-transparent"
                            }`}
                          />
                        </div>
                        <label
                          htmlFor="organization"
                          className="text-start font-medium"
                        >
                          Organization
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {selected === "customer" && (
                  <div className="grid grid-cols-12 gap-4 pb-2">
                    <div className="col-span-6  ">
                      <label className="text-sm mb-1 text-labelColor">
                        Customer Name
                      </label>
                      <div
                        className="relative w-full"
                        onClick={() => toggleDropdown("customer")}
                      >
                        <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer">
                          <p>
                            {(
                              selectedCustomer as {
                                customerDisplayName?: string;
                              }
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
                          className="absolute z-10 bg-white  shadow  rounded-md mt-1 p-2  space-y-1 max-w-72 overflow-y-auto  hide-scrollbar"
                          style={{ width: "50%" }}
                        >
                          <SearchBar
                            searchValue={searchValue}
                            onSearchChange={setSearchValue}
                            placeholder="Serach customer"
                          />
                          {filteredCustomer.length > 0 ? (
                            filteredCustomer.map((customer: any) => (
                              <div
                                className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointe border border-slate-400 rounded-lg bg-lightPink"
                                onClick={() => {
                                  setPurchaseOrderState((prevState) => ({
                                    ...prevState,
                                    customerId: customer._id,
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
                            <div className="text-center border-slate-400 border rounded-lg">
                              <p className="text-[red] text-sm py-4">
                                Customer Not Found!
                              </p>
                            </div>
                          )}
                          <div className="hover:bg-gray-100 cursor-pointe border border-slate-400 rounded-lg py-4">
                            <NewCustomerModal page="purchase" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col-span-6">
                      <label className="block text-sm mb-1 text-labelColor">
                        Reference#
                      </label>
                      <input
                        value={purchaseOrderState.reference}
                        name="reference"
                        onChange={handleChange}
                        placeholder="reference"
                        type="text"
                        className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* <div className="relative w-full">
                  <label className="text-sm mb-1 text-labelColor">
                    Purchase order#
                  </label>
                  <input
                  disabled
                        value={purchaseOrderState.purchaseOrder}
                        name="purchaseOrder"
                        onChange={handleChange}
                        placeholder=""
                        type="text"
                        className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9 text-textColor"
                      />
                </div> */}
                <div>
                  <label className="block text-sm mb-1 text-labelColor">
                    Payment Mode
                  </label>
                  <div className="relative w-full">
                    <select
                      value={purchaseOrderState.paymentMode}
                      name="paymentMode"
                      onChange={handleChange}
                      className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="" className="text-gray">
                        Select Payment Mode
                      </option>
                      <option value="Cash" className="text-gray">
                        Cash
                      </option>
                      <option value="Credit" className="text-gray">
                        Credit
                      </option>{" "}
                     
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                </div>

                {selected !== "customer" && (
                  <div>
                    <label className="block text-sm mb-1 text-labelColor">
                      Reference#
                    </label>
                    <input
                      value={purchaseOrderState.reference}
                      name="reference"
                      onChange={handleChange}
                      placeholder="reference"
                      type="text"
                      className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm mb-1 text-labelColor">
                    Shipment Preference
                  </label>
                  <div className="relative w-full">
                    <select
                      value={purchaseOrderState.shipmentPreference}
                      name="shipmentPreference"
                      onChange={handleChange}
                      className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="" className="text-gray">
                        Select Shipment Preference
                      </option>
                      <option value="Road" className="text-gray">
                        Road
                      </option>
                      <option value="Rail" className="text-gray">
                        Rail
                      </option>
                      <option value="Air" className="text-gray">
                        Air
                      </option>{" "}
                      <option value="Sea" className="text-gray">
                        Sea
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1 text-labelColor">
                    Purchase Order Date
                  </label>

                  <input
                    type="date"
                    value={purchaseOrderState.purchaseOrderDate }
                    name="purchaseOrderDate"
                    onChange={handleChange}
                    className="border-inputBorder w-full text-sm border rounded p-2 h-9  text-zinc-400"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-labelColor">
                    Expected Shipment Date
                  </label>
                  <input
                    type="date"
                    value={purchaseOrderState.expectedShipmentDate  }
                    name="expectedShipmentDate"
                    onChange={handleChange}
                    disabled={purchaseOrderState.paymentTerms !== "due on receipt" && purchaseOrderState.paymentTerms !== "Custom"}

                    className="border-inputBorder w-full text-sm border rounded p-2 h-9  text-zinc-400"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-labelColor">
                    Payment Terms
                  </label>
                  <div className="relative w-full">
                    <select
                      value={purchaseOrderState.paymentTerms}
                      onChange={handleChange}
                      name="paymentTerms"
                      className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="" className="text-gray">
                        Select Payment Terms
                      </option>
                      <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Pay Now">Pay Now</option>
                  <option value="due on receipt">Due on Receipt</option>
                  <option value="End of This Month">End of This Month</option>
                  <option value="End of Next Month">End of Next Month</option>
                  <option value="Custom">Custom</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                </div>
               
              </div>

              <p className="font-bold mt-3">Add Item</p>
              <NeworderTable
                purchaseOrderState={purchaseOrderState}
                setPurchaseOrderState={setPurchaseOrderState}
                isInterState={isInterState}
                oneOrganization={oneOrganization}
              />
              <br />
              <ViewDetails
              page="purchaseOrder"
                purchaseOrderState={purchaseOrderState}
                setPurchaseOrderState={setPurchaseOrderState}
              />
            </div>
          </div>

          <div className="col-span-4 h-[70vh] overflow-scroll hide-scrollbar">
            <div className="bg-secondary_main p-5 text-sm rounded-xl space-y-4 text-textColor">
              <div className="text-sm">
                <label htmlFor="" className="">
                  Add Note
                  <input
                    value={purchaseOrderState.addNotes}
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
                    value={purchaseOrderState.termsAndConditions}
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
                      {oneOrganization?.baseCurrency}{" "}
                      {purchaseOrderState.subTotal
                        ? purchaseOrderState.subTotal
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
                      {purchaseOrderState.totalItem
                        ? purchaseOrderState.totalItem
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
                      {purchaseOrderState.itemTotalDiscount
                        ? purchaseOrderState.itemTotalDiscount
                        : "0.00"}
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
                          {purchaseOrderState.igst
                            ? purchaseOrderState.igst
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
                            {purchaseOrderState.sgst
                              ? purchaseOrderState.sgst
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
                            {purchaseOrderState.cgst
                              ? purchaseOrderState.cgst
                              : "0.00"}
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
                        {" "}
                        {oneOrganization.baseCurrency}{" "}
                        {purchaseOrderState.totalTaxAmount}
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
                      {oneOrganization?.baseCurrency}{" "}
                      {purchaseOrderState.otherExpense
                        ? purchaseOrderState.otherExpense
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
                      {purchaseOrderState.freight
                        ? purchaseOrderState.freight
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
                      {purchaseOrderState.roundOff
                        ? purchaseOrderState.roundOff
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
                        value={purchaseOrderState.transactionDiscount}
                        onChange={handleChange}
                        name="transactionDiscount"
                        type="text"
                        placeholder="0"
                        className="w-[30px]  focus:outline-none text-center"
                      />
                      <select
                        className="text-xs   text-zinc-400 bg-white relative"
                        value={purchaseOrderState.transactionDiscountType}
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
                  <div className="w-full text-end ">
                    {" "}
                    <p className="text-end">
                      <p className="text-end">
                        {oneOrganization.baseCurrency}{" "}
                        {purchaseOrderState.transactionDiscountAmount
                          ? purchaseOrderState.transactionDiscountAmount
                          : "0.00"}
                      </p>
                    </p>
                  </div>
                </div>
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
                    {oneOrganization.baseCurrency} {purchaseOrderState.grandTotal? purchaseOrderState.grandTotal:"0.00"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="flex gap-4 my-5 justify-end">
        {" "}
        <Button variant="secondary" size="sm">
          Cancel
        </Button>
        <Button variant="secondary" size="sm">
          <PrinterIcon height={18} width={18} color="currentColor" />
          Print
        </Button>
        <Button variant="primary" size="sm" type="submit" onClick={handleSave}>
          Save & Send
        </Button>{" "}
      </div>
    </div>
  );
};

export default NewPurchaseOrder;
