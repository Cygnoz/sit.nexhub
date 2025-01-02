import { useEffect, useState } from "react";
import Button from "../../../Components/Button";
import CirclePlus from "../../../assets/icons/circleplus";
import CashImage from "../../../assets/Images/CashImage.png";
import bgImage from "../../../assets/Images/Frame 6.png";
import chartOfAcc from "../../../assets/constants/chartOfAcc";
import Modal from "../../../Components/model/Modal";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import toast from 'react-hot-toast';
import CehvronDown from "../../../assets/icons/CehvronDown";
// import PencilEdit from "../../../assets/icons/PencilEdit";

interface NewAccountModalProps {
  fetchAllAccounts: () => void;
  accountData: any;
  page?: string
}

const initialFormValues: any = {
  accountName: "",
  accountCode: "",
  accountSubhead: "",
  accountHead: "",
  accountGroup: "",
  description: "",
  bankAccNum: "",
  bankIfsc: "",
  bankCurrency: "",
  debitOpeningBalance: "",
  creditOpeningBalance: "",
  parentAccountId: "",
}

function NewAccountModal({ fetchAllAccounts, accountData, page }: NewAccountModalProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const { request: NewAccount } = useApi("post", 5001);
  const [openingType, setOpeningType] = useState("Debit");
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isSubAccount, setIsSubAccount] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [AllAccountz, setAllAccountz] = useState<any>([]);

  const { request: fetchAllAccountz } = useApi("get", 5001);

  const accountCategories = {
    Asset: {
      Asset: [
        "Other Asset",
        "Current Asset",
        "Fixed Asset",
        "Stock",
        "Payment Clearing",
      ],
    },
    Equity: {
      Equity: ["Equity"],
    },
    Income: {
      Income: ["Income", "Other Income"],
    },
    Liability: {
      Liabilities: [
        "Current Liability",
        "Credit Card",
        "Long Term Liability",
        "Other Liability",
        "Overseas Tax Payable",
      ],
    },
    Expenses: {
      Expenses: ["Expense", "Cost of Goods Sold", "Other Expense"],
    },
  };

  useEffect(() => {
    getAccountsData();
  }, []);

  useEffect(() => {
    if (page === "Edit" && accountData) {
      setFormValues(accountData);
      if (accountData.parentAccountId) {
        setIsSubAccount(true);
      }else{
        setIsSubAccount(false)
      }
      setOpeningType(accountData.debitOpeningBalance ? "Debit" : "Credit");
    }
  }, [page, accountData, isModalOpen]);

  const getAccountsData = async () => {
    try {
      const url = `${endponits.Get_ALL_Acounts}`;
      const { response, error } = await fetchAllAccountz(url);
      if (!error && response) {
        setAllAccountz(response.data);
      } else {
        console.error("Failed to fetch account data.");
      }
    } catch (error) {
      toast.error("Error in fetching data.");
      console.error("Error in fetching data", error);
    }
  };

  const headGroup = (accountSubhead: string) => {
    for (const [group, heads] of Object.entries(accountCategories)) {
      for (const [head, subheads] of Object.entries(heads)) {
        if (subheads.includes(accountSubhead)) {
          const accountGroup =
            group === "Asset" || group === "Income" || group === "Equity"
              ? "Asset"
              : group === "Liability" || group === "Expenses"
                ? "Liability"
                : group;
          return { accountHead: head, accountGroup };
        }
      }
    }
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox" && name === "returnableItem") {
      const target = e.target as HTMLInputElement;
      setIsSubAccount(target.checked);
      if (!target.checked) {
        setFormValues((prev: any) => ({
          ...prev,
          parentAccountId: ""
        }));
      }
      return;
    }

    if (name === "accountSubhead") {
      const result = headGroup(value);
      if (result) {
        setFormValues((prevFormValues: any) => ({
          ...prevFormValues,
          accountSubhead: value,
          accountHead: result.accountHead,
          accountGroup: result.accountGroup,
          parentAccountId: "",
        }));
      } else {
        setFormValues((prevFormValues: any) => ({
          ...prevFormValues,
          accountSubhead: value,
          accountHead: "",
          accountGroup: "",
          parentAccountId: "", 
        }));
      }
    } else if (name === "openingType") {
      setOpeningType(value);
      setFormValues((prevFormValues: any) => ({
        ...prevFormValues,
        debitOpeningBalance: value === "Debit" ? prevFormValues.debitOpeningBalance : "",
        creditOpeningBalance: value === "Credit" ? prevFormValues.creditOpeningBalance : "",
      }));
    } else if (name === "openingBalance") {
      if (parseFloat(value) < 0) return;

      setFormValues((prevFormValues: any) => ({
        ...prevFormValues,
        debitOpeningBalance:
          openingType === "Debit" ? value : prevFormValues.debitOpeningBalance,
        creditOpeningBalance:
          openingType === "Credit" ? value : prevFormValues.creditOpeningBalance,
      }));
    } else {
      setFormValues((prevFormValues: any) => ({
        ...prevFormValues,
        [name]: value,
      }));
    }
  };

  const openModal = () => {
    if (page === "Edit" && accountData) {
      setFormValues(accountData);
      setIsSubAccount(!!accountData.parentAccountId);
      setOpeningType(accountData.debitOpeningBalance ? "Debit" : "Credit");
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormValues(initialFormValues);
    setIsSubAccount(false);
    setOpeningType("Debit");
    setShowValidationError(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formValues.accountSubhead) {
      toast.error("Please select an account type.");
      return;
    }

    if (isSubAccount && !formValues.parentAccountId) {
      setShowValidationError(true);
      toast.error("Please select a parent account.");
      return;
    }

    const toastId = toast.loading("Adding new account...");

    try {
      const url = `${endponits.Add_NEW_ACCOUNT}`;
      const body = formValues;
      const { response, error } = await NewAccount(url, body);

      if (!error && response) {
        toast.dismiss(toastId);
        closeModal();
        fetchAllAccounts();
      } else {
        throw new Error(error?.response?.data?.message || "Something went wrong");
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || error.message || "Failed to add account");
    }
  };

  return (
    <div>
      {page === "Edit" ?
        <div onClick={openModal} className="cursor-pointer">
          {/* <PencilEdit color={'#0B9C56'} /> */}
        </div>
        :
        <Button onClick={openModal} variant="primary">
          <CirclePlus color="white" size="16" />
          <p className="text-sm">New Account</p>
        </Button>}
      <Modal open={isModalOpen} onClose={closeModal} className="w-[68%] text-start">
        <div className="p-5 mt-3">
          <div className="mb-5 flex p-4 rounded-xl bg-CreamBg relative overflow-hidden">
            <div
              className="absolute top-0 right-16 w-[178px] h-[89px]"
              style={{ backgroundImage: `url(${bgImage})` }}
            ></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-textColor">{page === "Edit" ? "Edit" : "Create"} Account</h3>
              <p className="text-dropdownText font-semibold text-sm mt-2">
                Start your journey with us create your account in moments!
              </p>
            </div>
            <div
              className="ms-auto text-3xl cursor-pointer relative z-10"
              onClick={closeModal}
            >
              &times;
            </div>
          </div>

          <form className="flex justify-between" onSubmit={onSubmit}>
            <div>
              <img src={CashImage} alt="Cash" />
            </div>
            <div className="w-[65%]">
              <div className="mb-4">
                <label className="block text-sm text-labelColor mb-1">
                  Account Type
                </label>
                <select
                  name="accountSubhead"
                  value={formValues.accountSubhead}
                  onChange={handleChange}
                  className="w-full border border-inputBorder rounded p-1.5 pl-2 text-sm"
                >
                  <option disabled hidden value="">Select type</option>
                  {chartOfAcc.map((item, index) => (
                    <optgroup
                      className="text-maroon"
                      key={index}
                      label={item.head}
                    >
                      {item.subhead.map((subitem, subindex) => (
                        <option
                          className="text-black option-spacing"
                          key={subindex}
                          value={subitem}
                        >
                          {subitem}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <label className="block text-sm mb-1 text-labelColor">
                  {formValues?.accountSubhead === "Credit Card" ? "Credit Card Name" : "Account Name"}
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formValues.accountName}
                  onChange={handleChange}
                  placeholder={formValues?.accountSubhead === "Credit Card" ? "Enter Credit Card Name" : "Enter Account Name"}
                  className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2"
                />
              </div>

              {formValues.accountSubhead &&
                !["Other Asset", "Bank", "Payment Clearing", "Credit Card", "Other Liability",
                  "Overseas Tax Payable", "Other Income", "Other Expense"].includes(formValues.accountSubhead) && (
                  <>
                    <div className="mb-2 flex items-center gap-1 text-textColor">
                      <input
                        type="checkbox"
                        className="accent-[#97998E] bg-white cursor-pointer h-5 w-4 mx-1 my-1"
                        id="checkbox3"
                        name="returnableItem"
                        checked={isSubAccount}
                        onChange={handleChange}
                      />
                      <label
                        htmlFor="checkbox3"
                        className="text-dropdownText text-sm font-medium cursor-pointer"
                      >
                        Make this a sub-account
                      </label>
                    </div>

                    {isSubAccount && (
                      <div className="mb-4">
                        <label
                          htmlFor="parentAccountId"
                          className="text-slate-600 text-sm flex items-center gap-2 mb-1"
                        >
                          Parent Account
                        </label>
                        <div className="relative w-full">
                          <select
                            className={`block appearance-none w-full mt-0.5 text-zinc-400 bg-white border text-sm h-9 pl-3 pr-8 rounded-md leading-tight focus:outline-none ${showValidationError ? "border-red-500" : "border-inputBorder"
                              }`}
                            name="parentAccountId"
                            onChange={(e) => {
                              const selectedAccountName = e.target.value;
                              const selectedAccount = AllAccountz?.find(
                                (account: any) => account.accountName === selectedAccountName
                              );
                              const selectedId = selectedAccount ? selectedAccount._id : "";
                              setFormValues((prevFormValues: any) => ({
                                ...prevFormValues,
                                parentAccountId: selectedId,
                              }));
                              setShowValidationError(false);
                            }}
                            value={
                              AllAccountz?.find(
                                (account: any) => account._id === formValues.parentAccountId
                              )?.accountName || ""
                            }
                          >
                            <option value="">Select Parent Account</option>
                            {AllAccountz
                              ?.filter(
                                (account: any) =>
                                  account.accountSubhead === formValues.accountSubhead
                              )
                              ?.map((account: any) => (
                                <option key={account._id} value={account.accountName}>
                                  {account.accountName}
                                </option>
                              ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <CehvronDown color="gray" />
                          </div>
                        </div>
                        {showValidationError && (
                          <div className="text-red-500 text-xs mt-1">
                            Please select a parent account.
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}





              <div className="mb-4">
                <label className="block mb-1 text-labelColor text-sm">Opening Balance</label>
                <div className="flex">
                  <div className="relative w-20 ">
                    <select
                      className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder 
                                   text-sm pl-2 pr-2 rounded-l-md leading-tight 
                                   focus:outline-none focus:bg-white focus:border-gray-500"
                      name="openingType"
                      value={openingType}
                      onChange={handleChange}
                    >
                      <option value="Debit">Dr</option>
                      <option value="Credit">Cr</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                  <input
                    type="number"
                    min={0}
                    className="text-sm w-[100%] rounded-r-md text-start bg-white border border-slate-300 h-9 p-2"
                    placeholder="Enter Opening Balance"
                    name="openingBalance"
                    value={
                      openingType === "Debit"
                        ? formValues.debitOpeningBalance
                        : formValues.creditOpeningBalance
                    }
                    onChange={handleChange}
                  />
                </div>
              </div>


              <div className="mb-4">
                <label className="block text-sm mb-1 text-labelColor">
                  Description
                </label>
                <input
                  name="description"
                  value={formValues.description}
                  onChange={handleChange}
                  placeholder="Enter Description"
                  className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2"
                />
              </div>
              <div >
                <label className="block text-sm mb-1 text-labelColor">
                  Account Code
                </label>
                <input
                  type="text"
                  name="accountCode"
                  value={formValues.accountCode}
                  onChange={handleChange}
                  placeholder="Enter Account Code"
                  className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2"
                />
              </div>
              <br />
              <div className="flex justify-end gap-2">
                <Button
                  onClick={closeModal}
                  type="button"
                  variant="secondary"
                  className="rounded text-sm h-10"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="rounded text-sm h-10">
                  {page === "Edit" ? "Edit" : "Add"} Account
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default NewAccountModal;