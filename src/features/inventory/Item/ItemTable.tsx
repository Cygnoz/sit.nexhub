import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomiseColmn from "../../../Components/CustomiseColum";
import SearchBar from "../../../Components/SearchBar";
import NoDataFoundTable from "../../../Components/skeleton/Table/NoDataFoundTable";
import TableSkelton from "../../../Components/skeleton/Table/TableSkelton";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import BookIcon from "../../../assets/icons/BookIcon";
import BookXIcon from "../../../assets/icons/BookXIcon";
import NewspaperIcon from "../../../assets/icons/NewspaperIcon";
import { TableResponseContext } from "../../../context/ContextShare";
import Print from "../../sales/salesOrder/Print";
import ItemView from "./ItemView";

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

const ItemTable = () => {

  const initialColumns: Column[] = [
    { id: "itemName", label: "Name ", visible: true },
    { id: "sku", label: "SKU", visible: true },
    { id: "sellingPrice", label: "Sales Rate", visible: true },
    { id: "costPrice", label: "Purchase Rate", visible: true },
    { id: "currentStock", label: "Stock", visible: true },
    { id: "itemsDetails", label: 'Actions', visible: true },
    { id: "reorderPoint", label: "ReorderPoint", visible: false },
  ];
  const [selected, setSelected] = useState("All");

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [itemsData, setItemsData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const { loading, setLoading } = useContext(TableResponseContext)!;

  const { request: GetAllItems } = useApi("get", 5003);
  const fetchAllItems = async () => {
    try {
      const url = `${endponits.GET_ALL_ITEMS_TABLE}`;
      // Set loading state to show the skeleton loader
      setLoading({ ...loading, skeleton: true });

      const { response, error } = await GetAllItems(url);

      if (error || !response) {
        // Handle no data scenario
        setLoading({ ...loading, skeleton: false, noDataFound: true });
        return;
      }

      // Set items data if response is valid
      setItemsData(response.data);

      // Turn off the skeleton loader after data is received
      setLoading({ ...loading, skeleton: false });

    } catch (error) {
      console.error("Error fetching items:", error);
      // Handle error state
      setLoading({ ...loading, noDataFound: true, skeleton: false });
    }
  };



  const [allCategoryData, setAllcategoryData] = useState<any[]>([]);

  const { request: fetchAllCategories } = useApi("put", 5003);
  const loadCategories = async () => {
    try {
      const url = `${endponits.GET_ALL_BRMC}`;
      const body = { type: "category" };
      const { response, error } = await fetchAllCategories(url, body);
      if (!error && response) {
        setAllcategoryData(response.data);
      } else {
        console.error("Failed to fetch Category data.");
      }
    } catch (error) {
      toast.error("Error in fetching Category data.");
      console.error("Error in fetching Category data", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);



  useEffect(() => {
    fetchAllItems();
  }, []);


  const renderColumnContent = (colId: string, item: any) => {
    if (colId === "itemName") {
      return <span className="font-bold text-sm">{item[colId]}</span>;
    } else if (colId === "itemsDetails") {
      return (

        <div className="flex justify-center items-center">
          <ItemView fetchAllItems={fetchAllItems} item={item} />
        </div>

      );
    }

    const columnValue = item[colId as keyof typeof item];
    return columnValue ? (
      <span>{columnValue}</span>
    ) : (
      <span className="text-gray-500 italic">-</span>
    );
  };

  const Items = [
    {
      icon: <BookIcon color="#585953" />,
      title: "All",
      onClick: () => setSelected("All"),
    },
    {
      icon: <BookXIcon color="#585953" />,
      title: "Low Stock",
      onClick: () => setSelected("Low Stock"),
    },
    ...allCategoryData.map((category) => ({
      icon: <NewspaperIcon color="#585953" />,
      title: category.categoriesName,
      onClick: () => setSelected(category.categoriesName), // Sets the selected category
    })),
  ];
  const filteredItems = itemsData.filter((item) => {
    const searchValueLower = searchValue.toLowerCase();
    const matchesSearch = item.itemName?.toLowerCase().includes(searchValueLower);

    if (selected === "All") {
      return matchesSearch;
    } else if (selected === "Low Stock") {
      return matchesSearch && item.currentStock < item.reorderPoint;
    } else {
      return matchesSearch && item.categories === selected;
    }
  });






  return (
    <div>
      <div>
        <div className="flex gap-3 py-2 justify-between">
          {Items.map((customer) => (
            <button
              key={customer.title}
              onClick={() => setSelected(customer.title)}
              className={`flex items-center gap-2 p-2 w-[100%] justify-center  rounded ${selected === customer.title ? "bg-WhiteIce" : "bg-white"
                }`}
              style={{ border: "1px solid #DADBDD" }}
            >
              {customer.icon}
              <span
                style={{ color: "#4B5C79", fontSize: "12px", fontWeight: "600" }}
              >
                {customer.title}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="w-full ">
          <SearchBar
            placeholder="Search"
            searchValue={searchValue}
            onSearchChange={setSearchValue}
          />
        </div>
        <div className="flex gap-4">
          {/* <ItemSort/> */}
          <Print />
        </div>
      </div>
      <div
        className="mt-3 max-h-[25rem] overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <table className="min-w-full bg-white mb-5">
          <thead className="text-[12px] text-center text-dropdownText sticky top-0 z-10">
            <tr style={{ backgroundColor: "#F9F7F0" }}>
              <th className="py-3 px-4 border-b border-tableBorder">Sl No</th>
              {columns.map((col, index) =>
                col.visible ? (
                  <th
                    className="py-2 px-4 font-medium border-b border-tableBorder"
                    key={index}
                  >
                    {col.label}
                  </th>
                ) : null
              )}

              <th className="py-2.5 px-4 font-medium border-b border-tableBorder">
                <CustomiseColmn columns={columns} setColumns={setColumns} />
              </th>
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {loading.skeleton ? (
              [...Array(filteredItems?.length ? filteredItems?.length : 5)].map((_, idx) => (
                <TableSkelton key={idx} columns={[...columns, "ee"]} />
              )) // Skeleton loader
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <tr
                  key={item.id}
                  // onClick={() => openModal(item)} // Open modal on row click
                  className="relative cursor-pointer hover:bg-[#EAECF0]"
                >
                  <td className="py-2.5 px-4 border-y border-tableBorder">{index + 1}</td>
                  {columns.map(
                    (col) =>
                      col.visible && (
                        <td
                          key={col.id}
                          className="py-2.5 px-4 border-y border-tableBorder"
                        >
                          {renderColumnContent(col.id, item)}
                        </td>
                      )
                  )}

                  <td className="py-2.5 px-4 border-y border-tableBorder">{" "}</td> {/* Empty cell for consistent styling */}
                </tr>
              ))
            ) : (
              <NoDataFoundTable columns={[...columns, "ee"]} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemTable;