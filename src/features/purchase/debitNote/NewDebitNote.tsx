import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CehvronDown from "../../../assets/icons/CehvronDown";
import PrinterIcon from "../../../assets/icons/PrinterIcon";
import Button from "../../../Components/Button";
import SearchBar from "../../../Components/SearchBar";
import AddSupplierModal from "../../Supplier/SupplierHome/AddSupplierModal";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import Upload from "../../../assets/icons/Upload";
import { DebitNoteBody } from "../../../Types/DebitNot";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";
import { SupplierResponseContext } from "../../../context/ContextShare";
import DebitNoteTable from "./DebitNoteTable";
import toast from "react-hot-toast";

const initialSupplierBillState: DebitNoteBody = {
  organizationId: "",
  supplierId: "",
  supplierDisplayName: "",
  sourceOfSupply: "",
  destinationOfSupply: "",
  taxMode: "",

  billId: "",
  billNumber: "",
  billDate: "",
  billType: "",
  debitNote: "",
  orderNumber: "",
  supplierDebitDate: "",
  paymentMode: "",
  depositTo: "",
  subject: "",

  items: [
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
      itemSgstAmount: "",
      itemCgstAmount: "",
    },
  ],

  addNotes: "",
  attachFiles: "",

  subTotal: "",
  totalItem: "",
  sgst: "",
  cgst: "",
  igst: "",
  totalTaxAmount: "",
  itemTotalDiscount: "",
  grandTotal: "",
};

type Props = {};

