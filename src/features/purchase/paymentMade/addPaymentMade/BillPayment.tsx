import CehvronDown from "../../../../assets/icons/CehvronDown";
import Button from "../../../../Components/Button";
import { useEffect, useRef, useState } from "react";
import SearchBar from "../../../../Components/SearchBar";
// import CirclePlus from "../../../../assets/icons/circleplus";
import NewPaymentMadeOrderTable from "./NewPaymentMadeOrderTable";
import Upload from "../../../../assets/icons/Upload";
// import ScanEye from "../../../../assets/icons/ScanEye";
// import { PrinterIcon } from "@heroicons/react/16/solid";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import SupplierView from "../../CommonComponents/SupplierView";
import avatar from "../../../../assets/Images/avatar-3814049_1280.webp";

interface UnpaidBill {
  billDate: string;
  dueDate: string;
  billId: string;
  billNumber: string;
  billAmount: number | string;
  amountDue: number | string;
  payment: number | string;
}

interface SupplierPayment {
  supplierId: string;
  supplierDisplayName: string;
  payment: string;
  paymentDate: string;
  paymentMade: string;
  paymentMode: string;
  paidThroughAccountId: string;
  reference: string;
  notes: string;
  attachments: string;
  createdDate: string;
  updatedDate: string;
  unpaidBills: UnpaidBill[];
  total: number;
  amountPaid: number;
  amountUsedForPayments: number;
  totalBillAmount: number;
}

const initialSupplierPayment: SupplierPayment = {
  supplierId: "",
  supplierDisplayName: "",
  payment: "",
  paymentDate: new Date().toISOString().slice(0, 10),
  paymentMade: "",
  paymentMode: "",
  paidThroughAccountId: "",
  reference: "",
  notes: "",
  attachments: "",
  createdDate: "",
  updatedDate: "",
  unpaidBills: [
    {
      billDate: "",
      dueDate: "",
      billId: "",
      billNumber: "",
      billAmount: "",
      amountDue: "",
      payment: "",
    },
  ],
  total: 0,
  amountPaid: 0,
  amountUsedForPayments: 0,
  totalBillAmount: 0,
};

type Props = { page?: any };

