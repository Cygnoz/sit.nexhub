import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

type Props = { page?: string };

function AddExpensePage({ page }: Props) {
  const { id } = useParams();
  const [selectedSection, setSelectedSection] = useState<
    "expense" | "mileage" | null
  >(null);

  const navigate = useNavigate();

  const handleRecordClick = (section: "expense" | "mileage") => {
    setSelectedSection(section);
  };

  const [expenseData, setExpenseData] = useState<ExpenseData>({
    expenseNumber: "",
    expenseDate: new Date().toISOString().slice(0, 10),
    paidThroughAccountId: "",
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
        total: 0,
      },
    ],
  });

  const { request: AllAccounts } = useApi("get", 5001);
  const { request: AllSuppliers } = useApi("get", 5009);
  const { request: AddExpenses } = useApi("post", 5008);
  const { request: EditExpenses } = useApi("put", 5008);
  const { request: getAllExpenseCategory } = useApi("get", 5008);
  const { request: getTax } = useApi("get", 5004);
  const { request: getCountries } = useApi("get", 5004);
  const { request: getOrg } = useApi("get", 5004);
  const { request: getPrefix } = useApi("get", 5008);
  const { request: getOneExpense } = useApi("get", 5008);

  const [countryData, setcountryData] = useState<any | any>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [supplierData, setSupplierData] = useState<[]>([]);
  const [taxRate, setTaxRate] = useState<[] | any>([]);
  const [selecteSupplier, setSelecetdSupplier] = useState<any | []>([]);
  // const {organization} = useOrganization()
  const [placeOfSupplyList, setPlaceOfSupplyList] = useState<any | []>([]);
  const [organization, setOrganization] = useState<any | []>([]);
  const [selectedTax, setSelectedTax] = useState<any>("");
  const [destinationList, setDestinationList] = useState<any | []>([]);
  const [categories, setCategories] = useState<any | []>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [Itemize, setItemize] = useState<boolean>(true);
  const [prefix, setPrefix] = useState<any>(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [accountData, setAccountData] = useState<any>([]);

  const handleAddExpense = async () => {
    try {
      let hasErrors = false;

      const updatedErrors: any = {
        expenseDate: !expenseData.expenseDate,
        gstTreatment:
          selectedSection === "expense" ? !expenseData.gstTreatment : false,
        distance: selectedSection === "mileage" ? !expenseData.distance : false,
        ratePerKm:
          selectedSection === "mileage" ? !expenseData.ratePerKm : false,
      };

      if (selectedSection === "expense" && expenseData.gstTreatment) {
        if (
          [
            "Registered Business - Regular",
            "Registered Business - Composition",
            "Special Economic Zone",
            "Deemed Export",
            "Tax Deductor",
            "SEZ Developer",
          ].includes(expenseData.gstTreatment)
        ) {
          if (!expenseData.destinationOfSupply) {
            updatedErrors.destinationOfSupply = true;
          }
          if (!expenseData.sourceOfSupply) {
            updatedErrors.sourceOfSupply = true;
          }
          if (!expenseData.gstin) {
            updatedErrors.gstin = true;
          }
          if (!expenseData.invoice) {
            updatedErrors.invoice = true;
          }
        }
      }

      if (selectedSection === "expense" && expenseData.gstTreatment) {
        if (
          ["Unregistered Business", "Consumer"].includes(
            expenseData.gstTreatment
          )
        ) {
          if (!expenseData.destinationOfSupply) {
            updatedErrors.destinationOfSupply = true;
          }
          if (!expenseData.sourceOfSupply) {
            updatedErrors.sourceOfSupply = true;
          }
        }
      }
      if (selectedSection === "expense" && expenseData.gstTreatment) {
        if (["Overseas"].includes(expenseData.gstTreatment)) {
          if (!expenseData.destinationOfSupply) {
            updatedErrors.destinationOfSupply = true;
          }
        }
      }

      if (selectedSection === "expense" && expenseData.gstTreatment) {
        if (
          [
            "Registered Business - Regular",
            "Special Economic Zone",
            "Deemed Export",
            "Tax Deductor",
            "SEZ Developer",
          ].includes(expenseData.gstTreatment)
        ) {
          expenseData.expense.forEach((expense) => {
            if (!expense.taxGroup) {
              updatedErrors[`Tax Group`] = true;
            }
          });
        }
      }

      if (expenseData.expense && Array.isArray(expenseData.expense)) {
        expenseData.expense.forEach((expense) => {
          if (!expense.amount) {
            updatedErrors[`expense amount`] = true;
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

      const url =
        page === "edit"
          ? `${endponits.EDIT_EXPENSE}/${id}`
          : `${endponits.ADD_EXPENSES}`;
      const api = page === "edit" ? EditExpenses : AddExpenses;
      const { response, error } = await api(url, expenseData);

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setExpenseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "expenseAccountId") {
      setExpenseData((prevData) => ({
        ...prevData,
        expense: prevData.expense.map((item, index) =>
          index === 0 ? { ...item, expenseAccountId: value } : item
        ),
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
        setAccountData(response?.data);
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
    if (organization && selectedSection == "expense") {
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
    if (selecteSupplier && selectedSection === "expense") {
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

  const handleTaxSelect = (e: any) => {
    let updatedTax;

    if (e.target.value === "Non-Taxable") {
      updatedTax = {
        taxName: "Non-Taxable",
        cgst: 0,
        sgst: 0,
        igst: 0,
        taxRate: 0,
      };
    } else {
      updatedTax = JSON.parse(e.target.value);
    }

    setSelectedTax(updatedTax);

    setExpenseData((prevData) => {
      const updatedExpenses = prevData.expense.map((item, index) =>
        index === 0
          ? {
              ...item,
              taxGroup: updatedTax.taxName,
              cgst: updatedTax.cgst,
              sgst: updatedTax.sgst,
              igst: updatedTax.igst,
            }
          : item
      );

      return {
        ...prevData,
        expense: updatedExpenses,
      };
    });
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
      total: number;
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
    if (expenseData.ratePerKm && expenseData.distance) {
      const validRatePerKm = parseFloat(expenseData.ratePerKm as string) || 0;
      const validDistance = parseFloat(expenseData.distance as string) || 0;

      const totalExpense = validRatePerKm * validDistance;

      setExpenseData((prevData) => ({
        ...prevData,
        expense: [
          {
            ...prevData.expense[0],
            amount: totalExpense,
            total: totalExpense,
          },
        ],
      }));
    }
  }, [
    expenseData.ratePerKm,
    expenseData.distance,
    expenseData.expense[0].amount,
  ]);

  useEffect(() => {
    setExpenseData((prevData) => ({
      ...prevData,
      expenseType: selectedSection === "expense" ? "Goods" : "",
      amountIs: selectedSection === "expense" ? "Tax Exclusive" : "",
      destinationOfSupply:
        selectedSection === "expense" ? organization.state : "",
      expense: prevData.expense.map((expenseItem) => ({
        ...expenseItem,
        taxGroup: selectedSection === "mileage" ? "Non-Taxable" : "",
      })),
    }));
  }, [selectedSection, organization.state]);

  useEffect(() => {
    if (expenseData?.expense?.length) {
      const { sourceOfSupply, destinationOfSupply, amountIs } = expenseData;
  
      const updatedExpenses = expenseData.expense.map((expenseItem) => {
        const { amount, sgst, cgst, igst } = expenseItem; // ✅ amount exists inside expenseItem
  
        let sgstAmount = 0;
        let cgstAmount = 0;
        let igstAmount = 0;
        let total = 0;
        let totalTax = 0;
  
        if (amountIs === "Tax Inclusive") {
          if (sourceOfSupply === destinationOfSupply) {
            total = parseFloat(((amount / (100 + sgst + cgst)) * 100).toFixed(2));
            totalTax = parseFloat(((total * (sgst + cgst)) / 100).toFixed(2));
            sgstAmount = parseFloat((totalTax / 2).toFixed(2));
            cgstAmount = parseFloat((totalTax / 2).toFixed(2));
          } else {
            total = parseFloat(((amount / (100 + igst)) * 100).toFixed(2));
            totalTax = (total * igst) / 100;
            igstAmount = parseFloat(totalTax.toFixed(2));
          }
        } else if (amountIs === "Tax Exclusive") {
          if (sourceOfSupply === destinationOfSupply) {
            total = amount;
            sgstAmount = (amount * sgst) / 100;
            cgstAmount = (amount * cgst) / 100;
          } else {
            total = amount;
            igstAmount = (amount * igst) / 100;
          }
        }
  
        if (selectedSection === "mileage") {
          total = amount;
        }
  
        return {
          ...expenseItem,
          sgstAmount,
          cgstAmount,
          igstAmount,
          total,
        };
      });
  
      let subTotal = updatedExpenses.reduce(
        (sum, item) => sum + (amountIs === "Tax Inclusive" ? item.total : item.amount || 0),
        0
      );
      subTotal = parseFloat(subTotal.toFixed(2));
  
      const totalSgst = parseFloat(
        updatedExpenses.reduce((sum, item) => sum + (item.sgstAmount || 0), 0).toFixed(2)
      );
      const totalCgst = parseFloat(
        updatedExpenses.reduce((sum, item) => sum + (item.cgstAmount || 0), 0).toFixed(2)
      );
      const totalIgst = parseFloat(
        updatedExpenses.reduce((sum, item) => sum + (item.igstAmount || 0), 0).toFixed(2)
      );
  
      let grandTotal = parseFloat((subTotal + totalSgst + totalCgst + totalIgst).toFixed(2));
  
      // ✅ Rounding Fix: Ensure grandTotal matches expense total when Tax Inclusive
      const totalExpenseAmount = updatedExpenses.reduce((sum, item) => sum + item.amount, 0); // Fix: sum from expense items
      if (amountIs === "Tax Inclusive") {
        const difference = parseFloat((totalExpenseAmount - grandTotal).toFixed(2));
        if (Math.abs(difference) <= 0.01) {
          grandTotal = totalExpenseAmount; // Fix floating point errors
        }
      }
  
      console.log(subTotal, "subTotal");
      console.log(grandTotal, "grandTotal");
  
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

  // useEffect(() => {
  //   if (expenseData?.expense[0]?.taxGroup) {
  //     setExpenseData((prevData) => ({
  //       ...prevData,
  //       amountIs: "Tax Exclusive",
  //     }));
  //   }
  // }, [expenseData.expense]);

  useEffect(() => {
    fetchAllAccounts();
    fetchCountries();
    const categoryUrl = `${endponits.GET_ALL_EXPENSE_CATEGORY}`;
    const taxRateUrl = `${endponits.GET_ALL_TAX}`;
    const organizationURL = `${endponits.GET_ONE_ORGANIZATION}`;
    const getPrefixUrl = `${endponits.GET_LAST_EXPENSE_PREFIX}`;
    const supplierUrl = `${endponits.GET_ALL_SUPPLIER}`;
    fetchData(supplierUrl, setSupplierData, AllSuppliers);
    fetchData(organizationURL, setOrganization, getOrg);
    fetchData(categoryUrl, setCategories, getAllExpenseCategory);
    fetchData(taxRateUrl, setTaxRate, getTax);
    fetchData(getPrefixUrl, setPrefix, getPrefix);
  }, []);

  useEffect(() => {
    if (prefix) {
      setExpenseData((prevData) => ({
        ...prevData,
        expenseNumber: prefix,
      }));
    }
  }, [prefix]);

  useEffect(() => {
    handlePlaceOfSupply();
    handleDestination();
  }, [expenseData.supplierId, organization]);

  useEffect(() => {
    setExpenseData((prevData) => ({
      ...prevData,
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
          total: 0,
        },
      ],
    }));
  }, [Itemize]);

  useEffect(() => {
    if (
      expenseData.gstTreatment === "Unregistered Business" ||
      expenseData.gstTreatment === "Consumer"
    ) {
      setExpenseData((prevData) => ({
        ...prevData,
        gstin: "",
        expense: prevData.expense.map((item: any) => ({
          ...item,
          taxGroup: "Non-Taxable",
          cgst: "",
          sgst: "",
          igst: "",
        })),
      }));
      setSelectedTax("");
    }

    if (expenseData.gstTreatment === "Overseas") {
      setExpenseData((prevData) => ({
        ...prevData,
        sourceOfSupply: "",
      }));
      setSelectedTax("");
    }
  }, [expenseData.gstTreatment]);

  useEffect(() => {
    const fetchJournal = async () => {
      if (page === "edit") {
        try {
          const url = `${endponits.GET_A_EXPENSE}/${id}`;
          const { response, error } = await getOneExpense(url);
          if (!error && response) {
            setExpenseData(response.data);
            if (response.data.ratePerKm || response.data.distance) {
              setSelectedSection("mileage");
            }
          }
        } catch (error) {
          console.log("Error in fetching", error);
        }
      }
    };
    fetchJournal();
  }, [page, id]);

  useEffect(() => {
    if (id && supplierData?.length > 0) {
      const matchingSupplier = supplierData.find(
        (supplier: any) => supplier._id === expenseData?.supplierId
      );

      if (matchingSupplier) {
        setSelecetdSupplier(matchingSupplier);
      }
    }
    if (id && taxRate?.gstTaxRate?.length > 0) {
      const matchingTax = taxRate.gstTaxRate.find(
        (tax: any) => tax.taxName === expenseData?.expense[0]?.taxGroup
      );
      if (matchingTax) {
        setSelectedTax(matchingTax);
      }
    }
  }, [id, supplierData, expenseData?.supplierId, taxRate]);

  useEffect(() => {
    if (expenseData.expense.length > 1) {
      setItemize(false);
    }
    if (expenseData.expense.length === 0) {
      setItemize(true);
    }
  }, [id, expenseData.expense]);

  return (
    <>
      <div className="bg-white mx-7 py-7">
        <div className="flex gap-5 items-center mb-4 ms-4">
          <Link to={"/expense/home"}>
            <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
              <CheveronLeftIcon />
            </div>
          </Link>
          <h4 className="font-bold text-xl text-textColor">
            {page === "edit" ? "Edit" : "Add"} Expense
          </h4>
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
                <label className="text-sm mb-1 text-labelColor">
                  Date<span className="text-[#bd2e2e] ">*</span>
                </label>
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
                <label className="text-sm mb-1 text-labelColor">
                  Expense Number<span className="text-[#bd2e2e] ">*</span>
                </label>
                <div className="relative w-full">
                  <input
                    disabled
                    type="text"
                    name="expenseNumber"
                    value={expenseData.expenseNumber}
                    onChange={handleAddExpense}
                    className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Expense Number"
                  />
                </div>
              </div>

              {Itemize && (
                <>
                  <div className="col-span-1 space-y-2">
                    <label className="text-sm mb-1 text-labelColor">
                      Expense Account<span className="text-[#bd2e2e] ">*</span>
                    </label>
                    <div className="relative w-full  ml-auto  ">
                      <select
                        onChange={handleChange}
                        value={
                          expenseData?.expense?.[0]?.expenseAccountId || ""
                        }
                        name="expenseAccountId"
                        className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      >
                        <option value="" hidden disabled>
                          {expenseData?.expense?.[0]?.expenseAccountId
                            ? accountData?.find(
                                (item: any) =>
                                  item._id ===
                                  expenseData?.expense?.[0]?.expenseAccountId
                              )?.accountName || "Select Account"
                            : "Select Account"}
                        </option>

                        {accountData
                          ?.filter(
                            (item: { accountGroup: string }) =>
                              item.accountGroup === "Liability"
                          )
                          ?.map(
                            (item: { _id: string; accountName: string }) => (
                              <option key={item._id} value={item._id}>
                                {item.accountName}
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
                  Paid Through Account<span className="text-[#bd2e2e] ">*</span>
                </label>
                <div className="relative w-full  ">
                  <select
                    onChange={handleChange}
                    value={expenseData.paidThroughAccountId}
                    name="paidThroughAccountId"
                    className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  >
                    <option value="" hidden disabled>
                      {expenseData.paidThroughAccountId
                        ? accountData.find(
                            (item: any) =>
                              item._id === expenseData.paidThroughAccountId
                          )?.accountName || "Select Account"
                        : "Select Account"}
                    </option>
                    {accountData
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
                  {expenseData.expenseCategory ? (
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
                              expenseType: "Goods",
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
                            readOnly
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
                              expenseType: "Service", // Consistent property name
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
                                ? "bg-neutral-50" // Correct color for checked state
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
                      className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-[70%] space-y-1 max-h-72 overflow-y-auto hide-scrollbar"
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
                                  supplier?.supplierDisplayName,
                                supplierId: supplier?._id,
                              });
                              setSelecetdSupplier(supplier);
                              setOpenDropdownIndex(null);
                            }}
                          >
                            <div className="col-span-2 flex items-center justify-center">
                              <img
                                className="rounded-full h-10 w-10"
                                src={
                                  supplier.supplierProfile
                                    ? supplier.supplierProfile
                                    : "https://i.postimg.cc/sDnbrRWP/avatar-3814049-1280.webp"
                                }
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
                        <AddSupplierModal page="purchase" />
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
                    <option value="">Select GST Treatment</option>
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

              {expenseData.gstTreatment !== "Unregistered Business" &&
                expenseData.gstTreatment !== "Consumer" && (
                  <div className="col-span-1 space-y-2">
                    <label className="text-sm mb-1 text-labelColor">
                      Vendor GSTIN{" "}
                      {(expenseData.gstTreatment ===
                        "Registered Business - Regular" ||
                        expenseData.gstTreatment ===
                          "Registered Business - Composition" ||
                        expenseData.gstTreatment === "Special Economic Zone" ||
                        expenseData.gstTreatment === "Deemed Export" ||
                        expenseData.gstTreatment === "Tax Deductor" ||
                        expenseData.gstTreatment === "SEZ Developer") && (
                        <span className="text-[#bd2e2e]">*</span>
                      )}
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
                )}

              {expenseData.gstTreatment != "Overseas" && (
                <div className="col-span-1 space-y-2">
                  <label className="text-sm mb-1 text-labelColor">
                    Source of Supply
                    {(expenseData.gstTreatment ===
                      "Registered Business - Regular" ||
                      expenseData.gstTreatment ===
                        "Registered Business - Composition" ||
                      expenseData.gstTreatment === "Special Economic Zone" ||
                      expenseData.gstTreatment === "Deemed Export" ||
                      expenseData.gstTreatment === "Tax Deductor" ||
                      expenseData.gstTreatment === "Overseas" ||
                      expenseData.gstTreatment === "Unregistered Business" ||
                      expenseData.gstTreatment === "Consumer" ||
                      expenseData.gstTreatment === "SEZ Developer") && (
                      <span className="text-[#bd2e2e]">*</span>
                    )}
                  </label>

                  <div className="relative w-full">
                    <select
                      disabled={expenseData.supplierId === ""}
                      onChange={handleChange}
                      name="sourceOfSupply"
                      value={expenseData.sourceOfSupply}
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
              )}

              <div className="col-span-1 space-y-2">
                <label className="text-sm mb-1 text-labelColor">
                  Destination of Supply{" "}
                  {(expenseData.gstTreatment ===
                    "Registered Business - Regular" ||
                    expenseData.gstTreatment ===
                      "Registered Business - Composition" ||
                    expenseData.gstTreatment === "Special Economic Zone" ||
                    expenseData.gstTreatment === "Deemed Export" ||
                    expenseData.gstTreatment === "Unregistered Business" ||
                    expenseData.gstTreatment === "Consumer" ||
                    expenseData.gstTreatment === "Tax Deductor" ||
                    expenseData.gstTreatment === "Overseas" ||
                    expenseData.gstTreatment === "SEZ Developer") && (
                    <span className="text-[#bd2e2e]">*</span>
                  )}
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
                      disabled={
                        expenseData.gstTreatment ===
                          "Registered Business - Composition" ||
                        expenseData.gstTreatment === "Unregistered Business" ||
                        expenseData.gstTreatment === "Overseas"
                      }
                      name="taxGroup"
                      value={
                        selectedTax?.taxName === "Non-Taxable"
                          ? "Non-Taxable"
                          : selectedTax && selectedTax.taxName
                          ? JSON.stringify(selectedTax)
                          : ""
                      }
                      onChange={(e) => {
                        handleTaxSelect(e);
                      }}
                      className="appearance-none w-full h-9 text-zinc-700 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                    >
                      <option value="">Select Tax Rate</option>
                      <option value="Non-Taxable">Non-Taxable</option>
                      <optgroup label="Tax">
                        {taxRate?.gstTaxRate?.map(
                          (account: any, index: number) => (
                            <option key={index} value={JSON.stringify(account)}>
                              {account?.taxName}
                            </option>
                          )
                        )}
                      </optgroup>
                    </select>

                    {/* Dropdown Icon */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs -mt-1 text-textColor">
                      Tax Amount ={" "}
                      {expenseData.igst > 0
                        ? expenseData.igst
                        : expenseData.sgst + expenseData.cgst}
                    </p>
                  </div>
                </div>
              )}

              <div className="col-span-1 space-y-2">
                <label className="text-sm mb-1 text-labelColor">
                  Invoice #{" "}
                  {(expenseData.gstTreatment ===
                    "Registered Business - Regular" ||
                    expenseData.gstTreatment ===
                      "Registered Business - Composition" ||
                    expenseData.gstTreatment === "Special Economic Zone" ||
                    expenseData.gstTreatment === "Deemed Export" ||
                    expenseData.gstTreatment === "Tax Deductor" ||
                    expenseData.gstTreatment === "SEZ Developer") && (
                    <span className="text-[#bd2e2e]">*</span>
                  )}
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
              {expenseData.expense.some(
                (item) => item.taxGroup && item.taxGroup !== "Non-Taxable"
              ) && (
                <div className="mt-1">
                  <label
                    className="block text-sm text-labelColor"
                    htmlFor="amountIs"
                  >
                    Amount Is
                  </label>
                  <div className="flex items-center space-x-4 text-textColor text-sm">
                    {/* Tax Inclusive */}
                    <div className="flex gap-2 justify-center items-center">
                      <div
                        className="grid place-items-center mt-2"
                        onClick={() =>
                          setExpenseData((prev) => ({
                            ...prev,
                            amountIs: "Tax Inclusive",
                          }))
                        }
                      >
                        <input
                          id="Tax Inclusive"
                          type="radio"
                          name="amountIs"
                          value="Tax Inclusive"
                          className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${
                            expenseData.amountIs === "Tax Inclusive"
                              ? "border-8 border-[#97998E]"
                              : "border-1 border-[#97998E]"
                          }`}
                          checked={expenseData.amountIs === "Tax Inclusive"}
                          onChange={() =>
                            setExpenseData((prev) => ({
                              ...prev,
                              amountIs: "Tax Inclusive",
                            }))
                          }
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
                        className="text-start font-medium mt-1 cursor-pointer"
                        onClick={() =>
                          setExpenseData((prev) => ({
                            ...prev,
                            amountIs: "Tax Inclusive",
                          }))
                        }
                      >
                        Tax Inclusive
                      </label>
                    </div>

                    {/* Tax Exclusive */}
                    <div className="flex gap-2 justify-center items-center">
                      <div
                        className="grid place-items-center mt-1"
                        onClick={() =>
                          setExpenseData((prev) => ({
                            ...prev,
                            amountIs: "Tax Exclusive",
                          }))
                        }
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
                          checked={expenseData.amountIs === "Tax Exclusive"}
                          onChange={() =>
                            setExpenseData((prev) => ({
                              ...prev,
                              amountIs: "Tax Exclusive",
                            }))
                          }
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
                        className="text-start font-medium mt-1 cursor-pointer"
                        onClick={() =>
                          setExpenseData((prev) => ({
                            ...prev,
                            amountIs: "Tax Exclusive",
                          }))
                        }
                      >
                        Tax Exclusive
                      </label>
                    </div>
                  </div>
                </div>
              )}
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
                accountData={accountData}
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
              <label className="text-sm mb-1 text-labelColor">
                Date<span className="text-[#bd2e2e] ">*</span>
              </label>
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
                Expense Number<span className="text-[#bd2e2e] ">*</span>
              </label>
              <div className="relative w-full">
                <input
                  disabled
                  type="text"
                  name="expenseNumber"
                  value={expenseData.expenseNumber}
                  onChange={handleChange}
                  className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholder="Expense Number"
                />
              </div>
            </div>
            <div className="col-span-1 space-y-2">
              <label className="text-sm mb-1 text-labelColor">
                Expense Account<span className="text-[#bd2e2e] ">*</span>
              </label>
              <div className="relative w-full  ml-auto  ">
                <select
                  onChange={handleChange}
                  value={expenseData?.expense?.[0]?.expenseAccountId || ""}
                  name="expenseAccountId"
                  className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                >
                  <option value="" hidden disabled>
                    {expenseData?.expense?.[0]?.expenseAccountId
                      ? accountData?.find(
                          (item: any) =>
                            item._id ===
                            expenseData?.expense?.[0]?.expenseAccountId
                        )?.accountName || "Select Account"
                      : "Select Account"}
                  </option>

                  {accountData
                    ?.filter(
                      (item: { accountGroup: string }) =>
                        item.accountGroup === "Liability"
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

            <div className="col-span-1 space-y-2">
              <label className="text-sm mb-1 text-labelColor">
                Paid Through Account<span className="text-[#bd2e2e] ">*</span>
              </label>
              <div className="relative w-full  ">
                <select
                  onChange={handleChange}
                  value={expenseData.paidThroughAccountId}
                  name="paidThroughAccountId"
                  className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                >
                  <option value="" hidden disabled>
                    {expenseData.paidThroughAccountId
                      ? accountData.find(
                          (item: any) =>
                            item._id === expenseData.paidThroughAccountId
                        )?.accountName || "Select Account"
                      : "Select Account"}
                  </option>
                  {accountData
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
            <div className="col-span-1 space-y-2">
              <label className="text-sm mb-1 text-labelColor">
                Distance<span className="text-[#bd2e2e] ">*</span>
              </label>
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
                    className="absolute z-10 bg-white shadow rounded-md w-[70%] mt-1 p-2  space-y-1 max-h-72 overflow-y-auto hide-scrollbar"
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
                              supplierDisplayName: supplier.supplierDisplayName,
                              supplierId: supplier._id,
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
                      <AddSupplierModal page="purchase" />
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
              <label className="text-sm mb-1 text-labelColor">Notes</label>
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
      <div className="col-span-1 flex justify-end items-start mt-4 space-x-2   pe-10 pb-10">
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
