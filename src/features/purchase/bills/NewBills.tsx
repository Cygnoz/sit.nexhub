import { Link, useNavigate } from "react-router-dom";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import { useEffect, useRef, useState } from "react";
import CehvronDown from "../../../assets/icons/CehvronDown";
import SearchBar from "../../../Components/SearchBar";
import Button from "../../../Components/Button";
import PrinterIcon from "../../../assets/icons/PrinterIcon";
import AddSupplierModal from "../../Supplier/SupplierHome/AddSupplierModal";
import NeworderTable from "../purchaseOrder/addPurchaseOrder/NeworderTable";
import Upload from "../../../assets/icons/Upload";
import ScanEye from "../../../assets/icons/ScanEye";
import { Bill } from "./BillBody";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";
import toast from "react-hot-toast";

type Props = {};

const NewBills = ({}: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  // const [selected, setSelected] = useState<string | null>("organization");
  const [supplierData, setSupplierData] = useState<[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<[]>([]);
  const [selecteSupplier, setSelecetdSupplier] = useState<any | []>([]);
  const [oneOrganization, setOneOrganization] = useState<any | []>([]);
  const [placeOfSupplyList, setPlaceOfSupplyList] = useState<any | []>([]);
  const [destinationList, setDestinationList] = useState<any | []>([]);
  const [countryData, setcountryData] = useState<any | any>([]);
  const [isInterState, setIsInterState] = useState<boolean>(false);

  const { request: AllSuppliers } = useApi("get", 5009);
  const { request: allPyamentTerms } = useApi("get", 5004);
  const { request: getOneOrganization } = useApi("get", 5004);
  const { request: getCountries } = useApi("get", 5004);
  const { request: newBillApi } = useApi("post", 5005);
  const navigate = useNavigate();

  const [bill, setBill] = useState<Bill>({
    organizationId: "INDORG0006",
    supplierId: "",
    billNumber: "",
    sourceOfSupply: "",
    destinationOfSupply: "",
    taxMode: "",
    orderNumber: "",
    purchaseOrderDate: "",
    expectedShipmentDate: "",
    paymentTerms: "",
    paymentMode: "",
    billDate: "",
    dueDate: "",
    itemTable: [
      {
        itemId: "",
        itemName: "",
        itemQuantity: 0,
        itemCostPrice: 0,
        itemDiscount: 0,
        itemDiscountType: "",
        itemSgst: 0,
        itemCgst: 0,
        itemIgst: 0,
        itemVat: 0,
        itemSgstAmount: 0,
        itemCgstAmount: 0,
      },
    ],
    otherExpense: 0,
    otherExpenseReason: "",
    vehicleNo: "",
    freight: 0,
    addNotes: "",
    termsAndConditions: "",
    attachFiles: "",
    subTotal: 0,
    totalItem: 0,
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
    paidAmount: 0,
    balanceAmount: 0,
    grandTotal: 0,
  });

  console.log(bill, "bill state");
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
          sourceOfSupply: oneOrganization.state,
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
          destinationOfSupply: selecteSupplier.billingState,
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

    if (name === "transactionDiscount") {
      let discountValue = parseFloat(value) || 0;

      const totalAmount = bill.subTotal || 0;

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
    } else {
      setBill((prevState: any) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

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

  const handleSave = async () => {
    try {
      const url = `${endponits.ADD_BILL}`;
      const { response, error } = await newBillApi(url, bill);
      if (!error && response) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/purchase/purchase-order");
        }, 1000);
      } else {
        toast.error(error?.response.data.message);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (
      bill.paidAmount !== null &&
      bill.paidAmount !== undefined &&
      !isNaN(bill.paidAmount)
    ) {
      const balance = Math.max(
        0,
        (bill.grandTotal || 0) - (bill.paidAmount || 0)
      );
      setBill((prevData) => ({
        ...prevData,
        balanceAmount: balance,
      }));
    }
  }, [bill.paidAmount, bill.grandTotal]);

  useEffect(() => {
    const newGrandTotal = calculateTotalAmount();

    const {
      transactionDiscountType,
      transactionDiscount = 0,
      transactionDiscountAmount = 0,
    } = bill;

    const transactionDiscountValueAMT =
      transactionDiscountType === "percentage"
        ? (transactionDiscount / 100) * Number(newGrandTotal)
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
        grandTotal: updatedGrandTotal.toFixed(2),
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

  useEffect(() => {
    const supplierUrl = `${endponits.GET_ALL_SUPPLIER}`;
    const paymentTermsUrl = `${endponits.GET_PAYMENT_TERMS}`;
    const organizationUrl = `${endponits.GET_ONE_ORGANIZATION}`;

    fetchData(supplierUrl, setSupplierData, AllSuppliers);
    fetchData(paymentTermsUrl, setPaymentTerms, allPyamentTerms);
    fetchData(organizationUrl, setOneOrganization, getOneOrganization);
  }, []);

  useEffect(() => {
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
                Supplier Name
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
                  <div className="hover:bg-gray-100 cursor-pointe border border-slate-400 rounded-lg py-4">
                    <AddSupplierModal page="purchase" />
                  </div>
                </div>
              )}
            </div>

            <div className="relative w-full">
              <label htmlFor="billNumber" className="">
                Bill
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
                    Destination Of Supply
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
                    Source of Supply
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
              <label htmlFor="orderNumber" className="">
                Order Number
                <input
                  name="orderNumber"
                  id="orderNumber"
                  value={bill.orderNumber}
                  onChange={handleChange}
                  placeholder="Enter Order Number"
                  className="border-inputBorder w-full text-sm border rounded text-dropdownText  p-2 h-9 mt-2 "
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
              <label htmlFor="billDate" className="">
                Bill Date
                <input
                  name="billDate"
                  id="billDate"
                  type="date"
                  value={bill.billDate}
                  onChange={handleChange}
                  className="border-inputBorder w-full text-sm border rounded text-dropdownText  p-2 h-9 mt-2 "
                />
              </label>
            </div>
            <div>
              <div>
                <label htmlFor="dueDate" className="">
                  Due Date
                  <input
                    name="dueDate"
                    id="dueDate"
                    value={bill.dueDate}
                    onChange={handleChange}
                    type="date"
                    className="border-inputBorder w-full text-sm border rounded text-dropdownText  p-2 h-9 mt-2 "
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 text-labelColor">
                Payment Terms
              </label>
              <div className="relative w-full">
                <select
                  value={bill.paymentTerms}
                  onChange={handleChange}
                  name="paymentTerms"
                  className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="" className="text-gray">
                    Select Payment Terms
                  </option>
                  {paymentTerms.length > 0 &&
                    paymentTerms.map((item: any) => (
                      <option value=" Due on Receipt" className="text-gray">
                        {item.name}
                      </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <CehvronDown color="gray" />
                </div>
              </div>
            </div>

            <div className=" w-full">
              <label htmlFor="" className="">
                Payment Mode{" "}
              </label>
              <div className="relative w-full">
                <select
                  value={bill.paymentMode}
                  name="paymentMode"
                  onChange={handleChange}
                  className="block appearance-none mt-2 w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                                value={
                                  bill.otherExpense == 0
                                    ? ""
                                    : bill.otherExpense
                                }
                                onChange={handleChange}
                                placeholder="Other expense"
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
                                onChange={handleChange}
                                value={bill.otherExpenseReason}
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
                                onChange={handleChange}
                                value={bill.vehicleNo}
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
                                value={bill.freight == 0 ? "" : bill.freight}
                                onChange={handleChange}
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
                                value={bill.roundOff==0?"":bill.roundOff}
                                onChange={handleChange}
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
              <label htmlFor="addNotes" className="">
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
              <label htmlFor="termsAndConditions" className="">
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
                  type="number"
                  placeholder="Enter paid amount"
                  name="paidAmount"
                  value={bill.paidAmount === 0 ? "" : bill.paidAmount}
                  onChange={handleChange}
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
                  className="border-inputBorder  text-sm border rounded-lg text-dropdownText  p-2 h-9 mt-2 "
                />
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
      <div></div>
    </div>
  );
};

export default NewBills;
