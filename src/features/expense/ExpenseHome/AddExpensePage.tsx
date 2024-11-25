import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CehvronDown from "../../../assets/icons/CehvronDown";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import Upload from "../../../assets/icons/Upload";
import Button from "../../../Components/Button";
import SearchBar from "../../../Components/SearchBar";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import AddSupplierModal from "../../Supplier/SupplierHome/AddSupplierModal";
import AddExpenseTable from "./AddExpenseTable";
import ExpenseFilterCards from "./ExpenseFilterCards";
import toast from "react-hot-toast";
import List from "../../../assets/icons/List";
import { ExpenseData } from "../../../Types/Expense";

type Props = {};

function AddExpensePage({}: Props) {
  const [selectedSection, setSelectedSection] = useState<
    "expense" | "mileage" | null
  >(null);

  const navigate = useNavigate();

  const handleRecordClick = (section: "expense" | "mileage") => {
    setSelectedSection(section);
    // setExpenseData({
    //   ...expenseData,
    //   expenseDate: "",
    //   employee: "",
    //   paidThrough: "",
    //   paidThroughId: "",
    //   distance: "",
    //   ratePerKm: "",
    //   vendor: "",
    //   invoice: "",
    //   expenseType: "",
    //   expense: [
    //     {
    //       expenseAccountId: "",
    //       expenseAccount: "",
    //       note: "",
    //       amount: "",
    //     },
    //   ],
    // });
  };

  const [expenseData, setExpenseData] = useState<ExpenseData>({
    expenseDate: "",
    paidThrough: "",
    paidThroughId: "",
    expenseCategory: "",
    expenseType: "",
    hsnCode: "",
    sac: "",
    distance: "",
    ratePerKm: "",
    supplierId: "",
    supplierDisplayName: "",
    gstTreatment: "",
    gstin: "",
    sourceOfSupply: "",
    destinationOfSupply: "",
    amount: 0,
    invoice: "",
    uploadFiles: "",
    taxGroup: "",
    subTotal: 0,
    sgst: 0,
    cgst: 0,
    igst: 0,
    vat: 0,
    grandTotal: 0,
    expenseAccount:"",
    expenseAccountId: "",
    amountIs:"",
    note:"",
    expense: [
      {
        expenseAccountId: "",
        expenseAccount: "",
        note: "",
        taxGroup: "",
        taxExemption: "",
        sgst: 0,
        cgst: 0,
        igst: 0,
        vat: 0,
        sgstAmount: 0,
        cgstAmount: 0,
        amount: 0,
      },
    ],
  });

  const { request: AllSuppliers } = useApi("get", 5009);
  const { request: AddExpenses } = useApi("put", 5008);
  const { request: getAllExpenseCategory } = useApi("get", 5008);
  const [searchValue, setSearchValue] = useState<string>("");
  const [supplierData, setSupplierData] = useState<[]>([]);
  const [category,setCategory]=useState<[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [Itemize, setItemize] = useState<boolean>(true);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
    null
  );
  const [accountData, setAccountData] = useState({
    paidThrough: [],
    liabilities: [],
  });
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleAddExpense = async () => {
    console.log("expense", expenseData);

    try {
      const url = `${endponits.ADD_EXPENSES}`;
      const { response, error } = await AddExpenses(url, expenseData);
      if (!error && response) {
        toast.success(response.data.message);
        navigate("/expense/home");
      } else {
        toast.error(error?.response.data.message);
      }
    } catch (error) {}
  };

  console.log(category)

  const toggleDropdown = (key: string | null) => {
    setOpenDropdownIndex(key === openDropdownIndex ? null : key);
    const supplierUrl = `${endponits.GET_ALL_SUPPLIER}`;
    fetchData(supplierUrl, setSupplierData, AllSuppliers);
  };
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: "uploadFiles"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setExpenseData((prevDetails: any) => ({
          ...prevDetails,
          [key]: base64String,
        }));
      };

      reader.readAsDataURL(file);
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
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
  console.log(expenseData);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const ratePerKm = name === "ratePerKm" ? value : expenseData.ratePerKm;
    const distance = name === "distance" ? value : expenseData.distance;

    const amount = parseFloat(ratePerKm) * parseFloat(distance);

    setExpenseData({
      ...expenseData,
      [name]: value,
      expense: [
        {
          ...expenseData.expense[0],
          amount: amount,
        },
      ],
    });

    if (
      selectedSection === "mileage" &&
      (name === "expenseAccount" || name === "note" || name === "amount")
    ) {
      setExpenseData((prevData) => {
        const updatedExpense = [...prevData.expense];
        updatedExpense[0] = {
          ...updatedExpense[0],
          [name]: value,
        };

        return {
          ...prevData,
          expense: updatedExpense,
        };
      });
    } else {
      setExpenseData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const { request: AllAccounts } = useApi("get", 5001);
  console.log(expenseData, "expenseData");
  useEffect(() => {
    fetchAllAccounts();

    const categoryUrl = `${endponits.GET_ALL_EXPENSE_CATEGORY}`;


    fetchData(categoryUrl, setCategory, getAllExpenseCategory);

  }, []);

  const fetchAllAccounts = async () => {
    try {
      const url = `${endponits.Get_ALL_Acounts}`;
      const { response, error } = await AllAccounts(url);
      if (!error || response) {
        console.log(response?.data);
        setAccountData({
          paidThrough: response?.data.filter(
            (acc: any) =>
              acc.accountSubhead === "Cash" || acc.accountSubhead === "Bank"
          ),
          liabilities: response?.data.filter(
            (acc: any) => acc.accountGroup == "Liability"
          ),
        });
        return;
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  return (
    <>
      <div className="bg-white mx-7 py-7">
        <div className="flex gap-5 items-center mb-4">
          <Link to={"/expense/home"}>
            <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
              <CheveronLeftIcon />
            </div>
          </Link>
          <h4 className="font-bold text-xl text-textColor">Add Expense</h4>
        </div>
        <div className="px-3 mb-4">
          <label className="block mb-1">
            <div className="w-3/4 mx-2 border-dashed border-2 border-neutral-700 p-4 rounded gap-2 text-center mt-2">
              {expenseData.uploadFiles ? (
                <div className="flex justify-center ">
                  <img
                    src={expenseData.uploadFiles}
                    alt=""
                    className="py-0  w-full h-80"
                  />
                </div>
              ) : (
                <>
                  <div className="flex gap-1 justify-center">
                    <Upload />
                    <span>Upload Your Receipt</span>
                  </div>
                  <p className="text-xs mt-1 text-gray-600">
                    Maximum file size allowed is 5MB
                  </p>
                  <div className="mt-2 flex justify-center">
                    <Button onClick={handleButtonClick}>
                      Upload Your Files
                    </Button>
                  </div>
                </>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => handleFileChange(e, "uploadFiles")}
              name="documents"
            />
          </label>
        </div>

        <ExpenseFilterCards onSelectSection={handleRecordClick} />

        {selectedSection === "expense" && (
          <>
            <div className="grid grid-cols-3 gap-4 mt-5 mx-4">
              <div className="col-span-1 space-y-2">
                <label className="text-sm mb-1 text-labelColor">Date</label>
                <div className="relative w-full">
                  <input
                    type="date"
                    name="expenseDate"
                    value={expenseData.expenseDate}
                    onChange={handleChange}
                    className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-3 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Select Date"
                  />
                </div>
              </div>

              {Itemize && (
                <>
                  <div className="col-span-1 space-y-2">
                    <label className="text-sm mb-1 text-labelColor">
                      Expense Account
                    </label>
                    <div className="relative w-full">
                      <select
                        name="expenseAccount"
                        value={expenseData.expenseAccount}
                        onChange={(e) => {
                          const selectedValue = e.target.value; // Extract the selected value
                          // Find the selected account's object
                          const selectedAccount: any =
                            accountData?.paidThrough?.find(
                              (account: any) =>
                                account.accountName === selectedValue
                            );

                          // Update both paidThrough and paidThroughId in expenseData
                          setExpenseData({
                            ...expenseData,
                            expenseAccount: selectedValue,
                            expenseAccountId: selectedAccount
                              ? selectedAccount._id
                              : "", // Safely handle undefined
                          });
                        }}
                        className="appearance-none w-full h-9 text-zinc-700 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                      >
                        <option value="">Select an Account</option>
                        {accountData?.paidThrough &&
                          accountData.paidThrough.map(
                            (account: any, index: number) => (
                              <option key={index} value={account.accountName}>
                                {account.accountName}
                              </option>
                            )
                          )}
                      </select>

                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <CehvronDown color="gray" />
                      </div>
                    </div>
                    <button
                      className="flex items-center  gap-2"
                      onClick={() => setItemize(false)}
                    >
                      <List />{" "}
                      <p className="font-semibold text-[#680000]">Itemize</p>
                    </button>
                  </div>

                  <div className="col-span-1 space-y-2">
                    <label className="text-sm mb-1 text-labelColor">
                      Expense Amount
                    </label>
                    <div className="relative w-full">
                      <input
                        type="number"
                        name="amount"
                        value={expenseData.amount ? expenseData.amount : ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || !isNaN(Number(value))) {
                            handleChange(e);
                          }
                        }}
                        className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        placeholder="Enter Expense Amount"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-1 space-y-2">
                <label className="text-sm mb-1 text-labelColor">
                  Paid Through
                </label>
                <div className="relative w-full">
                  <select
                    name="paidThrough"
                    value={expenseData.paidThrough}
                    onChange={(e) => {
                      const selectedValue = e.target.value; // Extract the selected value
                      // Find the selected account's object
                      const selectedAccount: any =
                        accountData?.paidThrough?.find(
                          (account: any) =>
                            account.accountName === selectedValue
                        );

                      // Update both paidThrough and paidThroughId in expenseData
                      setExpenseData({
                        ...expenseData,
                        paidThrough: selectedValue,
                        paidThroughId: selectedAccount
                          ? selectedAccount._id
                          : "", // Safely handle undefined
                      });
                    }}
                    className="appearance-none w-full h-9 text-zinc-700 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                  >
                    <option value="">Select an Account</option>
                    {accountData?.paidThrough &&
                      accountData.paidThrough.map(
                        (account: any, index: number) => (
                          <option key={index} value={account.accountName}>
                            {account.accountName}
                          </option>
                        )
                      )}
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
              </div>

              <div className="col-span-1 space-y-2 mt-1 cursor-pointer">
                <label className="block text-sm  text-labelColor">
                  Expense Category
                </label>
                <div
                  className="relative w-full"
                  onClick={(e) => {
                    // Prevent the dropdown from opening when clicking the clear button
                    if (!expenseData.supplierDisplayName) {
                      e.stopPropagation();
                      toggleDropdown("Category");
                    }
                  }}
                >
                  <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                    <p>
                      {expenseData.supplierDisplayName &&
                      expenseData.supplierDisplayName
                        ? expenseData.supplierDisplayName
                        : "Select Supplier"}
                    </p>
                  </div>
                  {expenseData.supplierDisplayName ? (
                    <div className="cursor-pointer absolute inset-y-0 right-0.5 -mt-1 flex items-center px-2 text-gray-700">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpenseData({
                            ...expenseData,
                            supplierDisplayName: "",
                          });
                        }}
                        className="text-textColor text-2xl font-light"
                      >
                        &times;
                      </span>
                    </div>
                  ) : (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  )}
                  {/* Dropdown menu */}
                  {openDropdownIndex === "Category" && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-full space-y-1 max-h-72 overflow-y-auto hide-scrollbar"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SearchBar
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        placeholder="Select Supplier"
                      />
                      {filteredSupplier.length > 0 ? (
                        filteredSupplier.map((supplier: any) => (
                          <div
                            key={supplier._id}
                            className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                            onClick={() => {
                              setExpenseData({
                                ...expenseData,
                                supplierDisplayName:
                                  supplier.supplierDisplayName,
                              });
                              setOpenDropdownIndex(null); // Close dropdown after selection
                            }}
                          >
                            <div className="col-span-2 flex items-center justify-center">
                              <img
                                src="https://i.postimg.cc/MHdYrGVP/Ellipse-43.png"
                                alt=""
                              />
                            </div>
                            <div className="col-span-10 flex cursor-pointer">
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
                          <p className="text-[red] text-sm py-4">
                            Supplier Not Found!
                          </p>
                        </div>
                      )}
                      <div className="hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg py-4">
                        <AddSupplierModal page="expense" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {Itemize && (
                <>
                  <div>
                    <label
                      className="block text-sm text-labelColor mt-2.5"
                      htmlFor="itemType"
                    >
                      Expense Type
                    </label>
                    <div className="flex items-center space-x-4 text-textColor text-sm">
                      {/* Goods Option */}
                      <div className="flex gap-2 justify-center items-center mt-1">
                        <div
                          className="grid place-items-center mt-1"
                          onClick={() => {
                            setExpenseData((prev) => ({
                              ...prev,
                              expenseType: "goods", // Use consistent property name
                            }));
                          }}
                        >
                          <input
                            id="goods"
                            type="radio"
                            name="itemType"
                            value="goods"
                            className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
                              expenseData.expenseType === "goods"
                                ? "border-8 border-[#97998E]"
                                : "border-1 border-[#97998E]"
                            }`}
                            checked={expenseData.expenseType === "goods"}
                            readOnly // Avoid unnecessary onChange handling
                          />
                          <div
                            className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                              expenseData.expenseType === "goods"
                                ? "bg-neutral-50"
                                : "bg-transparent"
                            }`}
                          />
                        </div>
                        <label
                          htmlFor="goods"
                          className="text-start font-medium mt-1"
                        >
                          Goods
                        </label>
                      </div>

                      {/* Service Option */}
                      <div className="flex gap-2 justify-center items-center">
                        <div
                          className="grid place-items-center mt-1"
                          onClick={() => {
                            setExpenseData((prev) => ({
                              ...prev,
                              expenseType: "service", // Use consistent property name
                            }));
                          }}
                        >
                          <input
                            id="service"
                            type="radio"
                            name="itemType"
                            value="service"
                            className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
                              expenseData.expenseType === "service"
                                ? "border-8 border-[#97998E]"
                                : "border-1 border-[#97998E]"
                            }`}
                            checked={expenseData.expenseType === "service"}
                            readOnly // Avoid unnecessary onChange handling
                          />
                          <div
                            className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                              expenseData.expenseType === "service"
                                ? "bg-neutral-50"
                                : "bg-transparent"
                            }`}
                          />
                        </div>
                        <label
                          htmlFor="service"
                          className="text-start font-medium mt-1"
                        >
                          Service
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 space-y-2">
                    <label className="text-sm mb-1 text-labelColor">
                      HSN Code
                    </label>
                    <div className="relative w-full">
                      <input
                        type="text"
                        name="hsnCode"
                        value={expenseData.hsnCode}
                        onChange={handleChange}
                        className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        placeholder="Select an employee"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-1 space-y-2 mt-1 cursor-pointer">
                <label className="block text-sm  text-labelColor">Vendor</label>
                <div
                  className="relative w-full"
                  onClick={(e) => {
                    // Prevent the dropdown from opening when clicking the clear button
                    if (!expenseData.supplierDisplayName) {
                      e.stopPropagation();
                      toggleDropdown("supplier");
                    }
                  }}
                >
                  <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                    <p>
                      {expenseData.supplierDisplayName &&
                      expenseData.supplierDisplayName
                        ? expenseData.supplierDisplayName
                        : "Select Supplier"}
                    </p>
                  </div>
                  {/* Clear button for selected vendor */}
                  {expenseData.supplierDisplayName ? (
                    <div className="cursor-pointer absolute inset-y-0 right-0.5 -mt-1 flex items-center px-2 text-gray-700">
                      <span
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent dropdown toggle when clicking clear button
                          setExpenseData({
                            ...expenseData,
                            supplierDisplayName: "",
                          });
                        }}
                        className="text-textColor text-2xl font-light"
                      >
                        &times;
                      </span>
                    </div>
                  ) : (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  )}
                  {/* Dropdown menu */}
                  {openDropdownIndex === "supplier" && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-full space-y-1 max-h-72 overflow-y-auto hide-scrollbar"
                      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the dropdown
                    >
                      <SearchBar
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        placeholder="Select Supplier"
                      />
                      {filteredSupplier.length > 0 ? (
                        filteredSupplier.map((supplier: any) => (
                          <div
                            key={supplier._id}
                            className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                            onClick={() => {
                              setExpenseData({
                                ...expenseData,
                                supplierDisplayName:
                                  supplier?.supplierDisplayName,
                                  supplierId:supplier?._id
                              });
                              setOpenDropdownIndex(null); // Close dropdown after selection
                            }}
                          >
                            <div className="col-span-2 flex items-center justify-center">
                              <img
                                src="https://i.postimg.cc/MHdYrGVP/Ellipse-43.png"
                                alt=""
                              />
                            </div>
                            <div className="col-span-10 flex cursor-pointer">
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
                          <p className="text-[red] text-sm py-4">
                            Supplier Not Found!
                          </p>
                        </div>
                      )}
                      <div className="hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg py-4">
                        <AddSupplierModal page="expense" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-1 space-y-2">
                <label className="text-sm mb-1 text-labelColor">
                  GST Treatment
                </label>
                <div className="relative w-full">
                  <select
                    name="gstTreatment"
                    value={expenseData.gstTreatment}
                  onChange={()=>handleChange}
                    className="appearance-none w-full h-9 text-zinc-700 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                  >
                    <option value="">Select an Account</option>
                    {accountData?.paidThrough &&
                      accountData.paidThrough?.map(
                        (account: any, index: number) => (
                          <option key={index} value={account.accountName}>
                            {account.accountName}
                          </option>
                        )
                      )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
              </div>

              <div className="col-span-1 space-y-2">
                <label className="text-sm mb-1 text-labelColor">
                  Vendor GSTIN
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    name="gstin"
                    value={expenseData.gstin}
                    onChange={handleChange}
                    className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Select an employee"
                  />
                </div>
              </div>

              <div className="col-span-1 space-y-2">
                <label className="text-sm mb-1 text-labelColor">
                  Source of Supply
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    name="sourceOfSupply"
                    value={expenseData.sourceOfSupply}
                    onChange={handleChange}
                    className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Select an employee"
                  />
                </div>
              </div>

              <div className="col-span-1 space-y-2">
                <label className="text-sm mb-1 text-labelColor">
                  Destination of Supply
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    name="destinationOfSupply"
                    value={expenseData.destinationOfSupply}
                    onChange={handleChange}
                    className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Select an employee"
                  />
                </div>
              </div>

              {Itemize && (
                <div className="col-span-1 space-y-2">
                  <label className="text-sm mb-1 text-labelColor">Tax</label>
                  <div className="relative w-full">
                    <select
                      name="taxGroup"
                      value={expenseData.taxGroup}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        const selectedAccount: any =
                          accountData?.paidThrough?.find(
                            (account: any) =>
                              account.accountName === selectedValue
                          );
                        setExpenseData({
                          ...expenseData,
                          paidThrough: selectedValue,
                          paidThroughId: selectedAccount?._id || "",
                        });
                      }}
                      className="appearance-none w-full h-9 text-zinc-700 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                    >
                      <option value="">Select an Account</option>
                      {accountData?.paidThrough &&
                        accountData.paidThrough?.map(
                          (account: any, index: number) => (
                            <option key={index} value={account.accountName}>
                              {account.accountName}
                            </option>
                          )
                        )}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                </div>
              )}

              <div className="col-span-1 space-y-2">
                <label className="text-sm mb-1 text-labelColor">
                  Invoice #
                </label>
                <div className="relative w-full">
                  <input
                    type="number"
                    name="invoice"
                    value={expenseData.invoice}
                    onChange={handleChange}
                    className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Invoice #"
                  />
                </div>
              </div>
              {Itemize && (
                <>
                  <div className="col-span-1 space-y-2">
                    <label className="text-sm mb-1 text-labelColor">
                      Notes
                    </label>
                    <div className="relative w-full">
                      <input
                        type="text"
                        name="note"
                        value={expenseData.note}
                        onChange={handleChange}
                        className="appearance-none w-full  h-16 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                        placeholder="Enter Notes"
                      />
                    </div>
                  </div>
                </>
              )}
         <div className="mb-5">
  <label className="block text-sm text-labelColor" htmlFor="amountIs">
    Amount Is
  </label>
  <div className="flex items-center space-x-4 text-textColor text-sm">
    {/* Tax Inclusive Option */}
    <div className="flex gap-2 justify-center items-center">
      <div
        className="grid place-items-center mt-1"
        onClick={() => {
          setExpenseData((prev) => ({
            ...prev,
            amountIs: "taxInclusive", // Correct property name for taxInclusive
          }));
        }}
      >
        <input
          id="taxInclusive"
          type="radio"
          name="amountIs" // Corrected name
          value="taxInclusive"
          className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
            expenseData.amountIs === "taxInclusive"
              ? "border-8 border-[#97998E]"
              : "border-1 border-[#97998E]"
          }`}
          checked={expenseData.amountIs === "taxInclusive"} // Correct checked logic
          readOnly // Prevent unnecessary onChange handling
        />
        <div
          className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
            expenseData.amountIs === "taxInclusive"
              ? "bg-neutral-50"
              : "bg-transparent"
          }`}
        />
      </div>
      <label htmlFor="taxInclusive" className="text-start font-medium mt-1">
        Tax Inclusive
      </label>
    </div>

    {/* Tax Exclusive Option */}
    <div className="flex gap-2 justify-center items-center">
      <div
        className="grid place-items-center mt-1"
        onClick={() => {
          setExpenseData((prev) => ({
            ...prev,
            amountIs: "taxExclusive", // Correct property name for taxExclusive
          }));
        }}
      >
        <input
          id="taxExclusive"
          type="radio"
          name="amountIs" // Corrected name (should match the previous radio group)
          value="taxExclusive"
          className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
            expenseData.amountIs === "taxExclusive"
              ? "border-8 border-[#97998E]"
              : "border-1 border-[#97998E]"
          }`}
          checked={expenseData.amountIs === "taxExclusive"} // Correct checked logic
          readOnly // Prevent unnecessary onChange handling
        />
        <div
          className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
            expenseData.amountIs === "taxExclusive"
              ? "bg-neutral-50"
              : "bg-transparent"
          }`}
        />
      </div>
      <label htmlFor="taxExclusive" className="text-start font-medium mt-1">
        Tax Exclusive
      </label>
    </div>
  </div>
</div>

            </div>
            {!Itemize && (
              <button
                className="flex items-center  gap-2"
                onClick={() => setItemize(true)}
              >
                <CheveronLeftIcon color="#680000" />{" "}
                <p className="text-sm text-[#680000]">
                  Back to single expense view{" "}
                </p>
              </button>
            )}

            {!Itemize && (
              <AddExpenseTable
                liabilities={accountData.liabilities}
                expenseData={expenseData}
                setExpenseData={setExpenseData}
              />
            )}
          </>
        )}
        {selectedSection === "mileage" && (
          <div className="grid grid-cols-3 gap-4 mt-5 mx-4">
            <div className="col-span-1 space-y-2">
              <label className="text-sm mb-1 text-labelColor">Date</label>
              <div className="relative w-full">
                <input
                  type="date"
                  name="expenseDate"
                  value={expenseData.expenseDate}
                  onChange={handleChange}
                  className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-3 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholder="Select Date"
                />
              </div>
            </div>
            <div className="col-span-1 space-y-2">
              <label className="text-sm mb-1 text-labelColor">Employee</label>
              <div className="relative w-full">
                <input
                  type="text"
                  name="employee"
                  // value={expenseData.}
                  onChange={handleChange}
                  className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholder="Enter Distance"
                />
              </div>
            </div>
            <div className="col-span-1 space-y-2">
              <label className="text-sm mb-1 text-labelColor">
                Expense Account
              </label>
              <div className="relative w-full">
                <select
                  className="text-zinc-400"
                  name="expenseAccount"
                  value={expenseData.expense[0].expenseAccount}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    // Find the selected account's ID
                    const selectedAccount: any = accountData.liabilities?.find(
                      (account: any) => account.accountName === selectedValue
                    );
                    // Update expenseAccount and expenseAccountId
                    setExpenseData((prevData) => {
                      const updatedExpense = [...prevData.expense]; // Clone the expense array
                      updatedExpense[0] = {
                        ...updatedExpense[0], // Retain other properties
                        expenseAccount: selectedValue, // Set selected expense account
                        expenseAccountId: selectedAccount?._id || "", // Set selected account's ID
                      };
                      return {
                        ...prevData,
                        expense: updatedExpense, // Update the expense array
                      };
                    });
                  }}
                >
                  <option value="">Select an Account</option>
                  {accountData.liabilities?.map((account: any) => (
                    <option key={account._id} value={account.accountName}>
                      {account.accountName}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <CehvronDown color="gray" />
                </div>
              </div>
            </div>
            <div className="col-span-1 space-y-2">
              <label className="text-sm mb-1 text-labelColor">
                Paid Through
              </label>
              <div className="relative w-full">
                <select
                  name="paidThrough"
                  value={expenseData.paidThrough}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    // Find the selected account's ID
                    const selectedAccount: any = accountData?.paidThrough?.find(
                      (account: any) => account.accountName === selectedValue
                    );
                    // Update both paidThrough and paidThroughId in expenseData
                    setExpenseData({
                      ...expenseData,
                      paidThrough: selectedValue,
                      paidThroughId: selectedAccount?._id || "",
                    });
                  }}
                  className="appearance-none w-full h-9 text-zinc-700 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                >
                  <option value="">Select an Account</option>
                  {accountData?.paidThrough &&
                    accountData.paidThrough?.map(
                      (account: any, index: number) => (
                        <option key={index} value={account.accountName}>
                          {account.accountName}
                        </option>
                      )
                    )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <CehvronDown color="gray" />
                </div>
              </div>
            </div>
            <div className="col-span-1 space-y-2">
              <label className="text-sm mb-1 text-labelColor">Distance</label>
              <div className="relative w-full">
                <input
                  type="number"
                  name="distance"
                  value={expenseData.distance}
                  onChange={handleChange}
                  className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholder="Enter distance"
                />
              </div>
            </div>
            <div className="col-span-1 space-y-2">
              <label className="text-sm mb-1 text-labelColor">
                Rate Per Km
              </label>
              <div className="relative w-full">
                <input
                  type="number"
                  name="ratePerKm"
                  value={expenseData.ratePerKm}
                  onChange={handleChange}
                  className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholder="Enter Rate"
                />
              </div>
            </div>
            <div className="col-span-1 space-y-2">
              <label className="text-sm mb-1 text-labelColor">Amount</label>
              <div className="relative w-full">
                <input
                  type="number"
                  readOnly
                  name="amount"
                  value={expenseData.expense[0].amount}
                  onChange={handleChange}
                  className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                  placeholder="Enter Amount"
                />
              </div>
            </div>

            <div className="col-span-1 space-y-2 mt-1 cursor-pointer">
              <label className="block text-sm mb-1 text-labelColor">
                Vendor
              </label>
              <div
                className="relative w-full"
                onClick={(e) => {
                  // Prevent the dropdown from opening when clicking the clear button
                  if (!expenseData.supplierDisplayName) {
                    e.stopPropagation();
                    toggleDropdown("supplier");
                  }
                }}
              >
                <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                  <p>
                    {expenseData.supplierDisplayName &&
                    expenseData.supplierDisplayName
                      ? expenseData.supplierDisplayName
                      : "Select Supplier"}
                  </p>
                </div>
                {/* Clear button for selected vendor */}
                {expenseData.supplierDisplayName ? (
                  <div className="cursor-pointer absolute inset-y-0 right-0.5 -mt-1 flex items-center px-2 text-gray-700">
                    <span
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent dropdown toggle when clicking clear button
                        setExpenseData({
                          ...expenseData,
                          supplierDisplayName: "",
                        });
                      }}
                      className="text-textColor text-2xl font-light"
                    >
                      &times;
                    </span>
                  </div>
                ) : (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                )}
                {/* Dropdown menu */}
                {openDropdownIndex === "supplier" && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-full space-y-1 max-h-72 overflow-y-auto hide-scrollbar"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the dropdown
                  >
                    <SearchBar
                      searchValue={searchValue}
                      onSearchChange={setSearchValue}
                      placeholder="Select Supplier"
                    />
                    {filteredSupplier.length > 0 ? (
                      filteredSupplier.map((supplier: any) => (
                        <div
                          key={supplier._id}
                          className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                          onClick={() => {
                            setExpenseData({
                              ...expenseData,
                              supplierDisplayName: supplier.supplierDisplayName,
                            });
                            setOpenDropdownIndex(null); // Close dropdown after selection
                          }}
                        >
                          <div className="col-span-2 flex items-center justify-center">
                            <img
                              src="https://i.postimg.cc/MHdYrGVP/Ellipse-43.png"
                              alt=""
                            />
                          </div>
                          <div className="col-span-10 flex cursor-pointer">
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
                        <p className="text-[red] text-sm py-4">
                          Supplier Not Found!
                        </p>
                      </div>
                    )}
                    <div className="hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg py-4">
                      <AddSupplierModal page="expense" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-1 space-y-2">
              <label className="text-sm mb-1 text-labelColor">Invoice#</label>
              <div className="relative w-full">
                <input
                  type="text"
                  name="invoice"
                  value={expenseData.invoice}
                  onChange={handleChange}
                  className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholder="Enter Invoice"
                />
              </div>
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-sm mb-1 text-labelColor">Notes</label>
              <div className="relative w-full">
                <input
                  type="text"
                  name="note"
                  value={expenseData.expense[0].note}
                  onChange={handleChange}
                  className="appearance-none w-full h-16 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                  placeholder="Enter Notes"
                />
              </div>
            </div>
            <br></br>
          </div>
        )}
      </div>
      <div className="col-span-1 flex justify-end items-start mt-4 space-x-2">
        <Button
          onClick={() => navigate("/expense/home")}
          variant="secondary"
          size="sm"
          className="py-2 text-sm h-10  w-24 flex justify-center"
        >
          Cancel
        </Button>
        <Button
          onClick={handleAddExpense}
          variant="primary"
          size="sm"
          type="submit"
          className=" w-24 text-sm h-10 flex justify-center "
        >
          Save
        </Button>
      </div>
    </>
  );
}

export default AddExpensePage;
