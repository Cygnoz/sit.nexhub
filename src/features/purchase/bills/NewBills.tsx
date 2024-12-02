import { Link, useLocation, useNavigate } from "react-router-dom";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import { useEffect, useRef, useState } from "react";
import CehvronDown from "../../../assets/icons/CehvronDown";
import SearchBar from "../../../Components/SearchBar";
import Button from "../../../Components/Button";
import PrinterIcon from "../../../assets/icons/PrinterIcon";
import AddSupplierModal from "../../Supplier/SupplierHome/AddSupplierModal";
import NeworderTable from "../purchaseOrder/addPurchaseOrder/NeworderTable";
import Upload from "../../../assets/icons/Upload";
import { Bill } from "./BillBody";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";
import toast from "react-hot-toast";
import ViewDetails from "../purchaseOrder/addPurchaseOrder/ViewDetails";


type Props = {};

const NewBills = ({}: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  // const [selected, setSelected] = useState<string | null>("organization");
  const [supplierData, setSupplierData] = useState<[]>([]);
  const [selecteSupplier, setSelecetdSupplier] = useState<any | []>([]);
  const [oneOrganization, setOneOrganization] = useState<any | []>([]);
  const [placeOfSupplyList, setPlaceOfSupplyList] = useState<any | []>([]);
  const [destinationList, setDestinationList] = useState<any | []>([]);
  const [countryData, setcountryData] = useState<any | any>([]);
  const [isInterState, setIsInterState] = useState<boolean>(false);
  const [allAccounts, setAllAccounts] = useState<any>([]);
  const [errors,setErrors]=useState({
    billNumber:false,
    dueDate:false,
    billDate:false,
    supplierId:false,
    sourceOfSupply:false,
    destinationOfSupply:false,
  })

  const { request: AllSuppliers } = useApi("get", 5009);
  const { request: getOneOrganization } = useApi("get", 5004);
  const { request: getCountries } = useApi("get", 5004);
  const { request: newBillApi } = useApi("post", 5005);
  const { request: getOneBill } = useApi("get", 5005);
  const { request: getAccounts } = useApi("get", 5001);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const billid = queryParams.get("id");

  const [bill, setBill] = useState<Bill>({
    supplierId: "",
    supplierDisplayName:"",
    billNumber: "",
    sourceOfSupply: "",
    destinationOfSupply: "",
    taxMode: "",
    orderNumber: "",
    purchaseOrderDate: "",
    expectedShipmentDate: "",
    paymentTerms: "",
    paymentMode: "",
    PaidThrough:"",
    billDate: new Date().toISOString().slice(0, 10), 
       dueDate: "",
    items: [
      {
        itemId: "",
        itemName: "",
        itemQuantity: "",
        itemCostPrice: 0,
        itemDiscount: 0,
        itemDiscountType: "percentage",
        itemTax:0,
        itemSgst: 0,
        itemCgst: 0,
        itemIgst: 0,
        itemVat: 0,
        itemSgstAmount: 0,
        itemCgstAmount: 0,
        taxPreference:""
      },
    ],
    otherExpenseAccountId:"",
    otherExpense: 0,
    otherExpenseReason: "",
    vehicleNo: "",
    freightAccountId:"",
    freight: 0,
    addNotes: "",
    termsAndConditions: "",
    attachFiles: "",
    subTotal: 0,
    totalItem: "",
    sgst: 0,
    cgst: 0,
    igst: 0,
    transactionDiscountType: "percentage",
    transactionDiscount: 0,
    transactionDiscountAmount: 0,
    totalTaxAmount: 0,
    itemTotalDiscount: 0,
    roundOff: 0,
    paidStatus: "",
    shipmentPreference: "",
    grandTotal: 0,
    balanceAmount:0,
    paidAmount:0,
    paidAccountId:"",
    purchaseOrderId:""
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

  const handleplaceofSupply = () => {
    if (oneOrganization.organizationCountry) {
      const country = countryData.find(
        (c: any) =>
          c.name.toLowerCase() ===
          oneOrganization.organizationCountry.toLowerCase()
      );
      // console.log(country, "country");
      if (oneOrganization) {
        setBill((preData: any) => ({
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
        setBill((preData: any) => ({
          ...preData,
          sourceOfSupply: selecteSupplier.billingState,
          supplierDisplayName: selecteSupplier.supplierDisplayName,
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
  
    if (name === "dueDate") {
      const selectedDueDate = new Date(value);
      const billDate = new Date(bill.billDate);
  
      if (selectedDueDate < billDate) {
        toast.error("Due Date cannot be before the Bill Date.");
        return;
      }
    }
  
    if (name === "paidAmount") {
      let paidAmount = parseFloat(value) || 0;
      const grandTotal = Number(bill.grandTotal) || 0;
  
      if (paidAmount > grandTotal) {
        toast.error("Paid Amount cannot exceed Grand Total.");
        paidAmount = grandTotal; 
      }
  
      setBill((prevState: any) => ({
        ...prevState,
        paidAmount,
      }));
      return; 
    }
  
    if (name === "transactionDiscount") {
      let discountValue = parseFloat(value) || 0;
      const totalAmount = Number(bill.subTotal) || 0;
  
      if (bill.transactionDiscountType === "percentage") {
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
  
      setBill((prevState: any) => ({
        ...prevState,
        [name]: discountValue,
      }));
      return;
    }
  
    if (name === "purchaseOrderDate" || name === "expectedShipmentDate") {
      setBill((prevState: any) => ({
        ...prevState,
        [name]: value,
      }));
  
      if (
        name === "expectedShipmentDate" &&
        bill.purchaseOrderDate &&
        new Date(value) < new Date(bill.purchaseOrderDate)
      ) {
        toast.error(
          "Expected Shipment Date cannot be earlier than Purchase Order Date."
        );
        setBill((prevState: any) => ({
          ...prevState,
          expectedShipmentDate: "",
        }));
      }
      return; 
    }
  
    setBill((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };
  

  console.log(bill,"bill")

  const getLastDayOfMonth = (date:any, monthsToAdd = 0) => {
    const year = date.getFullYear();
    const month = date.getMonth() + monthsToAdd + 1; 
    return new Date(year, month, 1); 
  };
  
  useEffect(() => {
    if (bill.billDate) {
      const billDate = new Date(bill.billDate);
      let dueDate = new Date(billDate);
  
      switch (bill.paymentTerms) {
        case "Net 15":
        case "Net 30":
        case "Net 45":
        case "Net 60":
          const daysToAdd = parseInt(bill.paymentTerms.split(" ")[1], 10);
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
  
      setBill((prevState) => ({
        ...prevState,
        dueDate: dueDate.toISOString().split("T")[0],
      }));
    }
  }, [bill.paymentTerms, bill.billDate]);
  
  useEffect(() => {
    if (bill.paymentTerms === "due on receipt" && bill.dueDate !== bill.billDate) {
      setBill((prevState) => ({
        ...prevState,
        paymentTerms: "Custom",
      }));
    }
  }, [bill.dueDate, bill.paymentTerms, bill.billDate]);
  
  
  

  

  

  const calculateTotalAmount = () => {
    const {
      roundOff,
      otherExpense,
      freight,
      itemTotalDiscount,
      totalTaxAmount,
      subTotal,
    } = bill;

    const totalAmount =
      Number(subTotal) +
      Number(otherExpense) +
      Number(totalTaxAmount) +
      Number(freight) -
      (Number(itemTotalDiscount) + Number(roundOff));
    return totalAmount.toFixed(2);
  };

  useEffect(() => {
    const { grandTotal, paidAmount } = bill;
  
    const numericGrandTotal = Number(grandTotal) || 0;
    const numericPaidAmount = Number(paidAmount) || 0;
  
    let balanceAmount;
    if(bill.paymentTerms=="Pay Now"){
       balanceAmount = numericGrandTotal - numericPaidAmount;

    }
    else{
      balanceAmount=numericGrandTotal
    }
  
    setBill((prevState: any) => ({
      ...prevState,
      balanceAmount: balanceAmount,
    }));
  }, [bill.grandTotal, bill.paidAmount]);

  console.log(errors,"errors")

  const handleSave = async () => {
    const newErrors = { ...errors };
  
    if (bill.billNumber.trim() === "") {
      newErrors.billNumber = true;
    } else {
      newErrors.billNumber = false;
    }
  
    if (bill.supplierId.trim() === "") {
      newErrors.supplierId = true;
    } else {
      newErrors.supplierId = false;
    }
  
    if (bill.destinationOfSupply.trim() === "") {
      newErrors.destinationOfSupply = true;
    } else {
      newErrors.destinationOfSupply = false;
    }
  
    if (bill.sourceOfSupply.trim() === "") {
      newErrors.sourceOfSupply = true;
    } else {
      newErrors.sourceOfSupply = false;
    }
  
    if (bill.billDate.trim() === "") {
      newErrors.billDate = true;
    } else {
      newErrors.billDate = false;
    }
  
    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      toast.error("Fill the required fields");
      return;
    }
  
    try {
      const url = `${endponits.ADD_BILL}`;
      const { response, error } = await newBillApi(url, bill);
      if (!error && response) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/purchase/bills");
        }, 1000);
      } else {
        toast.error(error?.response.data.message);
      }
    } catch (error) {
      console.error("Save error", error);
    }
  };
  
  

  useEffect(() => {
    const newGrandTotal = calculateTotalAmount();

    const {
      transactionDiscountType,
      transactionDiscount = 0,
      transactionDiscountAmount = 0,
    } = bill;
    const transactionDiscountValueAMT =
    transactionDiscountType === "percentage"
      ? (Number(transactionDiscount) / 100) * Number(newGrandTotal)
      : Number(transactionDiscount);
  
    const roundedDiscountValue =
      Math.round(transactionDiscountValueAMT * 100) / 100;

    const updatedGrandTotal =
      Math.round((Number(newGrandTotal) - roundedDiscountValue) * 100) / 100;
    if (
      transactionDiscountAmount !== roundedDiscountValue ||
      bill.grandTotal !== updatedGrandTotal
    ) {
      setBill((prevState: any) => ({
        ...prevState,
        transactionDiscountAmount: roundedDiscountValue,
        grandTotal: updatedGrandTotal,
      }));
    }
  }, [
    bill.transactionDiscount,
    bill.transactionDiscountType,
    bill.subTotal,
    bill.otherExpense,
    bill.totalTaxAmount,
    bill.freight,
    bill.itemTotalDiscount,
    bill.roundOff,
  ]);

  useEffect(() => {
    if (bill?.destinationOfSupply == "") {
      setIsInterState(false);
    } else {
      if (bill?.sourceOfSupply !== bill?.destinationOfSupply) {
        setIsInterState(true);
      } else {
        setIsInterState(false);
      }
    }
  }, [bill?.sourceOfSupply, bill?.destinationOfSupply]);


  const getBills = async () => {
    try {
      const url = `${endponits.GET_ONE_PURCHASE_ORDER}/${billid}`;
      const { response, error } = await getOneBill(url);
  
      if (!error && response) {
        console.log(response.data, "response");

        setBill((prevData) => ({
          ...prevData, 
          ...response.data,
          orderNumber:response.data.purchaseOrder,
          purchaseOrderId:response.data._id
        }));
  
        const matchingSupplier = supplierData.find((sup:any) => sup._id === response.data.supplierId);
        if (matchingSupplier) {
          setSelecetdSupplier(matchingSupplier); 
        }
      }
    } catch (error) {
      console.log("Error in fetching bill", error);
    }
  };
  
  useEffect(() => {
    const supplierUrl = `${endponits.GET_ALL_SUPPLIER}`;
    const organizationUrl = `${endponits.GET_ONE_ORGANIZATION}`;
    const allAccountsUrl = `${endponits.Get_ALL_Acounts}`;


    fetchData(supplierUrl, setSupplierData, AllSuppliers);
    fetchData(organizationUrl, setOneOrganization, getOneOrganization);
    fetchData(allAccountsUrl, setAllAccounts, getAccounts);
  }, []);

  useEffect(() => {
    getBills()
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

  return (
    <div className="mx-5 my-4 text-sm">
      <div className="flex gap-5">
        <Link to={"/purchase/bills"}>
          <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <h4 className="font-bold text-xl text-textColor ">Bills</h4>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 py-5">
        <div className="bg-secondary_main p-5 min-h-max rounded-xl relative col-span-8">
          <div className="grid grid-cols-2 gap-4 mt-5 space-y-1">
            <div>
              <label className="block text-sm mb-1 text-labelColor">
                Supplier Name<span className="text-[#bd2e2e] ">*</span>
              </label>
              <div
                className="relative w-full"
                onClick={() => toggleDropdown("supplier")}
              >
                <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                  <p>
                    {selecteSupplier && selecteSupplier.supplierDisplayName
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
                        <div
                          className="col-span-10 flex cursor-pointer "
                          onClick={() => {
                            setBill((prevState: any) => ({
                              ...prevState,
                              supplierId: supplier._id,
                            }));
                            setOpenDropdownIndex(null);
                            setSelecetdSupplier(supplier);
                          }}
                        >
                          <div>
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
                  <div  className="hover:bg-gray-100 cursor-pointe border border-slate-400 rounded-lg py-4">
                    <AddSupplierModal page="purchase" />
                  </div>
                </div>
              )}
            </div>

            <div className="relative w-full">
            <label className="block text-sm mb-1 text-labelColor">
            Bill <span className="text-[#bd2e2e] -ms-0.5">*</span>
                <input
                  id="billNumber"
                  onChange={handleChange}
                  name="billNumber"
                  value={bill.billNumber}
                  placeholder="Enter Bill Number"
                  className=" block  appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 "
                />
              </label>
            </div>

            {bill.supplierId && (
              <>
                <div>
                  <label className="block text-sm mb-1 text-labelColor">
                    Destination Of Supply<span className="text-[#bd2e2e] ">*</span>
                  </label>
                  <div className="relative w-full">
                    <select
                      onChange={handleChange}
                      name="destinationOfSupply"
                      value={bill.destinationOfSupply}
                      className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="">Select Source Of Supply</option>
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
                    Source of Supply<span className="text-[#bd2e2e] ">*</span>
                  </label>
                  <div className="relative w-full">
                    <select
                      onChange={handleChange}
                      name="sourceOfSupply"
                      value={bill.sourceOfSupply}
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
            )}

            <div className=" w-full">
            <label className="block text-sm  text-labelColor">
            Order Number
                <input
                  name="orderNumber"
                  id="orderNumber"
                  value={bill.orderNumber}
                  onChange={handleChange}
                  placeholder="Enter Order Number"
                  className="border-inputBorder w-full text-sm border rounded text-dropdownText  mt-1 p-2 h-9 "
                />
              </label>
            </div>

            <div>
              <label className="block text-sm mb-1 text-labelColor">
                Purchase Order Date
              </label>

              <input
                type="date"
                value={bill.purchaseOrderDate}
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
                value={bill.expectedShipmentDate}
                name="expectedShipmentDate"
                onChange={handleChange}
                className="border-inputBorder w-full text-sm border rounded p-2 h-9  text-zinc-400"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-labelColor">
                Shipment Preference
              </label>
              <div className="relative w-full">
                <select
                  value={bill.shipmentPreference}
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

            <div className=" w-full">
            <label className="block text-sm text-labelColor">
  Bill Date <span className="text-[#bd2e2e] -ms-0.5">*</span>
  <input
    name="billDate"
    id="billDate"
    type="date"
    value={bill.billDate } 
    onChange={handleChange}
    className="border-inputBorder w-full text-sm border rounded text-dropdownText p-2 h-9 mt-1"
  />
</label>

            </div>
            <div>
              <div>
              <label className="block text-sm text-labelColor">
              Due Date <span className="text-[#bd2e2e] -ms-0.5">*</span>
                  <input
                    name="dueDate"
                    id="dueDate"
                    value={bill.dueDate }
                    onChange={handleChange}
                    type="date"
                    disabled={bill.paymentTerms !== "due on receipt" && bill.paymentTerms !== "Custom"}
                    className="border-inputBorder w-full text-sm border rounded text-dropdownText  p-2 h-9 mt-1 "
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm text-labelColor">
                Payment Terms 
              </label>
              <div className="relative w-full mt-1">
                <select
                  value={bill.paymentTerms}
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

            <div className=" w-full">
            <label className="block text-sm  text-labelColor">
            Payment Mode{" "}
              </label>
              <div className="relative w-full">
                <select
                  value={bill.paymentMode}
                  name="paymentMode"
                  onChange={handleChange}
                  className="block appearance-none mt-1 w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
          </div>

          <div className="mt-9">
            <p className="font-bold text-base">Add Item</p>
            <NeworderTable
              purchaseOrderState={bill}
              setPurchaseOrderState={setBill}
              isInterState={isInterState}
              oneOrganization={oneOrganization}
            />
          </div>

         
          <ViewDetails
          page="bill"
                purchaseOrderState={bill}
                setPurchaseOrderState={setBill}
                allAccounts={allAccounts}
              />


          <br />
        </div>
        <div className="col-span-4">
          <div className="bg-secondary_main p-5 min-h-max rounded-xl relative  mt-0">
            <div className="mt-5">
            <label className="block text-sm mb-1 text-labelColor">
            Add Note
                <input
                  name="addNotes"
                  id="addNotes"
                  value={bill.addNotes}
                  onChange={handleChange}
                  placeholder="Note"
                  className="border-inputBorder w-full text-sm border rounded  p-2 h-[57px] mt-2 "
                />
              </label>
            </div>
            <div className="mt-4">
            <label className="block text-sm mb-1 text-labelColor">
            Terms & Conditions
                <input
                  name="termsAndConditions"
                  id="termsAndConditions"
                  value={bill.termsAndConditions}
                  onChange={handleChange}
                  placeholder="Add Terms & Conditions of your business"
                  className="border-inputBorder w-full text-sm border rounded p-2 h-[57px] mt-2"
                />
              </label>
            </div>
            <div className="text-sm mt-3">
            <label className="block text-sm mb-1 text-labelColor">
            Attach files to the Debit Notes
                <div className="border-inputBorder text-textColor border-gray-800 w-full border-dashed border p-2 rounded flex flex-col gap-2 justify-center items-center bg-white mb-4 mt-2">
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
                    {oneOrganization?.baseCurrency}{" "}
                    {bill.subTotal ? bill.subTotal : "0.00"}{" "}
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
                    {bill.totalItem ? bill.totalItem : "0"}
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
                    {bill.itemTotalDiscount ? bill.itemTotalDiscount : "0.00"}
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
                        {bill.igst ? bill.igst : "0.00"}
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
                          {bill.sgst ? bill.sgst : "0.00"}
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
                          {bill.cgst ? bill.cgst : "0.00"}
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
                      {oneOrganization.baseCurrency} {bill.totalTaxAmount}
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
                    {bill.otherExpense ? bill.otherExpense : "0.00"}
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
                    {bill.freight ? bill.freight : "0.00"}
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
                    {bill.roundOff ? bill.roundOff : "0.00"}
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
                      value={bill.transactionDiscount}
                      onChange={handleChange}
                      step="0.01"
                      name="transactionDiscount"
                      type="text"
                      placeholder="0"
                      className="w-[30px]  focus:outline-none text-center"
                    />
                    <select
                      className="text-xs   text-zinc-400 bg-white relative"
                      value={bill.transactionDiscountType}
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
                      {bill.transactionDiscountAmount
                        ? bill.transactionDiscountAmount
                        : "0.00"}
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
                <p className="text-end">
                  {" "}
                  {oneOrganization.baseCurrency}{" "}
                  {bill.grandTotal ? bill.grandTotal : "0.00"}
                </p>
              </div>
            </div>

    {bill.paymentTerms==="Pay Now"  &&   <>
      <div className="flex gap-4 items-center justify-center mb-2">
              <label className=" text-sm mb-1 text-labelColor min-w-fit left-0">
                Paid Through Account
              </label>
              <div className="relative w-full  ml-auto  ps-5">
                <select
                  onChange={handleChange}
                  value={bill.paidAccountId}
                  name="paidAccountId"
                  className="block appearance-none w-full  text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                >
                  <option value="" selected hidden disabled>Select Account</option>
                  {allAccounts
                    ?.filter((item: { accountSubhead: string }) => item.accountSubhead === "Bank" || item.accountSubhead === "Cash")
                    ?.map((item: { _id: string; accountName: string }) => (
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
            <div className="flex gap-4 items-center justify-center">
  <label
    className="block text-sm mb-1 text-labelColor max-w-fit"
    htmlFor="paidAmount"
  >
    Paid Amount
  </label>

  <div className="ml-auto">
    <input
      className="border-inputBorder w-full text-sm border rounded-lg p-1.5 pl-2 h-9"
      type="text" 
      placeholder="Enter paid amount"
      name="paidAmount"
      value={bill.paidAmount === 0 ? "" : bill.paidAmount}
      onChange={(e) => {
        const { value } = e.target;
        if (/^\d*\.?\d*$/.test(value)) { 
          handleChange(e); 
        }
      }}
    />
  </div>
</div>

              <div className=" flex gap-4 items-center justify-center">
                <label
                  htmlFor="balanceAmount"
                  className="block text-sm mb-1 text-labelColor max-w-fit"
                >
                  Balance Amount
                </label>
                <div className="ml-auto">
                  <input
                    disabled
                    name="balanceAmount"
                    id="balanceAmount"
                    value={bill.balanceAmount}
                    onChange={handleChange}
                    placeholder="Balance Amount"
                    className="border-inputBorder bg-white  text-sm border rounded-lg text-dropdownText  p-2 h-9 mt-2 "
                  />
                </div>
              </div>
       </>}

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
      <div></div>
    </div>
  );
};

export default NewBills;
