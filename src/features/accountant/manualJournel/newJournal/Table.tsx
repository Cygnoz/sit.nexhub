import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../../Components/SearchBar";
import NoDataFoundTable from "../../../../Components/skeleton/Table/NoDataFoundTable";
import TableSkelton from "../../../../Components/skeleton/Table/TableSkelton";
import { TableResponseContext } from "../../../../context/ContextShare";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";

interface Journal {
  _id: string;
  date: string;
  journalId: string;
  reference: string;
  note: string;
  status: string;
  totalDebitAmount: string;
}

type Props = {};

function Table({}: Props) {
  const navigate = useNavigate();
  const {loading,setLoading}=useContext(TableResponseContext)!;
  const [journalData, setJournalData] = useState<Journal[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const { request: AllJournals } = useApi("get", 5001);
  
  const tableHeaders = [
    "Date",
    "Journal",
    "Reference rating",
    "Notes",
    "Status",
    "Amount",
    "",
  ];

  const getAllJournals = async () => {
    try {
      // Set loading skeleton state before API call
      setLoading({ ...loading, skeleton: true, noDataFound: false });
  
      const url = `${endponits.GET_ALL_JOURNALS}`;
      const { response, error } = await AllJournals(url);
      
      if (error || !response) {
        // If there's an error or no response, show "No Data Found"
        setLoading({ ...loading, skeleton: false, noDataFound: true });
        return;
      }
  
      // If data is received, set the journal data
      setJournalData(response.data);
  
      // Turn off the skeleton loader after data is received
      setLoading({ ...loading, skeleton: false });
  
    } catch (error) {
      // Handle error
      console.error("Something went wrong:", error);
      setLoading({ ...loading, skeleton: false, noDataFound: true });
    }
  };
  
  useEffect(() => {
    getAllJournals();
  }, []);

  console.log(journalData);
  

  const filteredJournals = journalData.filter((journal) => {
    const searchValueLower = searchValue.toLowerCase().trim();
    return (
      journal.date.toLowerCase().startsWith(searchValueLower) ||
      journal.journalId.toLowerCase().startsWith(searchValueLower) ||
      journal.note.toLowerCase().startsWith(searchValueLower) ||
      journal.reference.toLowerCase().startsWith(searchValueLower) ||
      journal.totalDebitAmount.toLowerCase().startsWith(searchValueLower)
    );
  });

  return (
    <div className="overflow-x-auto my-1">
      <div className="mb-3">
        <SearchBar
          onSearchChange={setSearchValue}
          searchValue={searchValue}
          placeholder="Search Journals"
        />
      </div>
      <table className="min-w-full bg-white mb-5">
      <thead className="text-[12px] text-center text-dropdownText">
        <tr style={{ backgroundColor: "#F9F7F0" }}>
          <th className="py-3 px-4 border-b border-tableBorder">Sl No</th>
          {tableHeaders.map((heading, index) => (
            <th className="py-2 px-4 font-medium border-b border-tableBorder" key={index}>
              {heading}
            </th>
          ))}
        </tr>
      </thead>
     
      <tbody className="text-dropdownText text-center text-[13px]">
      {loading.skeleton ? (
  [...Array(filteredJournals.length>0?filteredJournals.length:5)].map((_, idx) => (
    <TableSkelton key={idx} columns={tableHeaders} />
  ))
) : filteredJournals.length > 0 ? (
  filteredJournals.reverse().map((item, index) => (
    // Render actual data rows here
    <tr
    onClick={() => navigate(`/accountant/manualjournal/view/${item._id}`)}
    key={item._id}
    className="relative cursor-pointer"
  >
    <td className="py-2.5 px-4 border-y border-tableBorder">
      {index + 1}
    </td>
    <td className="py-2.5 px-4 border-y border-tableBorder">
      {item.date}
    </td>
    <td className="py-2.5 px-4 border-y border-tableBorder">
      {item.journalId?item.journalId:"-"}
    </td>
    <td className="py-2.5 px-4 border-y border-tableBorder">
      {item.reference?item.reference:"-"}
    </td>
    <td className="py-2.5 px-4 border-y border-tableBorder">
    {item.note?item.note:"-"}
    </td>
    <td className="py-2.5 px-4 border-y border-tableBorder">
    {item.status?item.status:"-"}
    </td>
    <td className="py-2.5 px-4 border-y border-tableBorder">
      {item.totalDebitAmount?item.totalDebitAmount:"-"}
    </td>
    <td className="cursor-pointer py-2.5 px-4 border-y border-tableBorder">
      <div className="flex justify-end">
        {/* <Ellipsis height={17} /> */}
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
  );
}

export default Table;
