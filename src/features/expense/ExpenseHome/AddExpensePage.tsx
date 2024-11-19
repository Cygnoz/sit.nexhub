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

type Props = {};

interface ExpenseData {
  expenseDate: string;
  employee: string;
  paidThrough: string;
  paidThroughId: string;
  distance: string;
  ratePerKm: string;
  vendor: string;
  invoice: string;
  uploadFiles: string;
  expense: {
    expenseAccountId: string;
    expenseAccount: string;
    note: string;
    amount: string;
  }[];
}

function AddExpensePage({}: Props) {
  const [selectedSection, setSelectedSection] = useState<
    "expense" | "mileage" | null
  >(null);

  const navigate=useNavigate()

  const handleRecordClick = (section: "expense" | "mileage") => {
    setSelectedSection(section);
    setExpenseData({...expenseData,
      expenseDate: "",
      employee: "",
      paidThrough: "",
      paidThroughId: "",
      distance: "",
      ratePerKm: "",
      vendor: "",
      invoice: "",
      expense: [
        {
          expenseAccountId: "",
          expenseAccount: "",
          note: "",
          amount: "",
        },
      ],
    });
  };


  const [expenseData, setExpenseData] = useState<ExpenseData>({
    expenseDate: "",
    employee: "",
    paidThrough: "",
    paidThroughId: "",
    distance: "",
    ratePerKm: "",
    vendor: "",
    invoice: "",
    uploadFiles: "",
    expense: [
      {
        expenseAccountId: "",
        expenseAccount: "",
        note: "",
        amount: "",
      },
    ],
  });
  const { request: AllSuppliers } = useApi("get", 5009);
  const {request:AddExpenses}=useApi('put',5008);
  const [searchValue, setSearchValue] = useState<string>("");
  const [supplierData, setSupplierData] = useState<[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
    null
  );
  const [accountData, setAccountData] = useState({
    paidThrough: [],
    liabilities: [],
  });
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleAddExpense = async () => {
  console.log("expense",expenseData);
  
    try {
      const url = `${endponits.ADD_EXPENSES}`;
      const { response, error } = await AddExpenses(
        url,
        expenseData
      );
      if (!error && response) {
        toast.success(response.data.message);
        navigate('/expense/home')
      } else {
        toast.error(error?.response.data.message);
      }
    } catch (error) { }
  };

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
  
    // Handle the case for ratePerKm and distance
  
      // Parse the values to numbers to handle calculations
      const ratePerKm = name === 'ratePerKm' ? value : expenseData.ratePerKm;
      const distance = name === 'distance' ? value : expenseData.distance;
  
      // Ensure both values are valid numbers before calculating amount
        const amount = parseFloat(ratePerKm) * parseFloat(distance);
  
        // Update state with both ratePerKm, distance, and the calculated amount
        setExpenseData({
          ...expenseData,
          [name]: value, // Update the corresponding field (ratePerKm or distance)
          expense: [
            {
              ...expenseData.expense[0],
              amount: amount.toFixed(2), // Set the amount to two decimal places
            },
          ],
        });
      
     if (
      selectedSection === 'mileage' &&
      (name === 'expenseAccount' || name === 'note' || name === 'amount')
    ) {
      // Handle expense array updates
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
      // Regular state update for fields outside the expense array
      setExpenseData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  
  const { request: AllAccounts } = useApi("get", 5001);

  useEffect(() => {
    fetchAllAccounts();
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
      <div className="bg-white mx-7">
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
          {
            expenseData.uploadFiles ? 
                <div className="flex justify-center ">
                  <img
                    src={expenseData.uploadFiles}
                    alt=""
                    className="py-0  w-full h-80"
                  />
                </div>
               :     
              <>
              <div className="flex gap-1 justify-center">
                <Upload />
                <span>Upload Your Receipt</span>
              </div>
              <p className="text-xs mt-1 text-gray-600">
                Maximum file size allowed is 5MB
              </p>
              <div className="mt-2 flex justify-center">
                <Button onClick={handleButtonClick}>Upload Your Files</Button>
              </div>
              </>
          }
              
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
                  value={expenseData.employee}
                  onChange={handleChange}
                  className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                  placeholder="Select an employee"
                />
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
    const selectedValue = e.target.value; // Extract the selected value
    // Find the selected account's object
    const selectedAccount:any =  accountData?.paidThrough?.find(
      (account: any) => account.accountName === selectedValue
    ); 

    // Update both paidThrough and paidThroughId in expenseData
    setExpenseData({
      ...expenseData,
      paidThrough: selectedValue,
      paidThroughId: selectedAccount ? selectedAccount._id : "", // Safely handle undefined
    });
  }}
  className="appearance-none w-full h-9 text-zinc-700 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
>
  <option value="">Select an Account</option>
  {accountData?.paidThrough &&
    accountData.paidThrough.map((account: any, index: number) => (
      <option key={index} value={account.accountName}>
        {account.accountName}
      </option>
    ))}
</select>


                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <CehvronDown color="gray" />
                </div>
              </div>
            </div>

            <div className="col-span-1 space-y-2 mt-1 cursor-pointer">
              <label className="block text-sm  text-labelColor">Vendor</label>
              <div
                className="relative w-full"
                onClick={(e) => {
                  // Prevent the dropdown from opening when clicking the clear button
                  if (!expenseData.vendor) {
                    e.stopPropagation();
                    toggleDropdown("supplier");
                  }
                }}
              >
                <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                  <p>
                    {expenseData.vendor && expenseData.vendor
                      ? expenseData.vendor
                      : "Select Supplier"}
                  </p>
                </div>

                {/* Clear button for selected vendor */}
                {expenseData.vendor ? (
                  <div className="cursor-pointer absolute inset-y-0 right-0.5 -mt-1 flex items-center px-2 text-gray-700">
                    <span
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent dropdown toggle when clicking clear button
                        setExpenseData({ ...expenseData, vendor: "" });
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
                              vendor: supplier.supplierDisplayName,
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
              <label className="text-sm mb-1 text-labelColor">Invoice #</label>
              <div className="relative w-full">
                <input
                  type="number"
                  name="invoice"
                  value={expenseData.invoice}
                  onChange={handleChange}
                  className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                  placeholder="Invoice #"
                />
              </div>
            </div>

            <div className="col-span-3">
              <AddExpenseTable
                liabilities={accountData.liabilities}
                expenseData={expenseData}
                setExpenseData={setExpenseData}
              />
            </div>
          </div>
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
                  value={expenseData.employee}
                  onChange={handleChange}
                  className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
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
                  name="expenseAccount"
                  value={expenseData.expense[0].expenseAccount}
                  onChange={(e) => {
                    const selectedValue = e.target.value;

                    // Find the selected account's ID
                    const selectedAccount:any = accountData.liabilities?.find(
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
                  className="appearance-none w-full h-9 text-zinc-700 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
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
                    const selectedAccount:any = accountData?.paidThrough?.find(
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
                  className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
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
                  className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
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
                  if (!expenseData.vendor) {
                    e.stopPropagation();
                    toggleDropdown("supplier");
                  }
                }}
              >
                <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                  <p>
                    {expenseData.vendor && expenseData.vendor
                      ? expenseData.vendor
                      : "Select Supplier"}
                  </p>
                </div>

                {/* Clear button for selected vendor */}
                {expenseData.vendor ? (
                  <div className="cursor-pointer absolute inset-y-0 right-0.5 -mt-1 flex items-center px-2 text-gray-700">
                    <span
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent dropdown toggle when clicking clear button
                        setExpenseData({ ...expenseData, vendor: "" });
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
                              vendor: supplier.supplierDisplayName,
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
                  className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
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
          onClick={()=>navigate('/expense/home')}
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
