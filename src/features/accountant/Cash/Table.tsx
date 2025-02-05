import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../Components/SearchBar";
import NoDataFoundTable from "../../../Components/skeleton/Table/NoDataFoundTable";
import TableSkelton from "../../../Components/skeleton/Table/TableSkelton";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import { cashResponseContext, TableResponseContext } from "../../../context/ContextShare";
import Eye from "../../../assets/icons/Eye";
import Trash2 from "../../../assets/icons/Trash2";
import toast from "react-hot-toast";
import CreateAccountModal from "./CreateAccountModal";

interface Account {
  _id: string;
  accountName: string;
  accountCode: string;
  accountSubhead: string;
  accountHead: string;
  description: string;
}

const CashAccountsTable = () => {
  const [accountData, setAccountData] = useState<Account[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const { request: AllAccounts } = useApi("get", 5001);
  const { cashResponse } = useContext(cashResponseContext)!;
  const navigate = useNavigate();
  const { loading, setLoading } = useContext(TableResponseContext)!;

  useEffect(() => {
    fetchAllAccounts();
  }, [cashResponse]);

  const fetchAllAccounts = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false });

      const url = `${endponits.Get_ALL_Acounts}`;
      const { response, error } = await AllAccounts(url);

      if (!error && response) {
        const cashAccounts = response.data.filter(
          (account: Account) => account.accountSubhead === "Cash"
        );
        setAccountData(cashAccounts);
        setLoading({ ...loading, skeleton: false });
      } else {
        setLoading({ ...loading, skeleton: false, noDataFound: true });
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setLoading({ ...loading, skeleton: false, noDataFound: true });
    }
  };

  const filteredAccounts = accountData.filter((account: Account) => {
    const searchValueLower = searchValue.toLowerCase();
    return (
      account.accountName.toLowerCase().includes(searchValueLower) ||
      account.accountCode.toLowerCase().includes(searchValueLower) ||
      account.accountSubhead.toLowerCase().includes(searchValueLower) ||
      account.accountHead.toLowerCase().includes(searchValueLower) ||
      account.description.toLowerCase().includes(searchValueLower)
    );
  });
  
  const { request: deleteAccount } = useApi("delete", 5001);

   
  const handleDelete=async(id:string)=>{
    try {
      const url = `${endponits.DELETE_ACCONUT}/${id}`;
      const { response, error } = await deleteAccount(url);
      if (!error && response) {
        toast.success(response.data.message);
        fetchAllAccounts()
        console.log(response.data);
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      toast.error("Error in fetching one item data.");
      console.error("Error in fetching one item data", error);
    }
  }

  const tableHeaders = [
    "Sl.No",
    "Account Name",
    "Account Code",
    "Account Type",
    "Parent Account Type",
    "Action",
  ];

  return (
    <div>
      <SearchBar placeholder="Search" searchValue={searchValue} onSearchChange={setSearchValue} />
      <div className="max-h-[25rem] overflow-y-auto mt-3">
        <table className="min-w-full bg-white mb-5">
          <thead className="text-[12px] text-center text-dropdownText sticky top-0 z-10">
            <tr style={{ backgroundColor: "#F9F7F0" }}>
              {tableHeaders.map((heading, index) => (
                <th key={index} className="py-3 px-4 border-b border-tableBorder font-medium">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {loading.skeleton ? (
              [...Array(filteredAccounts.length > 0 ? filteredAccounts.length : 5)].map((_, idx) => (
                <TableSkelton key={idx} columns={tableHeaders} />
              ))
            ) : filteredAccounts.length > 0 ? (
              filteredAccounts.map((item: Account, index: number) => (
                <tr key={item._id} className="relative cursor-pointer">
                  <td className="py-2.5 px-4 border-y border-tableBorder">{index + 1}</td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">{item.accountName}</td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">{item.accountCode}</td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">{item.accountSubhead}</td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">{item.accountHead}</td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => navigate(`/accountant/view/${item._id}?fromCash=true`)}
                        className="cursor-pointer"
                      >
                        <Eye color="#569FBC" />
                      </button>
                      <div ><CreateAccountModal page="edit" id={item._id} /></div>

                      {/* <div ><CreateAccountModal  id={item._id} page="edit"/></div> */}
                      <button onClick={()=>handleDelete(item._id)}>   <Trash2 color="red" size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <NoDataFoundTable columns={tableHeaders} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashAccountsTable;
