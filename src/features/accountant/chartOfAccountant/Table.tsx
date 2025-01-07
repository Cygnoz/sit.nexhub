import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../Components/SearchBar";
import Pagination from "../../../Components/Pagination/Pagination";
import NoDataFoundTable from "../../../Components/skeleton/Table/NoDataFoundTable";
import TableSkelton from "../../../Components/skeleton/Table/TableSkelton";
import Eye from "../../../assets/icons/Eye";
import NewAccountModal from "./NewAccountModal";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import toast from "react-hot-toast";

interface Account {
  _id: string;
  accountName: string;
  accountCode: string;
  accountSubhead: string;
  accountHead: string;
  description: string;
}

interface TableProps {
  accountData: Account[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  loading: any;
}

const Table = ({ accountData, searchValue, setSearchValue, loading }: TableProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const maxVisiblePages = 5;

  // Filter and reverse the data
  const filteredAccounts = accountData
    .filter((account) => {
      const searchValueLower = searchValue.toLowerCase();
      return (
        account.accountName?.toLowerCase()?.startsWith(searchValueLower) ||
        account.accountCode?.toLowerCase()?.startsWith(searchValueLower) ||
        account.accountSubhead?.toLowerCase()?.startsWith(searchValueLower) ||
        account.accountHead?.toLowerCase()?.startsWith(searchValueLower) ||
        account.description?.toLowerCase()?.startsWith(searchValueLower)
      );
    })
    .reverse();

  const totalPages = Math.ceil(filteredAccounts.length / rowsPerPage);
  const paginatedData = filteredAccounts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const [oneAccountData,setOneAccountData]=useState <any> ({})
console.log(oneAccountData,"oneAccountData");

  const { request: fetchOneItem } = useApi("get", 5001);
  const getOneItem = async (item: Account) => {
    try {
      const url = `${endponits.GET_ONE_ACCOUNT}/${item._id}`;
      const { response, error } = await fetchOneItem(url);
      if (!error && response) {
        setOneAccountData(response.data);
        console.log(response.data,"diwudew");
        
      } else {
        console.error("Failed to fetch one item data.");
      }
    } catch (error) {
      toast.error("Error in fetching one item data.");
      console.error("Error in fetching one item data", error);
    }
  };
  

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const tableHeaders = [
    "Sl.No",
    "Account Name",
    "Account Code",
    "Account Type",
    "Parent Account Type",
    "Actions",
    "",
  ];

  return (
    <div>
      <SearchBar
        placeholder="Search"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
      <div className="min-h-[25rem] overflow-y-auto mt-1">
        <table className="min-w-full bg-white mb-5">
          <thead className="text-[12px] text-center text-dropdownText sticky top-0 z-10">
            <tr style={{ backgroundColor: "#F9F7F0" }}>
              {tableHeaders.map((heading, index) => (
                <th
                  className="py-3 px-4 font-medium border-b border-tableBorder"
                  key={index}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {loading.skeleton ? (
              [...Array(paginatedData.length > 0 ? paginatedData.length : 5)].map(
                (_, idx) => <TableSkelton key={idx} columns={tableHeaders} />
              )
            ) : paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={item._id}
                  className="relative"
                >
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.accountName}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.accountCode}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.accountSubhead}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.accountHead}
                  </td>
                  <td className="py-3 gap-3 px-4 border-b border-tableBorder flex justify-center items-center">

                    <div onClick={() => {
                      getOneItem(item); 
                    }}>
                      <NewAccountModal page="Edit" fetchAllAccounts={function (): void {
                        throw new Error("Function not implemented.");
                      }} accountData={oneAccountData} />
                    </div>

                    <div onClick={() => navigate(`/accountant/view/${item._id}`)} className="cursor-pointer">
                      <Eye color="#569FBC" />
                    </div>
                  </td>
                  <td className="cursor-pointer py-2.5 px-4 border-y border-tableBorder">
                    <div className="flex justify-end"></div>
                  </td>
                </tr>
              ))
            ) : (
              <NoDataFoundTable columns={tableHeaders} />
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        maxVisiblePages={maxVisiblePages}
      />
    </div>
  );
};

export default Table;
