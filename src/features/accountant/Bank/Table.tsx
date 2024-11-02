import { useContext, useEffect, useState } from "react";
import Ellipsis from "../../../assets/icons/Ellipsis";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import SearchBar from "../../../Components/SearchBar";
import { BankResponseContext } from "../../../context/ContextShare";
import { Link } from "react-router-dom";

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

  const tableHeaders = [
    "Sl No",
    "Account Name",
    "Account Code",
    "Account Type",
    "Documents",
    "Parent Account Type",
    "",
  ];

  useEffect(() => {
    fetchAllAccounts();
  }, [bankResponse]);

  const fetchAllAccounts = async () => {
    try {
      const url = `${endponits.Get_ALL_Acounts}`;
      const apiResponse = await AllAccounts(url);
      const { response, error } = apiResponse;
      if (!error && response) {
        setAccountData(
          response.data.filter(
            (account: Account) => account.accountSubhead === "Bank"
          )
        );
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
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
            {filteredAccounts.reverse().map((item, index) => (
              <tr key={item._id} className="relative">
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {index + 1}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <Link to={`/accountant/view/${item._id}?fromBank=true`}>
                    {item.accountName}
                  </Link>
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.accountCode}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.accountSubhead}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.description}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.accountHead}
                </td>
                <td className="cursor-pointer py-2.5 px-4 border-y border-tableBorder">
                  <div className="flex justify-end">
                    <Ellipsis height={17} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