const NewPaymentMade = ({ page }: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedSupplier, setSelecetdSupplier] = useState<any | []>([]);
  const [supplierData, setSupplierData] = useState<[]>([]);
  const [allBillsData, setAllBillsData] = useState<[]>([]);
  const [supplierBills, setSupplierBills] = useState<[] | any>([]);
  const [allAcoounts, setAllAccounts] = useState<[] | any>([]);
  const [isFullAmt, setIsFullAmount] = useState<boolean>(false);
  const [paymentState, setPaymentState] = useState<SupplierPayment>(
    initialSupplierPayment
  );

  const { request: AllSuppliers } = useApi("get", 5009);
  const { request: getAllBills } = useApi("get", 5005);
  const { request: getAccounts } = useApi("get", 5001);
  const { request: addPayment } = useApi("post", 5005);
  const { request: getPrefix } = useApi("get", 5005);
  const { request: getOnepayment } = useApi("get", 5005);
  const { request: editPayment } = useApi("put", 5005);

  const { id } = useParams();

  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const getBillsUrl = `${endponits.GET_ALL_BILLS}`;
  const accountsUrl = `${endponits.Get_ALL_Acounts}`;

  // console.log(paymentState);
  // console.log(supplierBills, "supplierBills");
  // console.log(allAcoounts,"allAccounts")

  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
    null
  );

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
    setPaymentState((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const filterByDisplayName = (
    data: any[],
    displayNameKey: string,
    searchValue: string
  ) => {
    return data.filter(
      (item: any) =>
        item.status === "Active" &&
        item[displayNameKey]?.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const filteredSupplier = filterByDisplayName(
    supplierData,
    "supplierDisplayName",
    searchValue
  );

  const fetchData = async (
    url: string,
    setData: React.Dispatch<React.SetStateAction<any>>,
    fetchFunction: (url: string) => Promise<any>
  ) => {
    try {
      const { response, error } = await fetchFunction(url);
      if (!error && response) {
        if (url === getBillsUrl) {
          setData(response.data.allBills);
        } else if (url === accountsUrl) {
          const filteredData = response.data.filter(
            (item: any) => item.accountGroup === "Asset"
          );
          setData(filteredData);
        } else {
          setData(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log(paymentState, "paymentState");
  const getlastPrefix = async () => {
    try {
      const url = `${endponits.PAYMENT_LAST_PREFIX}`;
      const { response, error } = await getPrefix(url);

      if (!error && response) {
        setPaymentState((prevData) => {
          return {
            ...prevData,
            paymentMade: response.data,
          };
        });
      }
    } catch (error) {
      // Handle the error appropriately here, e.g., log it or show a message to the user
      console.error("Error fetching payment prefix:", error);
    }
  };

  const handleSave = async () => {
    try {
      let url;
      let api;
      if (page === "edit") {
        url = `${endponits.EDIT_PAYMENT_MADE}/${id}`;
        api = editPayment;
      } else {
        url = `${endponits.ADD_PAYMET_MADE}`;
        api = addPayment;
      }
      const { response, error } = await api(url, paymentState);
      if (!error && response) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/purchase/payment-made");
        }, 1000);
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {}
  };

  useEffect(() => {
    const grandTotal = supplierBills
      ?.filter(
        (bill: any) =>
          bill.paidStatus === "Pending" || bill.paidStatus === "Overdue"
      )
      .reduce((total: number, bill: any) => total + bill.grandTotal, 0);

    setPaymentState((prevData) => ({
      ...prevData,
      totalBillAmount: grandTotal,
    }));
  }, [supplierBills]);

  useEffect(() => {
    if (page !== "edit") {
      getlastPrefix();
    } else {
      const paymentUrl = `${endponits.GET_PAYMENT}/${id}`;
      fetchData(paymentUrl, setPaymentState, getOnepayment);
    }
    const supplierUrl = `${endponits.GET_ALL_SUPPLIER}`;

    fetchData(supplierUrl, setSupplierData, AllSuppliers);
    fetchData(accountsUrl, setAllAccounts, getAccounts);
    fetchData(getBillsUrl, setAllBillsData, getAllBills);
  }, []);

  useEffect(() => {
    if (paymentState && supplierData) {
      const { supplierId } = paymentState;
      if (supplierId) {
        const supplier = supplierData.find(
          (supplier: any) => supplier._id === supplierId
        );
        if (supplier) {
          setSelecetdSupplier(supplier);
        }
      }
    }
  }, [paymentState, supplierData]);

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
    if (selectedSupplier) {
      const filtered = allBillsData?.filter(
        (item: any) => item.supplierId === selectedSupplier._id
      );
      setSupplierBills(filtered);
    }
  }, [selectedSupplier, allBillsData]);

  return (
    <div className="px-8">
      <div className="grid grid-cols-12 gap-4 py-5 rounded-lg">
        {/* scroll y */}
        <div
          className="col-span-8 h-[vh] overflow-y-scroll"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>
            {`
      /* Hide scrollbar for Chrome, Safari, and Opera */
      .col-span-8::-webkit-scrollbar {
        display: none;
            }
              `}
          </style>
          <div className="bg-secondary_main p-5 min-h-max rounded-xl relative ">
            <p className="text-textColor text-xl font-bold"></p>
            <div className=" space-y-3">
              <div className="cols-span-12">
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
                        {selectedSupplier &&
                        selectedSupplier.supplierDisplayName
                          ? selectedSupplier.supplierDisplayName
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
                          <div className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointe border border-slate-400 rounded-lg bg-lightPink cursor-pointer hover:bg-lightRose">
                            <div className="col-span-2 flex items-center justify-center">
                              <img
                                className="rounded-full "
                                src={
                                  supplier.supplierProfile
                                    ? supplier.supplierProfile
                                    : avatar
                                }
                                alt=""
                              />
                            </div>
                            <div
                              className="col-span-10 flex cursor-pointer "
                              onClick={() => {
                                setPaymentState((prevState: any) => ({
                                  ...prevState,
                                  supplierId: supplier._id,
                                  supplierDisplayName:
                                    supplier.supplierDisplayName,
                                }));
                                setIsFullAmount(false);
                                setOpenDropdownIndex(null);
                                setSelecetdSupplier(supplier);
                              }}
                            >
                              <div
                                className={` items-center space-y-1 ${
                                  supplier.mobile
                                    ? "justify-start"
                                    : "flex justify-center"
                                }`}
                              >
                                <p className="font-bold text-sm">
                                  {supplier.supplierDisplayName}
                                </p>
                                {supplier.mobile && (
                                  <p className="text-xs text-gray-500">
                                    Phone: {supplier.mobile}
                                  </p>
                                )}
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
                    </div>
                  )}
                </div>
              </div>
              <div className="cols-12 hidden">
                <SupplierView selectedSupplier={selectedSupplier} />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                {/* <div className="">
                  <label className="block text-sm mb-1 text-labelColor">
                    Payment Made
                  </label>
                  <input
                    placeholder="Enter Payment Made"
                    type="text"
                    value={
                      paymentState.paymentMade ? paymentState.paymentMade : ""
                    }
                    onChange={handleChange}
                    name="paymentMade"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
                  />
                  <div className="flex mt-2 gap-2 items-center">
                    <input
                      type="checkbox"
                      onChange={handleChangeAmt}
                      checked={isFullAmt}
                      className="bg-checkBox checkBox h-3 w-3"
                    />{" "}
                    <p className="text-xs text-textColor">
                      Pay Full Amount ({paymentState.totalBillAmount})
                    </p>
                  </div>
                </div> */}
                <div className="">
                  <label className="block text-sm mb-1 text-labelColor">
                    Payment Date <span className="text-[#bd2e2e] ">*</span>
                  </label>
                  <input
                    placeholder="Value"
                    type="date"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
                    value={paymentState.paymentDate}
                    name="paymentDate"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="">
                  <label className="block text-sm mb-1 text-labelColor">
                    Payment ID
                  </label>

                  <input
                    onChange={handleChange}
                    value={paymentState.paymentMade}
                    name="paymentMade"
                    type="text"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
                  />
                </div>
                <div className="">
                  <label className="block text-sm mb-1 text-labelColor">
                    Refence
                  </label>
                  <input
                    onChange={handleChange}
                    value={paymentState.reference}
                    name="reference"
                    placeholder="reference"
                    type="text"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4  mt-5">
              <div>
                <label className="block text-sm mb-1 text-labelColor">
                  Payment Mode <span className="text-[#bd2e2e] ">*</span>
                </label>
                <div className="relative w-full">
                  <select
                    value={paymentState.paymentMode}
                    name="paymentMode"
                    onChange={handleChange}
                    className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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

              <div>
                <label className="block text-sm mb-1 text-labelColor">
                  Paid Through <span className="text-[#bd2e2e] ">*</span>
                </label>
                <div className="relative w-full">
                  <select
                    onChange={handleChange}
                    value={paymentState.paidThroughAccountId}
                    name="paidThroughAccountId"
                    className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  >
                    <option>Select Payment Through</option>
                    {allAcoounts
                      ?.filter(
                        (item: { accountSubhead: string }) =>
                          item.accountSubhead === "Bank" ||
                          item.accountSubhead === "Cash"
                      )
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
            </div>

            <div className="mt-5">
              <p className="font-bold text-base">Unpaid Bill</p>
              <NewPaymentMadeOrderTable
                page={page}
                isFullAmt={isFullAmt}
                supplierBills={supplierBills}
                paymentState={paymentState}
                setPaymentState={setPaymentState}
              />
            </div>

            <div className="mt-5 text-textColor">
              <label htmlFor="notes" className="text-sm">
                Add Note
                <input
                  name="notes"
                  id="notes"
                  value={paymentState.notes}
                  onChange={handleChange}
                  placeholder="Note"
                  className="border-inputBorder w-full text-sm border rounded  p-2 h-[57px] mt-2 "
                />
              </label>
            </div>

            <div className="text-sm mt-3  text-textColor hidden">
              <label className="block mb-3">
                Attachments
                <div className="border-inputBorder border-gray-800 w-full border-dashed border p-2 rounded flex flex-col gap-2 justify-center items-center bg-white mb-4 mt-2">
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
                  // onChange={(e)=>handleFileChange(e)}
                  // onChange={(e)=>handleFileChange(e)}
                />
              </label>
            </div>
          </div>
        </div>
        <div className="col-span-4 ">
          <div className="bg-secondary_main p-5 min-h-max rounded-xl relative  mt-0  overflow-y-scroll hide-scrollbar">
            <div className=" pb-4  text-dropdownText  border-slate-200 space-y-2">
              <div className="flex w-full">
                <div className="flex-grow">
                  {" "}
                  <p className="whitespace-nowrap">Amount Paid</p>
                </div>
                <div className="flex-shrink-0">
                  {" "}
                  <p className="text-end">
                    {paymentState.amountPaid ? paymentState.amountPaid : "0.00"}
                  </p>
                </div>
              </div>

              <div className="flex w-full">
                <div className="flex-grow">
                  <p className="whitespace-nowrap">Amount Used for Payments</p>
                </div>
                <div className="flex-shrink-0">
                  <p>
                    {paymentState.amountUsedForPayments
                      ? paymentState.amountUsedForPayments
                      : "0.00"}
                  </p>
                </div>
              </div>

              {/* <div className="flex ">
                <div className="w-[75%]">
                  <p> Amount Refunded</p>
                </div>
                <div className="w-full text-end">
                  <p className="text-end">0.00</p>
                </div>
              </div> */}

              {/* <div className="flex ">
                <div className="w-[75%]">
                  <p> Amount In Excess</p>
                </div>
                <div className="w-full text-end">
                  <p className="text-end">
                    {paymentState.paymentMade > paymentState.amountPaid
                      ? paymentState.paymentMade - paymentState.amountPaid
                      : "0.00"}
                  </p>
                </div>
              </div> */}
            </div>
          </div>{" "}
          <div className="flex gap-4 m-5 justify-end">
            {" "}
            <Button variant="secondary" size="sm">
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

export default NewPaymentMade;
