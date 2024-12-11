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
  };

  const [expenseData, setExpenseData] = useState<ExpenseData>({
    expenseDate: "",
    paidThrough: "",
    paidThroughId: "",
    expenseCategory: "",
    expenseType: "Goods",
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
    invoice: "",
    uploadFiles: "",
    subTotal: 0,
    sgst: 0,
    cgst: 0,
    igst: 0,
    vat: 0,
    grandTotal: 0,
    amountIs: "Tax Exclusive",
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
        igstAmount: 0,
        amount: 0,
      },
    ],
  });

  const { request: AllAccounts } = useApi("get", 5001);
  const { request: AllSuppliers } = useApi("get", 5009);
  const { request: AddExpenses } = useApi("post", 5008);
  const { request: getAllExpenseCategory } = useApi("get", 5008);
  const { request: getTax } = useApi("get", 5004);
  const { request: getCountries } = useApi("get", 5004);
  const { request: getOrg } = useApi("get", 5004);
  const [countryData, setcountryData] = useState<any | any>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [supplierData, setSupplierData] = useState<[]>([]);
  const [taxRate, setTaxRate] = useState<[] | any>([]);
  const [selecteSupplier, setSelecetdSupplier] = useState<any | []>([]);
  // const {organization} = useOrganization()
  const [placeOfSupplyList, setPlaceOfSupplyList] = useState<any | []>([]);
  const [organization, setOrganization] = useState<any | []>([]);
  const [selectedTax, setSelectedTax] = useState("");
    const [destinationList, setDestinationList] = useState<any | []>([]);
  const [categories, setCategories] = useState<any | []>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [Itemize, setItemize] = useState<boolean>(true);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [accountData, setAccountData] = useState({
    paidThrough: [],
    liabilities: [],
  });

  
  const handleAddExpense = async () => {
    try {
      let hasErrors = false;
  
      const updatedErrors:any = {
        expenseDate: !expenseData.expenseDate,
        paidThrough: !expenseData.paidThrough,
        gstTreatment: selectedSection === "expense" ? !expenseData.gstTreatment : false,
        distance: selectedSection === "mileage" ? !expenseData.distance : false,
        ratePerKm: selectedSection === "mileage" ? !expenseData.ratePerKm : false,
      };
  
      if (expenseData.expense && Array.isArray(expenseData.expense)) {
        expenseData.expense.forEach((expense, index) => {
          if (!expense.amount) {
            updatedErrors[`expense_${index}_amount`] = true;
          }
          if (!expense.expenseAccount) {
            updatedErrors[`expense_${index}_expenseAccount`] = true;
          }
        });
      }
  
      const emptyFields = Object.keys(updatedErrors).filter(
        (key) => updatedErrors[key as keyof typeof updatedErrors]
      );
  
      hasErrors = emptyFields.length > 0;
  
      if (hasErrors) {
        const fieldNames = emptyFields.join(", ");
        toast.error(`Please fill in the following fields: ${fieldNames}`);
        return;
      }
  
      const url = `${endponits.ADD_EXPENSES}`;
      const { response, error } = await AddExpenses(url, expenseData);
  
      if (response) {
        toast.success(response.data.message);
        navigate("/expense/home");
      } else {
        toast.error(error?.response?.data?.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error in handleAddExpense:", error);
      toast.error("An unexpected error occurred.");
    }
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

  const findCountryStates = (countryName: string) =>
    countryData.find(
      (c: any) => c.name.toLowerCase() === countryName.toLowerCase()
    )?.states || [];

  const handlePlaceOfSupply = () => {
    const countryName = organization?.organizationCountry;
    const states = countryName ? findCountryStates(countryName) : [];

    setPlaceOfSupplyList(states);
    if (organization && selectedSection=="expense") {
      setExpenseData((prev) => ({
        ...prev,
        destinationOfSupply: organization.state,
      }));
    }
  };

  const handleDestination = () => {
    const countryName = selecteSupplier?.billingCountry;
    const states = countryName ? findCountryStates(countryName) : [];

    setDestinationList(states);
    if (selecteSupplier && selectedSection==="expense") {
      setExpenseData((prev) => ({
        ...prev,
        sourceOfSupply: selecteSupplier.billingState,
        supplierDisplayName: selecteSupplier.supplierDisplayName,
       
      }));
    }
  };

  const handleItemizeFlase = () => {
    setItemize(false);
   
  };

  const handleItemizeTrue = () => {
    setItemize(true);
  };

  const handleExpenseChange = (
    index: number,
    updates: Partial<{
      expenseAccountId: string;
      expenseAccount: string;
      note: string;
      taxGroup: string;
      taxExemption: string;
      sgst: number;
      cgst: number;
      igst: number;
      vat: number;
      sgstAmount: number;
      cgstAmount: number;
      igstAmount: number;
      amount: number;
    }>
  ) => {
    setExpenseData((prevData) => {
      const updatedExpenses = [...prevData.expense];
      updatedExpenses[index] = {
        ...updatedExpenses[index],
        ...updates,
      };

      return {
        ...prevData,
        expense: updatedExpenses,
      };
    });
  };

  useEffect(() => {
    setExpenseData((prevData) => ({
      ...prevData,
      expenseType: selectedSection === "expense" ? "Goods" : "",
      amountIs: selectedSection === "expense" ? "Tax Exclusive" : "",
      destinationOfSupply: selectedSection === "expense" ? organization.state : "",
      expense: prevData.expense.map((expenseItem) => ({
        ...expenseItem,
        taxGroup: selectedSection === "mileage" ? "None" :"" ,
      })),
    }));
  }, [selectedSection, organization.state]);
  
  

  useEffect(() => {
    if (expenseData?.expense?.length) {
      const { sourceOfSupply, destinationOfSupply, amountIs } = expenseData;
  
      // Calculate updated expense data
      const updatedExpenses = expenseData.expense.map((expenseItem) => {
        const { amount, sgst, cgst, igst } = expenseItem;
  
        let sgstAmount = 0;
        let cgstAmount = 0;
        let igstAmount = 0;
  
        // Calculate SGST, CGST, or IGST
        if (sourceOfSupply === destinationOfSupply) {
          sgstAmount = (amount * sgst) / 100;
          cgstAmount = (amount * cgst) / 100;
        } else {
          igstAmount = (amount * igst) / 100;
        }
  
        return {
          ...expenseItem,
          sgstAmount,
          cgstAmount,
          igstAmount,
        };
      });
  
      // Calculate totals for all expenses
      const subTotal = updatedExpenses.reduce((sum, item) => sum + item.amount, 0);
      const totalTax = updatedExpenses.reduce(
        (sum, item) => sum + item.sgstAmount + item.cgstAmount + item.igstAmount,
        0
      );
      const grandTotal = amountIs === "Tax Exclusive" ? subTotal + totalTax : subTotal;
  
      // Aggregate SGST, CGST, IGST totals across all expenses
      const totalSgst = updatedExpenses.reduce((sum, item) => sum + item.sgstAmount, 0);
      const totalCgst = updatedExpenses.reduce((sum, item) => sum + item.cgstAmount, 0);
      const totalIgst = updatedExpenses.reduce((sum, item) => sum + item.igstAmount, 0);
  
      // Update state
      setExpenseData((prevData) => ({
        ...prevData,
        subTotal,
        grandTotal,
        sgst: totalSgst,
        cgst: totalCgst,
        igst: totalIgst,
        expense: updatedExpenses,
      }));
    }
  }, [
    JSON.stringify(
      expenseData?.expense?.map(({ amount, sgst, cgst, igst }) => ({
        amount,
        sgst,
        cgst,
        igst,
      }))
    ),
    expenseData?.sourceOfSupply,
    expenseData?.destinationOfSupply,
    expenseData?.amountIs,
  ]);
  
  
  
  

  console.log(expenseData, "expenseData");

  useEffect(() => {
    fetchAllAccounts();
    fetchCountries();
    const categoryUrl = `${endponits.GET_ALL_EXPENSE_CATEGORY}`;
    const taxRateUrl = `${endponits.GET_ALL_TAX}`;
    const organizationURL = `${endponits.GET_ONE_ORGANIZATION}`;

    fetchData(organizationURL, setOrganization, getOrg);
    fetchData(categoryUrl, setCategories, getAllExpenseCategory);
    fetchData(taxRateUrl, setTaxRate, getTax);
  }, []);

  useEffect(() => {
    handlePlaceOfSupply();
    handleDestination();
  }, [expenseData.supplierId, organization]);

  console.log(taxRate.gstTaxRate, "taxRate");

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
                <label className="text-sm mb-1 text-labelColor">Date<span className="text-[#bd2e2e] ">*</span></label>
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
                      Expense Account<span className="text-[#bd2e2e] ">*</span>
                    </label>
                    <div className="relative w-full">
                      <select
                        name="expenseAccount"
                        value={expenseData?.expense[0]?.expenseAccount || ""}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          const selectedAccount: any =
                            accountData?.liabilities?.find(
                              (account: any) =>
                                account.accountName === selectedValue
                            );

  

                          setExpenseData({
                            ...expenseData,
                            expense: [
                              {
                                ...expenseData.expense[0],
                                expenseAccount: selectedValue,
                                expenseAccountId: selectedAccount
                                  ? selectedAccount._id
                                  : "",
                              },
                            ],
                          });
                        }}
                        className="appearance-none w-full h-9 text-zinc-700 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                      >
                        <option value="">Select an Account</option>
                        {accountData?.liabilities &&
                          accountData.liabilities.map(
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
                      onClick={handleItemizeFlase}
                    >
                      <List />{" "}
                      <p className="font-semibold text-[#680000]">Itemize</p>
                    </button>
                  </div>

                  <div className="col-span-1 space-y-2">
                    <label className="text-sm mb-1 text-labelColor">
                      Expense Amount<span className="text-[#bd2e2e] ">*</span>
                    </label>
                    <div className="relative w-full">
                      <input
                        type="number"
                        name="amount"
                        value={expenseData.expense[0]?.amount || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || !isNaN(Number(value))) {
                            handleExpenseChange(0, { amount: Number(value) });
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
                  Paid Through<span className="text-[#bd2e2e] ">*</span>
                </label>
                <div className="relative w-full">
                  <select
                    name="paidThrough"
                    value={expenseData.paidThrough}
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
                        paidThroughId: selectedAccount
                          ? selectedAccount._id
                          : "",
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
                    if (!expenseData.expenseCategory) {
                      e.stopPropagation();
                      toggleDropdown("Category");
                    }
                  }}
                >
                  <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                    <p>
                      {expenseData.expenseCategory &&
                      expenseData.expenseCategory
                        ? expenseData.expenseCategory
                        : "Select Category"}
                    </p>
                  </div>
                  {expenseData.supplierDisplayName ? (
                    <div className="cursor-pointer absolute inset-y-0 right-0.5 -mt-1 flex items-center px-2 text-gray-700">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpenseData({
                            ...expenseData,
                            expenseCategory: "",
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
                  {openDropdownIndex === "Category" && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-full space-y-1 max-h-72 overflow-y-auto hide-scrollbar"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SearchBar
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        placeholder="Select Category"
                      />
                      {categories.length > 0 ? (
                        categories?.map((category: any) => (
                          <div
                            key={category._id}
                            className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                            onClick={() => {
                              setExpenseData({
                                ...expenseData,
                                expenseCategory: category.expenseCategory,
                              });
                              setOpenDropdownIndex(null); 
                            }}
                          >
                            <div className="col-span-10 flex cursor-pointer">
                              <div>
                                <p className="font-bold text-sm">
                                  {category.expenseCategory}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center border-slate-400 border rounded-lg">
                          <p className="text-[red] text-sm py-4">
                            Categories Not Found!
                          </p>
                        </div>
                      )}
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
                              expenseType: "Goods", // Use consistent property name
                            }));
                          }}
                        >
                          <input
                            id="Goods"
                            type="radio"
                            name="expenseType"
                            value="Goods"
                            className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
                              expenseData.expenseType === "Goods"
                                ? "border-8 border-[#97998E]"
                                : "border-1 border-[#97998E]"
                            }`}
                            checked={expenseData.expenseType === "Goods"}
                            readOnly // Avoid unnecessary onChange handling
                          />
                          <div
                            className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                              expenseData.expenseType === "Goods"
                                ? "bg-neutral-50"
                                : "bg-transparent"
                            }`}
                          />
                        </div>
                        <label
                          htmlFor="Goods"
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
                            id="Service"
                            type="radio"
                            name="expenseType"
                            value="Service"
                            className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
                              expenseData.expenseType === "Service"
                                ? "border-8 border-[#97998E]"
                                : "border-1 border-[#97998E]"
                            }`}
                            checked={expenseData.expenseType === "Service"}
                            readOnly // Avoid unnecessary onChange handling
                          />
                          <div
                            className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                              expenseData.expenseType === "Service"
                                ? "bg-neutral-50"
                                : "bg-transparent"
                            }`}
                          />
                        </div>
                        <label
                          htmlFor="Service"
                          className="text-start font-medium mt-1"
                        >
                          Service
                        </label>
                      </div>
                    </div>
                  </div>

                  {expenseData.expenseType === "Goods" ? (
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
                          placeholder="Enter HSN code"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="col-span-1 space-y-2">
                      <label className="text-sm mb-1 text-labelColor">
                        SAC
                      </label>
                      <div className="relative w-full">
                        <input
                          type="text"
                          name="sac"
                          value={expenseData.sac}
                          onChange={handleChange}
                          className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          placeholder="Enter SAC"
                        />
                      </div>
                    </div>
                  )}
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
                          e.stopPropagation();
                          // Prevent dropdown toggle when clicking clear button
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
                                supplierId: supplier?._id,
                              });
                              setSelecetdSupplier(supplier);
                              setOpenDropdownIndex(null);
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
                  GST Treatment<span className="text-[#bd2e2e] ">*</span>
                </label>
                <div className="relative w-full">
                  <select
                    name="gstTreatment"
                    value={expenseData.gstTreatment}
                    onChange={handleChange}
                    className="appearance-none w-full h-9 text-zinc-700 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                  >
                    <option value="">Select an Account</option>
                    <option value="Registered Business - Regular">
                      Registered Business - Regular
                    </option>
                    <option value="Registered Business - Composition">
                      Registered Business - Composition
                    </option>
                    <option value="Unregistered Business">
                      Unregistered Business
                    </option>
                    <option value="Consumer">Consumer</option>
                    <option value="Overseas">Overseas</option>
                    <option value="Special Economic Zone">
                      Special Economic Zone
                    </option>
                    <option value="Deemed Export">Deemed Export</option>
                    <option value="Tax Deductor">Tax Deductor</option>
                    <option value="SEZ Developer">SEZ Developer</option>
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
                    placeholder="Enter GSTIN"
                  />
                </div>
              </div>

              <div className="col-span-1 space-y-2">
                <label className="text-sm mb-1 text-labelColor">
                  Source of Supply
                </label>
                <div className="relative w-full">
                  <select
                    onChange={handleChange}
                    name="sourceOfSupply"
                    value={expenseData.sourceOfSupply}
                    className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  >
                    <option value="">Select Source Of Supply</option>
                    {destinationList &&
                      destinationList.map((item: any, index: number) => (
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

              <div className="col-span-1 space-y-2">
                <label className="text-sm mb-1 text-labelColor">
                  Destination of Supply
                </label>
                <div className="relative w-full">
                  <select
                    onChange={handleChange}
                    name="destinationOfSupply"
                    value={expenseData.destinationOfSupply}
                    className="block appearance-none w-full h-9  text-zinc-400 bg-white border border-inputBorder text-sm  pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  >
                    <option value="">Select Destination Of Supply</option>
                    {placeOfSupplyList.length > 0 &&
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

              {Itemize && (
  <div className="col-span-1 space-y-2">
    <label className="text-sm mb-1 text-labelColor">Tax</label>
    <div className="relative w-full">
    <select
  name="taxGroup"
  value={JSON.stringify(selectedTax) || ""} 
  onChange={(e) => {
    const selectedValue = JSON.parse(e.target.value); 
    console.log(selectedValue, "selected value");

    setExpenseData((prevData) => {
      const updatedExpenses = [...prevData.expense];
      updatedExpenses[0] = {
        ...updatedExpenses[0],
        taxGroup: selectedValue.taxName, 
        cgst: selectedValue.cgst,
        sgst: selectedValue.sgst,
        igst: selectedValue.igst,
      };

      return {
        ...prevData,
        expense: updatedExpenses,
      };
    });

    setSelectedTax(selectedValue); 
  }}
  className="appearance-none w-full h-9 text-zinc-700 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
>
  <option value="">Select Tax Rate</option>
  {taxRate?.gstTaxRate?.map((account: any, index: number) => (
    <option key={index} value={JSON.stringify(account)}>
      {account?.taxName}
    </option>
  ))}
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
                    type="text"
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
                        value={expenseData.expense[0]?.note || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleExpenseChange(0, { note: value });
                        }}
                        className="appearance-none w-full h-16 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                        placeholder="Enter Notes"
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="">
                <label
                  className="block text-sm text-labelColor"
                  htmlFor="amountIs"
                >
                  Amount Is
                </label>
                <div className="flex items-center space-x-4 text-textColor text-sm">
                  <div className="flex gap-2 justify-center items-center">
                    <div
                      className="grid place-items-center mt-1"
                      onClick={() => {
                        setExpenseData((prev) => ({
                          ...prev,
                          amountIs: "Tax Inclusive", // Correct property name for taxInclusive
                        }));
                      }}
                    >
                      <input
                        id="Tax Inclusive"
                        type="radio"
                        name="amountIs" // Corrected name
                        value="Tax Inclusive"
                        className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
                          expenseData.amountIs === "Tax Inclusive"
                            ? "border-8 border-[#97998E]"
                            : "border-1 border-[#97998E]"
                        }`}
                        checked={expenseData.amountIs === "Tax Inclusive"}
                        readOnly
                      />
                      <div
                        className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                          expenseData.amountIs === "Tax Inclusive"
                            ? "bg-neutral-50"
                            : "bg-transparent"
                        }`}
                      />
                    </div>
                    <label
                      htmlFor="Tax Inclusive"
                      className="text-start font-medium mt-1"
                    >
                      Tax Inclusive
                    </label>
                  </div>

                  <div className="flex gap-2 justify-center items-center">
                    <div
                      className="grid place-items-center mt-1"
                      onClick={() => {
                        setExpenseData((prev) => ({
                          ...prev,
                          amountIs: "Tax Exclusive",
                        }));
                      }}
                    >
                      <input
                        id="Tax Exclusive"
                        type="radio"
                        name="amountIs"
                        value="Tax Exclusive"
                        className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
                          expenseData.amountIs === "Tax Exclusive"
                            ? "border-8 border-[#97998E]"
                            : "border-1 border-[#97998E]"
                        }`}
                        checked={expenseData.amountIs === "Tax Exclusive"} // Correct checked logic
                        readOnly // Prevent unnecessary onChange handling
                      />
                      <div
                        className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                          expenseData.amountIs === "Tax Exclusive"
                            ? "bg-neutral-50"
                            : "bg-transparent"
                        }`}
                      />
                    </div>
                    <label
                      htmlFor="Tax Exclusive"
                      className="text-start font-medium mt-1"
                    >
                      Tax Exclusive
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {!Itemize && (
              <button
                className="flex items-center  gap-2 mt-5"
                onClick={handleItemizeTrue}
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
                taxRate={taxRate}
                setExpenseData={setExpenseData}
              />
            )}
          </>
        )}
        {selectedSection === "mileage" && (
          <div className="grid grid-cols-3 gap-4 mt-5 mx-4">
            <div className="col-span-1 space-y-2">
              <label className="text-sm mb-1 text-labelColor">Date<span className="text-[#bd2e2e] ">*</span></label>
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
            {/* <div className="col-span-1 space-y-2">
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
            </div> */}
              <div className="col-span-1 space-y-2">
                    <label className="text-sm mb-1 text-labelColor">
                      Expense Account<span className="text-[#bd2e2e] ">*</span>
                    </label>
                    <div className="relative w-full">
                      <select
                        name="expenseAccount"
                        value={expenseData?.expense[0]?.expenseAccount || ""}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          const selectedAccount: any =
                            accountData?.liabilities?.find(
                              (account: any) =>
                                account.accountName === selectedValue
                            );

  

                          setExpenseData({
                            ...expenseData,
                            expense: [
                              {
                                ...expenseData.expense[0],
                                expenseAccount: selectedValue,
                                expenseAccountId: selectedAccount
                                  ? selectedAccount._id
                                  : "",
                              },
                            ],
                          });
                        }}
                        className="appearance-none w-full h-9 text-zinc-700 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                      >
                        <option value="">Select an Account</option>
                        {accountData?.liabilities &&
                          accountData.liabilities.map(
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
                Paid Through<span className="text-[#bd2e2e] ">*</span>
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
              <label className="text-sm mb-1 text-labelColor">Distance<span className="text-[#bd2e2e] ">*</span></label>
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
                Rate Per Km <span className="text-[#bd2e2e] ">*</span>
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
                              supplierId:supplier._id
                            });
                            setOpenDropdownIndex(null); 
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

            <div className="col-span-1 space-y-2">
                    <label className="text-sm mb-1 text-labelColor">
                      Notes
                    </label>
                    <div className="relative w-full">
                      <input
                        type="text"
                        name="note"
                        value={expenseData.expense[0]?.note || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleExpenseChange(0, { note: value });
                        }}
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