const NewDebitNote = ({}: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
    null
  );
  const [supplierData, setSupplierData] = useState<[]>([]);
  const [selecteSupplier, setSelecetdSupplier] = useState<any | []>([]);
  const [placeOfSupplyList, setPlaceOfSupplyList] = useState<any | []>([]);
  const [destinationList, setDestinationList] = useState<any | []>([]);
  const [countryData, setcountryData] = useState<any | any>([]);
  const [oneOrganization, setOneOrganization] = useState<any | []>([]);
  const [DBPrefix, setDBPrefix] = useState<any | []>([]);
  const [allBills, setAllBills] = useState<any | []>([]);
  const [selectedBill, setSelectedBill] = useState<any | []>([]);
  const [isInterState, setIsInterState] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<any>([]);
  const [debitNoteState, setDebitNoteState] = useState<DebitNoteBody>(
    initialSupplierBillState
  );
  const [errors,setErrors]=useState({
    billNumber:false,
    debitDate:false,
    supplierId:false,
    sourceOfSupply:false,
    destinationOfSupply:false,
    paymentMode:false,
    depositTo:false,
    itemTable:false,
  })

  const { request: AllSuppliers } = useApi("get", 5009);
  const { request: getCountries } = useApi("get", 5004);
  const { request: getOneOrganization } = useApi("get", 5004);
  const { request: getPrefix } = useApi("get", 5005);
  const { request: getAllBills } = useApi("get", 5005);
  const { request: getAccountData } = useApi("get", 5001);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { supplierResponse } = useContext(SupplierResponseContext)!;
  const navigate = useNavigate();
  const { request: newDebitNoteApi } = useApi("post", 5005);

  console.log(debitNoteState, "debitnote state");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setDebitNoteState({
      ...debitNoteState,
      [name]: value,
    });
  };

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
    return data?.filter((item: any) =>
      item[displayNameKey]?.toLowerCase().includes(searchValue.toLowerCase())
    );
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
  const handleDestination = () => {
    if (oneOrganization?.organizationCountry) {
      const country = countryData.find(
        (c: any) =>
          c.name.toLowerCase() ===
          oneOrganization.organizationCountry.toLowerCase()
      );
      // console.log(country, "country");
      if (oneOrganization) {
        setDebitNoteState((preData) => ({
          ...preData,
          destinationOfSupply: oneOrganization.state,
        }));
      }
      if (country) {
        const states = country.states;
        // console.log(states);
        setDebitNoteState((preData) => ({
          ...preData,
        }));
        setPlaceOfSupplyList(states);
      } else {
        console.log("Country not found");
      }
    } else {
      console.log("No country selected");
    }
  };
  const handleplaceofSupply = () => {
    if (selecteSupplier.billingCountry) {
      const country = countryData.find(
        (c: any) =>
          c.name.toLowerCase() === selecteSupplier.billingCountry.toLowerCase()
      );
      if (selecteSupplier) {
        setDebitNoteState((preData) => ({
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
  

  const filteredSupplier = filterByDisplayName(
    supplierData,
    "supplierDisplayName",
    searchValue
  );
  console.log(errors,"error")

  const handleSave = async () => {
    const newErrors = { ...errors };
  
    newErrors.billNumber = 
    typeof debitNoteState.billNumber === "string" 
      ? debitNoteState.billNumber.trim() === "" 
      : false;
  
  
    if (debitNoteState.supplierId.trim() === "") {
      newErrors.supplierId = true;
    } else {
      newErrors.supplierId = false;
    }
  
    if (debitNoteState.destinationOfSupply.trim() === "") {
      newErrors.destinationOfSupply = true;
    } else {
      newErrors.destinationOfSupply = false;
    }
  
    if (debitNoteState.sourceOfSupply.trim() === "") {
      newErrors.sourceOfSupply = true;
    } else {
      newErrors.sourceOfSupply = false;
    }
    if (debitNoteState.supplierDebitDate.trim() === "") {
      newErrors.debitDate = true;
    } else {
      newErrors.debitDate = false;
    }
    if (debitNoteState.paymentMode.trim() === "") {
      newErrors.paymentMode = true;
    } else {
      newErrors.paymentMode = false;
    }
    if (debitNoteState.depositTo.trim() === "") {
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
      const url = `${endponits.ADD_DEBIT_NOTE}`;
      const { response, error } = await newDebitNoteApi(url, debitNoteState);
      if (!error && response) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/purchase/debitnote");
        }, 1000);
      } else {
        toast.error(error?.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (debitNoteState?.destinationOfSupply == "") {
      setIsInterState(false);
    } else {
      if (
        debitNoteState?.sourceOfSupply !== debitNoteState?.destinationOfSupply
      ) {
        setIsInterState(true);
      } else {
        setIsInterState(false);
      }
    }
  }, [debitNoteState?.sourceOfSupply, debitNoteState?.destinationOfSupply]);

  useEffect(() => {
    const supplierUrl = `${endponits.GET_ALL_SUPPLIER}`;
    const organizationUrl = `${endponits.GET_ONE_ORGANIZATION}`;
    const getAllBillsUrl = `${endponits.GET_ALL_BILLS}`;
    const getPrefixUrl = `${endponits.GET_DEBIT_NOTE_PREFIX}`;
    const allAccountsUrl = `${endponits.Get_ALL_Acounts}`;

    fetchData(organizationUrl, setOneOrganization, getOneOrganization);
    fetchData(supplierUrl, setSupplierData, AllSuppliers);
    fetchData(getAllBillsUrl, setAllBills, getAllBills);
    fetchData(getPrefixUrl, setDBPrefix, getPrefix);
    fetchData(allAccountsUrl, setAccounts, getAccountData);
  }, []);

  useEffect(() => {
    setDebitNoteState((preData) => ({
      ...preData,
      debitNote: DBPrefix,
    }));
  }, [DBPrefix]);

  useEffect(() => {
    supplierResponse;
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
        <Link to={"/purchase/debitNote"}>
          <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <h4 className="font-bold text-xl text-textColor ">Debit Note</h4>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 py-5">
        <div className="bg-secondary_main p-5 min-h-max rounded-xl relative col-span-8">
          <div className="grid grid-cols-2 gap-4 mt-5 space-y-">
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
                  {filteredSupplier?.length > 0 ? (
                    filteredSupplier?.map((supplier: any) => (
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
                            setDebitNoteState((prevState) => ({
                              ...prevState,
                              supplierId: supplier._id,
                              supplierDisplayName: supplier.supplierDisplayName,
                              orderNumber: "",
                              billNumber: "",
                              billId: "",
                              billDate: "",
                            }));
                            setOpenDropdownIndex(null);
                            setSelecetdSupplier(supplier);
                            setSelectedBill([]);
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
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center border-slate-400 border rounded-lg">
                      <p className="text-[darkRed] text-sm py-4">
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
              <label className="block text-sm mb-1 text-labelColor">
                Debit Note
                <input
                  value={debitNoteState.debitNote}
                  name="debitNote"
                  id=""
                  onChange={handleInputChange}
                  disabled
                  className=" block  appearance-none w-full h-9  mt-0.5 text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 "
                />
              </label>
            </div>

            {debitNoteState.supplierId && (
              <>
                <div>
                  <label className="block text-sm mb-1 text-labelColor">
                    Source Of Supply<span className="text-[#bd2e2e] ">*</span>
                  </label>
                  <div className="relative w-full">
                    <select
                      onChange={handleInputChange}
                      name="sourceOfSupply"
                      value={debitNoteState.sourceOfSupply}
                      className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="">Select Source Of Supply</option>
                      {debitNoteState &&
                        placeOfSupplyList?.map((item: any, index: number) => (
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
                    Destination of Supply<span className="text-[#bd2e2e] ">*</span>
                  </label>
                  <div className="relative w-full">
                    <select
                      onChange={handleInputChange}
                      name="destinationOfSupply"
                      value={debitNoteState.destinationOfSupply}
                      className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="">Select Destination Of Supply</option>
                      {destinationList &&
                        destinationList?.map((item: any, index: number) => (
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
              <label
                htmlFor=""
                className="block text-sm mb-1 text-labelColor"
                onClick={() => toggleDropdown("bill")}
              >
                Bill#<span className="text-[#bd2e2e] ">*</span>
              </label>
              <div
                className="relative w-full "
                onClick={() => {
                  toggleDropdown("bill");
                }}
              >
                <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                  <p>
                    {selectedBill && selectedBill.billNumber
                      ? selectedBill.billNumber
                      : "Select Bill"}
                  </p>
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <CehvronDown color="gray" />
                </div>
              </div>
              {openDropdownIndex === "bill" && (
                <div
                  ref={dropdownRef}
                  className="absolute z-10 bg-white  shadow  rounded-md mt-1 p-2 w-[30%] space-y-1 max-h-72 overflow-y-auto  hide-scrollbar"
                >
                  <SearchBar
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    placeholder="Search Bill"
                  />
                  {selecteSupplier &&
                  Object.keys(selecteSupplier).length > 0 ? (
                    allBills?.allBills?.length > 0 ? (
                      allBills?.allBills?.filter(
                        (bill: any) => bill.supplierId === selecteSupplier?._id
                      ).length > 0 ? (
                        allBills?.allBills?.filter(
                          (bill: any) =>
                            bill.supplierId === selecteSupplier?._id
                        )?.map((bill: any) => (
                          <div
                            key={bill._id}
                            className="gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                          >
                            <div
                              className="flex cursor-pointer"
                              onClick={() => {
                                setDebitNoteState((prevState) => ({
                                  ...prevState,
                                  billId: bill._id,
                                  billNumber: bill.billNumber,
                                  billDate: bill.billDate,
                                  orderNumber: bill.orderNumber,
                                }));
                                setOpenDropdownIndex(null);
                                setSelectedBill(bill);
                              }}
                            >
                              <div>
                                <p className="font-bold text-sm">
                                  {bill.billNumber}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Supplier: {bill.supplierDisplayName}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center border-slate-400 border rounded-lg">
                          <p className="text-[red] text-sm py-4">
                            Bills Not Found!
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="text-center border-slate-400 border rounded-lg">
                        <p className="text-[red] text-sm py-4">
                          Bills Not Found!
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="text-center border-slate-400 border rounded-lg">
                      <p className="text-[darkRed] px-4 text-sm py-4">
                        Please select a supplier to view bills !
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1 text-labelColor">
                Bill Type<span className="text-[#bd2e2e] ">*</span>
              </label>
              <div className="relative w-full">
                <select
                  name="billType"
                  value={debitNoteState.billType}
                  onChange={handleInputChange}
                  className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="" className="text-gray">
                    Select Bill Type
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

            <div className=" w-full">
              <label className="block text-sm mb-1 text-labelColor">
                Order Number
                <input
                disabled
                  name="orderNumber"
                  value={debitNoteState.orderNumber}
                  onChange={handleInputChange}
                  id=""
                  placeholder="Value"
                  className=" block  appearance-none w-full h-9  mt-0.5 text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 "
                />
              </label>
            </div>
            <div>
              <label className="block text-sm mb-1 text-labelColor">
                Supplier Debit Date<span className="text-[#bd2e2e] ">*</span>
              </label>
              <div className="relative w-full">
                <input
                  type="date"
                  name="supplierDebitDate"
                  value={debitNoteState.supplierDebitDate}
                  onChange={handleInputChange}
                  id=""
                  placeholder="Value"
                  className=" block  appearance-none w-full h-9  mt-0.5 text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 "
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1 text-labelColor">
                Payment Mode<span className="text-[#bd2e2e] ">*</span>
              </label>
              <div className="relative w-full">
                <select
                  onChange={handleInputChange}
                  name="paymentMode"
                  value={debitNoteState.paymentMode}
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

            <div>
              <label className="block text-sm mb-1 text-labelColor">
                Deposit To<span className="text-[#bd2e2e] ">*</span>
              </label>
              <div className="relative w-full">
                <select
                  onChange={handleInputChange}
                  name="depositTo"
                  value={debitNoteState.depositTo}
                  className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="">Select Account</option>
                  {accounts
                      ?.filter((item: any) => item.accountSubhead === "Bank" || item.accountSubhead=="Cash")
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

            <div className=" w-full">
              <label className="block text-sm mb-1 text-labelColor">
                Subject
                <input
                  name="subject"
                  onChange={handleInputChange}
                  id=""
                  value={debitNoteState.subject}
                  placeholder="Enter a subject within 250 Characters"
                  className="border-inputBorder w-full text-sm border rounded text-dropdownText  p-2 h-9 "
                />
              </label>
            </div>
          </div>
          <div className="mt-9">
            <p className="font-bold text-base">Add Item</p>
            <DebitNoteTable
              purchaseOrderState={debitNoteState}
              setPurchaseOrderState={setDebitNoteState}
              isInterState={isInterState}
              oneOrganization={oneOrganization}
              selectedBill={selectedBill}
            />{" "}
          </div>

          <br />
          <div className="mt-2">
            <label htmlFor="" className="block text-sm mb-1 text-labelColor">
              Add Note
              <input
                name="addNotes"
                id=""
                value={debitNoteState.addNotes}
                onChange={handleInputChange}
                placeholder="Note"
                className="border-inputBorder w-full text-sm border rounded  p-2 h-[57px] "
              />
            </label>
          </div>
        </div>
        <div className="col-span-4">
          <div className="mt-0">
            <label htmlFor="" className="block text-sm mb-1 text-labelColor">
              Terms & Conditions
              <input
                name=""
                id=""
                placeholder="Add Terms & Conditions of your business"
                className="border-inputBorder w-full text-sm border rounded p-2 h-[57px] "
              />
            </label>
          </div>
          <div className="text-sm mt-3">
            <label className="block  text-sm mb-1 text-labelColor">
              Attach files to the Debit Notes
              <div className="border-inputBorder border-gray-800 w-full border-dashed border p-2 rounded flex flex-col gap-2 justify-center items-center bg-white mb-4 ">
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
                    {debitNoteState.subTotal ? debitNoteState.subTotal : "0.00"}{" "}
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
                    {debitNoteState.totalItem ? debitNoteState.totalItem : "0"}
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
                        {debitNoteState.igst ? debitNoteState.igst : "0.00"}
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
                          {debitNoteState.sgst ? debitNoteState.sgst : "0.00"}
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
                          {debitNoteState.cgst ? debitNoteState.cgst : "0.00"}
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
                      {debitNoteState.totalTaxAmount}
                    </p>
                  </div>
                </div>
              )}
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
                  {oneOrganization.baseCurrency}{" "}
                  {debitNoteState.grandTotal
                    ? debitNoteState.grandTotal
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
      <div></div>
    </div>
  );
};

export default NewDebitNote;
