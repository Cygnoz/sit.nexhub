import { useContext, useEffect, useState } from "react";
import Ellipsis from "../../../assets/icons/Ellipsis";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import SearchBar from "../../../Components/SearchBar";
import { BankResponseContext, TableResponseContext } from "../../../context/ContextShare";
import { Link, useNavigate } from "react-router-dom";
import TableSkelton from "../../../Components/skeleton/Table/TableSkelton";
import NoDataFoundTable from "../../../Components/skeleton/Table/NoDataFoundTable";

interface Account {
  _id: string;
  accountName: string;
  accountCode: string;
  accountSubhead: string;
  accountHead: string;
  description: string;
}

const Table = () => {
  const { request: AllAccounts } = useApi("get", 5001);
  const [searchValue, setSearchValue] = useState<string>("");
  const [accountData, setAccountData] = useState<Account[]>([]);
  const { bankResponse } = useContext(BankResponseContext)!;
  const navigate=useNavigate()
  // Loading state
  const {loading,setLoading}=useContext(TableResponseContext)!;

  const tableHeaders = [
    "Sl No",
    "Account Name",
    "Account Code",
    "Account Type",
    "Documents",
    "Parent Account Type",
    // "",
  ];

  useEffect(() => {
    fetchAllAccounts();
  }, [bankResponse]);
  
  const fetchAllAccounts = async () => {
    try {
      // Set loading skeleton state before API call
      setLoading({ ...loading, skeleton: true, noDataFound: false });
  
      const url = `${endponits.Get_ALL_Acounts}`;
      const apiResponse = await AllAccounts(url);
  
      const { response, error } = apiResponse;
  
      if (!error && response) {
        // Successfully fetched data
        setAccountData(
          response.data.filter(
            (account: Account) => account.accountSubhead === "Bank"
          )
        );
      // Assuming response contains the data you want to set
        setLoading({ ...loading, skeleton: false });
      } else {
        // If there's an error or no response, show "No Data Found"
        setLoading({ ...loading, skeleton: false, noDataFound: true });
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
  
      // In case of error, hide the skeleton and show "No Data Found"
      setLoading({ ...loading, skeleton: false, noDataFound: true });
    }
  };
  
  
  
  const filteredAccounts = accountData.filter((account) => {
    const searchValueLower = searchValue.toLowerCase().trim();
    return (
      account.accountName.toLowerCase().trim().startsWith(searchValueLower) ||
      account.accountCode.toLowerCase().trim().startsWith(searchValueLower) ||
      account.accountSubhead.toLowerCase().trim().startsWith(searchValueLower) ||
      account.accountHead.toLowerCase().trim().startsWith(searchValueLower) ||
      account.description.toLowerCase().trim().startsWith(searchValueLower)
    );
  });


  return (
    <div className="overflow-x-auto my-3 mx-5">
      <div className="mt-6">
        <SearchBar
          placeholder="Search"
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
      </div>
      <div className="overflow-y-scroll max-h-[25rem]">
        <table className="min-w-full bg-white my-5">
          <thead className="text-[12px] text-center text-dropdownText">
            <tr style={{ backgroundColor: "#F9F7F0" }}>
              {tableHeaders.map((heading, index) => (
                <th
                  className="py-2 px-4 font-medium border-b border-tableBorder"
                  key={index}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {loading.skeleton ? (
              [...Array(filteredAccounts.length>0?filteredAccounts.length: 5)].map((_, idx) => (
                <TableSkelton key={idx} columns={tableHeaders} />
              ))
            ) : filteredAccounts.length > 0 ? (
              filteredAccounts.reverse().map((item, index) => (
                <tr key={item._id} className="relative cursor-pointer" onClick={()=>navigate(`/accountant/view/${item._id}?fromBank=true`)}>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {index + 1}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                   
                      {item.accountName || '-'}
                
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.accountCode || '-'}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.accountSubhead || '-'}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.description || '-'}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.accountHead || '-'}
                  </td>
                  {/* <td className="cursor-pointer py-2.5 px-4 border-y border-tableBorder">
                    <div className="flex justify-end">
                      <Ellipsis height={17} />
                    </div>
                  </td> */}
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

export default Table;
