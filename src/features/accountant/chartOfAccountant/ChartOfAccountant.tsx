import { useEffect, useState } from "react";
import NewAccountModal from "./NewAccountModal";
// import AccountTypes from "../chartOfAccountant/AccountTypes";
import Table from "./Table";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import { Account } from "../../../Types/Accountant";
import toast from "react-hot-toast";

type Props = {};

const ChartOfAccountant = ({}: Props) => {
  const [accountData, setAccountData] = useState<Account[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const { request: AllAccounts } = useApi("get", 5001);

  useEffect(() => {
    fetchAllAccounts();
}, []);

  const fetchAllAccounts = async () => {
    try {
      const url = `${endponits.Get_ALL_Acounts}`;
      const { response, error } = await AllAccounts(url);
      if (!error && response) {
        setAccountData(response.data);
        console.log(response);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const HandleOnSave = () =>{
    fetchAllAccounts();
    toast.success('Account successfully added!'); 
  }

  return (
    <div className="mx-5 my-4">
      <div className="top-side flex items-center justify-between">
        <div className="head-frame">
          <h1>Chart Of Account</h1>
          <p className="text-sm">
          It serves as a framework for organizing financial data and helps ensure accurate and consistent reporting 
          </p>
        </div>
        <div className="button-frame">
          {/* Pass fetchAllAccounts as prop to NewAccountModal */}
          <NewAccountModal fetchAllAccounts={HandleOnSave} />
        </div>
      </div>
      <br />
      <div className="flex flex-col gap-3 p-3 bg-white mt-1">
        {/* <AccountTypes /> */}
        {/* Pass accountData and searchValue as props to Table */}
        <Table
          accountData={accountData}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </div>
    </div>
  );
};

export default ChartOfAccountant;
