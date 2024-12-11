import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../Components/Button";
import SearchBar from "../../../Components/SearchBar";
import CehvronDown from "../../../assets/icons/CehvronDown";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import NewCustomerModal from "../../Customer/CustomerHome/NewCustomerModal";
import Upload from "../../../assets/icons/Upload";
import SettingsIcons from "../../../assets/icons/SettingsIcon";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";
import NewRecieptTable from "./NewRecieptTable";
import toast from "react-hot-toast";

type Props = {};

type InvoiceType = {
  invoiceId: string;
  salesInvoice: string;
  salesInvoiceDate: string;
  dueDate: string;
  totalAmount: number;
  balanceAmount: number;
  paymentAmount: number;
};

type ReceiptType = {
  customerId: string;
  customerName: string;
  customerDisplayName: string;
  paymentDate: string;
  payment: string;
  paymentMode: string;
  depositAccountId: string;
  reference: string;
  invoice: InvoiceType[]; // Array of InvoiceType
  note: string;
  attachments: string;
  createdDate: string;
  total: number;
  amountReceived: number;
  amountUsedForPayments: number;
};

const initialReceipt: ReceiptType = {
  customerId: "",
  customerName: "",
  customerDisplayName: "",
  paymentDate: "",
  payment: "",
  paymentMode: "",
  depositAccountId: "",
  reference: "",
  invoice: [],
  note: "",
  attachments: "",
  createdDate: "",
  total: 0,
  amountReceived: 0,
  amountUsedForPayments: 0,
};
const NewReceipt = ({ }: Props) => {

  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedCustomer, setSelecetdCustomer] = useState<any>("");
  const [customerData, setCustomerData] = useState<[]>([]);
  const [allAcoounts, setAllAccounts] = useState<[] | any>([]);
  const [allInvoiceData, setAllInvoiceData] = useState<[]>([]);
  const [customerReciept, setCustomerReciept] = useState<[] | any>([]);
  const [recieptState, setRecieptState] = useState<ReceiptType>(initialReceipt);
  console.log(recieptState);


  const { request: AllCustomer } = useApi("get", 5002);
  const { request: getAllInvoice } = useApi("get", 5007);
  const { request: getAccounts } = useApi("get", 5001);
  const { request: addReciept } = useApi("post", 5007);


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

  // check this
  useEffect(() => {
    const grandTotal = customerReciept?.filter((invoice: any) => invoice.paidStatus === "Pending" || invoice.paidStatus === "Overdue")
      .reduce((total: number, invoice: any) => total + invoice.grandTotal, 0);

    setRecieptState((prevData) => ({
      ...prevData,
      total: grandTotal,
    }));
  }, [customerReciept]);
  const fetchAllInvoices = async () => {
    try {
      const url = `${endponits.GET_ALL_SALES_INVOICE}`;
      const { response, error } = await getAllInvoice(url);
      if (error || !response) {
        setAllInvoiceData([]);
        return;
      }
      setAllInvoiceData(response.data.updatedInvoices || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setAllInvoiceData([]);
    }
  };

  useEffect(() => {
    fetchAllInvoices();
  }, []);

  useEffect(() => {
    const accountsUrl = `${endponits.Get_ALL_Acounts}`;
    fetchData(accountsUrl, setAllAccounts, getAccounts);
  }, [])
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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRecieptState((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };



  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpenDropdownIndex(null);
    }
  };


  const handleSave = async () => {
    try {
      const url = `${endponits.ADD_SALES_RECIEPT}`;
      const { response, error } = await addReciept(url, recieptState);
      if (response && !error) {
        const { message} = response.data;
        toast.success(message || "Receipt saved successfully!");
        navigate(-1);
      } else {
        const errorMessage =
          error?.response?.data?.message || "An error occurred while saving.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error during save:", error);
      toast.error("Unexpected error occurred. Please try again.");
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
  const navigate = useNavigate()
  const handleGoBack = () => {
    navigate(-1)
  }
  useEffect(() => {
    if (selectedCustomer) {
      const filtered = allInvoiceData?.filter(
        (item: any) => item.customerId === selectedCustomer._id
      );
      setCustomerReciept(filtered);
    }
  }, [selectedCustomer, allInvoiceData]);


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
            Invoice Payment
          </h4>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 py-5 rounded-lg">
        <div className="col-span-8">
          <div className="bg-[#FFFFFF] p-5 min-h-max rounded-xl relative ">


            <div className=" mt-5 space-y-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
                  <label className="text-sm mb-1 text-labelColor">
                    Customer Name
                  </label>
                  <div
                    className="relative w-full"
                    onClick={() => toggleDropdown("customer")}
                  >
                    <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border
                         border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none
                          focus:bg-white focus:border-gray-500 cursor-pointer">
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
                      className="absolute z-10 bg-white  shadow  rounded-md mt-1 p-2  
                       space-y-1 max-w-72 overflow-y-auto  hide-scrollbar"
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
                              setRecieptState((prevState) => ({
                                ...prevState,
                                customerId: customer._id, customerName: customer.firstName, customerDisplayName: customer.customerDisplayName
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

                <div className="col-span-7">
                  <label className="block text-sm mb-1 text-labelColor">
                    Payment #
                  </label>
                  <div className=" flex items-center border rounded-lg border-inputBorder">

                    <input
                      onChange={handleChange}
                      value={recieptState.payment}
                      name="payment"
                      type="text"
                      className="w-full text-sm p-1.5 pl-2 h-9 border-none outline-none rounded-l-lg"
                    />
                    <div className="p-1.5">
                      <SettingsIcons color="#495160" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">

                <div className="col-span-5">
                  <label className="block text-sm mb-1 text-labelColor">
                    Payment Date
                  </label>
                  <div className="relative w-full">
                    <input
                      onChange={handleChange}
                      name="paymentDate"
                      type="date"
                      className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder
                       text-sm pl-2 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 px-2"
                      value={recieptState.paymentDate}
                    />
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
                  />
                </div>


              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
                  <label className="block text-sm mb-1 text-labelColor">
                    Payment Mode
                  </label>
                  <div className="relative w-full">
                    <select
                      onChange={handleChange}
                      value={recieptState.paymentMode}
                      name="paymentMode"
                      className="block appearance-none w-full h-9  text-zinc-400 bg-white border
                     border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option value="" className="text-gray">
                        Select Payment Mode
                      </option>
                      <option value="Bank Transfer" className="text-gray">
                        Bank Transfer
                      </option>

                      <option value="Cash" className="text-gray">
                        Cash
                      </option>
                      <option value="Bank Transfer" className="text-gray">
                        Check
                      </option>
                      <option value="Credit" className="text-gray">
                        Card
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                </div>

                <div className="col-span-7">
                  <label className="block text-sm mb-1 text-labelColor">
                    Deposit To
                  </label>
                  <div className="relative w-full">
                    <select
                      onChange={handleChange}
                      value={recieptState.depositAccountId}
                      name="depositAccountId"
                      className="block appearance-none w-full h-9  text-zinc-400 bg-white border
                       border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option>Select Payment Through</option>
                      {allAcoounts ? (
                        allAcoounts.map((item: any) => (
                          <option value={item._id} className="text-gray">
                            {item.accountName}
                          </option>
                        ))
                      ) : (
                        <option>No Accounts Available</option>
                      )}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                </div>
              </div>
              <p className="font-bold text-sm">Unpaid Invoices</p>
              {/* table */}

              <NewRecieptTable
                customerReciept={customerReciept}
                recieptState={recieptState}
                setRecieptState={setRecieptState}
              />

              <div className="mt-5 text-textColor">
                <label htmlFor="note" className="text-sm">
                  Add Note
                  <input
                    name="note"
                    onChange={handleChange}
                    value={recieptState.note}
                    id="note"
                    placeholder="Note"
                    className="border-inputBorder w-full text-sm border rounded  p-2 h-[57px] mt-2 "
                  />
                </label>
              </div>

              <div className="text-sm mt-3  text-textColor">
                <label className="block mb-3">
                  Attachments
                  <div className="border-inputBorder border-gray-800 w-full border-dashed border p-2 rounded 
                  flex flex-col gap-2 justify-center items-center bg-white mb-4 mt-2">
                    <span className="text-center inline-flex items-center gap-2">
                      <Upload />
                      Upload File
                    </span>
                    <div className="text-center">Maximum File Size: 1 MB</div>
                  </div>
                  <p className="text-xs mt-1 text-gray-600"></p>
                  <p className="text-xs mt-1 text-gray-600"></p>
                  <input
                    type="file"
                    className="hidden"
                    value=""
                    name="documents"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>


        {/* Right side */}
        <div className="col-span-4 ">
          <div className="bg-secondary_main p-5 min-h-max rounded-xl relative  mt-0  overflow-y-scroll hide-scrollbar">
            <div className=" pb-4  text-dropdownText  border-slate-200 space-y-2">
              <div className="flex w-full">
                <div className="flex-grow">
                  {" "}
                  <p className="whitespace-nowrap">Amount Received</p>
                </div>
                <div className="flex-shrink-0">
                  {" "}
                  <p className="text-end">{recieptState.amountReceived ? recieptState.amountReceived : "0.00"}</p>
                </div>
              </div>

              <div className="flex w-full">
                <div className="flex-grow">
                  <p className="whitespace-nowrap">Amount Used for Payments</p>
                </div>
                <div className="flex-shrink-0">
                  <p>{recieptState.amountUsedForPayments ? recieptState.amountUsedForPayments : "0.00"}</p>
                </div>
              </div>
            </div>
          </div>{" "}
          <div className="flex gap-4 m-5 justify-end">
            {" "}
            <Button variant="secondary" size="sm" onClick={handleGoBack}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save
            </Button>{" "}
          </div>
        </div>
      </div>
    </div>


  );
};

export default NewReceipt;