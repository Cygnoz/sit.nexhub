import { useContext, useEffect, useState } from "react";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import CustomiseColmn from "../../../Components/CustomiseColum";
import SearchBar from "../../../Components/SearchBar";
import Print from "../../sales/salesOrder/Print";
import Modal from "../../../Components/model/Modal";
import Button from "../../../Components/Button";
import Pen from "../../../assets/icons/Pen";
import Trash2 from "../../../assets/icons/Trash2";
import FileSearchIcon from "../../../assets/icons/FileSearchIcon";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BookIcon from "../../../assets/icons/BookIcon";
import BookXIcon from "../../../assets/icons/BookXIcon";
import NewspaperIcon from "../../../assets/icons/NewspaperIcon";
import { TableResponseContext } from "../../../context/ContextShare";
import TableSkelton from "../../../Components/skeleton/Table/TableSkelton";
import NoDataFoundTable from "../../../Components/skeleton/Table/NoDataFoundTable";

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

const ItemTable = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteImageModalOpen, setDeleteImageModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const { request: get_currencies } = useApi("get", 5004);
  const { request: UpdateItem } = useApi("put", 5003);
  const [currenciesData, setCurrenciesData] = useState<any[]>([]);
  const currencySymbol = currenciesData.map((i) => i.currencySymbol);

  const openModal = (item: any) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const initialColumns: Column[] = [
    { id: "itemName", label: "Name ", visible: true },
    { id: "sku", label: "SKU", visible: true },
    { id: "sellingPrice", label: "Sales Rate", visible: true },
    { id: "costPrice", label: "Purchase Rate", visible: true },
    { id: "currentStock", label: "Stock", visible: true },
    { id: "reorderPoint", label: "ReorderPoint", visible: false },

  ];
  const [selected, setSelected] = useState("All");

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [itemsData, setItemsData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const {loading,setLoading}=useContext(TableResponseContext)!;
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

  const getHandleCurrencies = async () => {
    try {
      const url = `${endponits.GET_CURRENCIES}`;
      const { response, error } = await get_currencies(url);
      if (!error && response) {
        setCurrenciesData(response.data);
      }
    } catch (error) {
      console.log("Error in fetching currency data", error);
    }
  };

  useEffect(() => {
    fetchAllItems();
    getHandleCurrencies();
  }, []);

  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/inventory/Item/new", { state: { item: selectedItem } });
  };

  const handleDeleteImage = async () => {
    if (selectedItem) {
      const updatedItem = { ...selectedItem, itemImage: "" };

      try {
        const url = `${endponits.UPDATE_ITEM}/${updatedItem._id}`;
        const { response, error } = await UpdateItem(url, updatedItem);

        if (!error && response) {
          toast.success("Image removed and item updated successfully.");
          setSelectedItem(updatedItem);
          fetchAllItems();
        } else {
          toast.error("Error updating item: " + error.response.data.message);
        }
      } catch (error) {
        console.error("Error updating item:", error);
        toast.error("Failed to update item.");
      }
    }
  };

  const confirmDeleteImage = () => {
    setDeleteImageModalOpen(true);
  };

  const closeDeleteImageModal = () => {
    setDeleteImageModalOpen(false);
  };

  const renderColumnContent = (colId: string, item: any) => {
    if (colId === "itemName") {
      return <span className="font-bold text-sm">{item[colId]}</span>;
    }
    return item[colId as keyof typeof item];
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
          className={`flex items-center gap-2 p-2 w-[100%] justify-center  rounded ${
            selected === customer.title ? "bg-WhiteIce" : "bg-white"
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
      [...Array(5)].map((_, idx) => <TableSkelton key={idx} columns={columns} />) // Skeleton loader
    ) : filteredItems.length > 0 ? (
      filteredItems.map((item, index) => (
        <tr
          key={item.id}
          onClick={() => openModal(item)} // Open modal on row click
          className="relative cursor-pointer"
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
          <td className="py-2.5 px-4 border-y border-tableBorder">
            <div className="flex justify-center items-center">
              <Button
                variant="secondary"
                className="font-medium rounded-lg h-[1rem] text-[9.5px]"
                onClick={() => openModal(item)}
              >
                See details
              </Button>
            </div>
          </td>
        </tr>
      ))
    ) : (
      <NoDataFoundTable columns={[...columns,"ee"]} />
    )}
  </tbody>
        </table>



      </div>

      {/* Modal for showing item details */}
      <Modal open={isModalOpen} onClose={closeModal} style={{ width: "80%" }}>
        {selectedItem ? (
          <div className="px-8 py-6 bg-white rounded-lg">
            <div className="flex justify-between mb-2">
              <p className="text-textColor font-bold text-xl">Item Info</p>
              <div
                className="text-3xl font-light cursor-pointer relative z-10"
                onClick={closeModal}
              >
                &times;
              </div>
            </div>
            <div className="flex gap-6">
              <div className="p-6 rounded-lg bg-[#F3F3F3] w-[35%] h-[50%] flex flex-col items-center justify-center">
                <img
                  src={
                    selectedItem?.itemImage ||
                    "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"
                  }
                  alt="Item image"
                  className="rounded-lg text-xs"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png";
                  }}
                />
                <div className="mt-6 flex gap-2">
                  <Button
                    onClick={handleEdit}
                    variant="tertiary"
                    className="text-xs font-medium h-[32px]"
                  >
                    <Pen color="#585953" /> Change image
                  </Button>
                  <Button
                    onClick={confirmDeleteImage}
                    variant="tertiary"
                    className="text-xs font-medium h-[32px]"
                  >
                    <Trash2 color="#585953" /> Delete
                  </Button>
                </div>
              </div>
              <div className="w-full">
                {/* Item Details */}
                <div className="p-3 bg-[#F3F3F3] rounded-lg">
                  <div className="flex justify-between items-center px-3">
                    <div>
                      <p className="font-bold text-textColor text-2xl">
                        {selectedItem.itemName || "N/A"}
                      </p>
                      <p className="text-dropdownText text-base font-normal">
                        {selectedItem.sku || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="tertiary"
                        className="text-xs font-medium h-[32px] pl-3 pr-5"
                        onClick={handleEdit} // Handle navigation to ItemEdit
                      >
                        <Pen color="#585953" /> Edit
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Overview */}
                <div className="p-2 bg-[#F3F3F3] rounded-lg mt-4">
                  <button
                    className={`px-4 py-2 rounded-lg w-[185px] text-sm font-semibold bg-BgSubhead text-textColor`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <FileSearchIcon color="#303F58" /> Overview
                    </span>
                  </button>
                </div>

                {/* Purchase and Sales Information */}
                <div className="bg-[#FDF8F0] rounded-lg mt-4 px-9 py-9">
                  {/* Item Details */}
                  <div className="grid grid-cols-2 gap-y-4">
                    {/* Labels */}
                    <div className="text-dropdownText font-normal text-sm space-y-4">
                      <p>Item Type</p>
                      <p>SKU</p>
                      <p>Unit</p>
                      <p>Date</p>
                      <p>Returnable</p>
                    </div>

                    {/* Values */}
                    <div className="text-dropdownText font-semibold text-sm space-y-4">
                      <p>
                        {selectedItem?.itemType
                          ? selectedItem.itemType.charAt(0).toUpperCase() +
                          selectedItem.itemType.slice(1)
                          : "N/A"}
                      </p>
                      <p>{selectedItem?.sku || "N/A"}</p>
                      <p>{selectedItem?.unit || "N/A"}</p>
                      <p>{selectedItem?.createdDate?.split(" ")[0] || "N/A"}</p>
                      <p>{selectedItem?.returnableItem ? "Yes" : "No"}</p>
                    </div>
                  </div>

                  {/* Purchase Information */}
                  <div className="mt-6">
                    <p className="font-bold text-base text-textColor mb-2">
                      Purchase Information
                    </p>
                    <div className="grid grid-cols-2 gap-y-4">
                      <p className="text-dropdownText text-sm">Cost Price</p>
                      <p className="text-dropdownText font-semibold text-sm">
                        {currencySymbol[0]?.length === 1
                          ? `${currencySymbol[0]} ${selectedItem?.costPrice || "N/A"
                          }`
                          : `${selectedItem?.costPrice || "N/A"} ${currencySymbol[0]
                          }`}
                      </p>

                      {/* <p className="text-dropdownText text-sm">Purchase Account</p>
                      <p className="text-dropdownText font-semibold text-sm">
                        {selectedItem?.purchaseAccount || "N/A"}
                      </p> */}
                    </div>
                  </div>

                  {/* Sales Information */}
                  <div className="mt-6">
                    <p className="font-bold text-base text-textColor mb-2">
                      Sales Information
                    </p>
                    <div className="grid grid-cols-2 gap-y-4">
                      <p className="text-dropdownText text-sm">Selling Price</p>
                      <p className="text-dropdownText font-semibold text-sm">
                        {currencySymbol[0]?.length === 1
                          ? `${currencySymbol[0]} ${selectedItem?.sellingPrice || "N/A"
                          }`
                          : `${selectedItem?.sellingPrice || "N/A"} ${currencySymbol[0]
                          }`}
                      </p>
                      {/* <p className="text-dropdownText text-sm">Sales Account</p>
                      <p className="text-dropdownText font-semibold text-sm">
                        {selectedItem?.salesAccount || "N/A"}
                      </p> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>No item selected</p>
        )}
      </Modal>

      {/* Confirmation modal for deleting image */}
      {isDeleteImageModalOpen && (
        <Modal
          open
          onClose={closeDeleteImageModal}
          className="rounded-lg p-8 w-[546px] h-[160px] text-[#303F58] space-y-8 shadow-xl"
        >
          <p className="text-sm">Are you sure you want to remove the image?</p>
          <div className="flex justify-end gap-2 mb-3">
            <Button
              onClick={closeDeleteImageModal}
              variant="secondary"
              className="pl-8 pr-8 text-sm h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDeleteImage();
                closeDeleteImageModal(); // Close the modal after confirming
              }}
              variant="primary"
              className="pl-8 pr-8 text-sm h-10"
            >
              Ok
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ItemTable;