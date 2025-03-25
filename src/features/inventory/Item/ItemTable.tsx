import { useEffect, useRef, useState } from "react";
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
import noImage from '../../../assets/Images/no-image-icon-23485.png'
import ListTreeIcon from "../../../assets/icons/ListTreeIcon";
import UserCheck from "../../../assets/icons/UserCheck";
import ArrowRightLeft from "../../../assets/icons/ArrowRightLeft";
import line from '../../../assets/Images/Rectangle 5557.png'
import { useOrganization } from "../../../context/OrganizationContext";
import PencilEdit from "../../../assets/icons/PencilEdit";
import Eye from "../../../assets/icons/Eye";
import TrashCan from "../../../assets/icons/TrashCan";
import ConfirmModal from "../../../Components/ConfirmModal";
import { useReactToPrint } from "react-to-print";

interface Column {
  id: string;
  label: string;
  visible: boolean;
}
type Props = {
  hsnsac: any
};

const ItemTable = ({ hsnsac }: Props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteImageModalOpen, setDeleteImageModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [oneItem, setOneItem] = useState<any>(null)

  console.log(selectedItem, "selectedItem");

  const { request: UpdateItem } = useApi("put", 5003);
  const { request: deleteItem } = useApi("delete", 5003);
  const { organization: orgData } = useOrganization();

  const openModal = (item: any) => {
    getOneItem(item);
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
    { id: "currentStock", label: "Current Stock", visible: true },
    { id: "itemsDetails", label: "Actions", visible: true },
    { id: "reorderPoint", label: "ReorderPoint", visible: false },

  ];
  const [selected, setSelected] = useState("All");
  const [activeTab, setActiveTab] = useState("overview");
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [itemsData, setItemsData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  const { request: GetAllItems } = useApi("get", 5003);
  const fetchAllItems = async () => {
    try {
      const url = `${endponits.GET_ALL_ITEMS_TABLE}`;
      const { response, error } = await GetAllItems(url);

      if (!error && response) {
        setItemsData(response.data);
        console.log(response.data);

      } else {
        console.error("Error in response:", error);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
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

  const { request: fetchOneItem } = useApi("get", 5003);
  const getOneItem = async (item: any) => {
    try {
      const url = `${endponits.GET_ONE_ITEM}/${item._id}`;
      const { response, error } = await fetchOneItem(url);
      if (!error && response) {
        const updatedItem = {
          ...item,
          itemImage: response.data.itemImage,
        };
        setOneItem(updatedItem);
        return updatedItem;
      } else {
        console.error("Failed to fetch one item data.");
        return item;
      }
    } catch (error) {
      toast.error("Error in fetching one item data.");
      console.error("Error in fetching one item data", error);
      return item;
    }
  };


  useEffect(() => {
    loadCategories();
    fetchAllItems();
  }, []);

  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/inventory/Item/new", {
      state: {
        item: selectedItem,
        hsnSac: hsnsac || false,
      },
    });
  };

  const handleEditOnTable = async (item: any) => {
    const fullItemData = await getOneItem(item);

    navigate("/inventory/Item/new", {
      state: {
        item: fullItemData || item,
        hsnSac: hsnsac || false,
      },
    });
  };



  const handleDeleteImage = async (itemId: string) => {
    if (selectedItem) {
      const updatedItem = { ...selectedItem, itemImage: "" };

      try {
        const url = `${endponits.UPDATE_ITEM}/${itemId}`; // Use the passed itemId here
        const { response, error } = await UpdateItem(url, updatedItem);

        if (!error && response) {
          toast.success("Image removed and item updated successfully.");
          setSelectedItem(updatedItem);
          fetchAllItems();
          getOneItem(updatedItem);
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
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setConfirmModalOpen(true);
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const url = `${endponits.DELETE_ITEM}/${deleteId}`;
      const { response, error } = await deleteItem(url);
      if (!error && response) {
        toast.success(response.data.message);
        fetchAllItems();
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      toast.error("Error occurred while deleting.");
    } finally {
      setConfirmModalOpen(false);
      setDeleteId(null);
    }
  };


  const renderColumnContent = (colId: string, item: any) => {
    if (colId === "itemName") {
      return <span className="font-bold text-sm">{item[colId]}</span>;
    } else if (colId === "itemsDetails") {
      return (
        <div className='flex justify-center items-center gap-3'>
          <div onClick={() => handleEditOnTable(item)} className="cursor-pointer">
            <PencilEdit color={'#0B9C56'} />
          </div>
          <div onClick={() => openModal(item)} className="cursor-pointer">
            <Eye color={'#569FBC'} />
          </div>
          <div onClick={() => confirmDelete(item._id)}>
            <TrashCan color="red" />
          </div>
        </div>
      )
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
    const matchesItemName = item.itemName?.toLowerCase().includes(searchValueLower);
    const matchesSku = item.sku?.toLowerCase().includes(searchValueLower);
    const matchesSearch = matchesItemName || matchesSku;

    if (selected === "All") {
      return matchesSearch;
    } else if (selected === "Low Stock") {
      return matchesSearch && item.currentStock < item.reorderPoint;
    } else {
      return matchesSearch && item.categories === selected;
    }
  });
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });



  return (
    <div>
      <div>
        <div
          className="flex gap-3 py-2 overflow-x-auto hide-scrollbar"
          style={{ maxWidth: "100%" }}
        >
          {Items.map((customer) => (
            <button
              key={customer.title}
              onClick={() => setSelected(customer.title)}
              className={`flex w-[40%] sm:w-[15%] items-center gap-2 p-2 justify-center rounded ${selected === customer.title ? "bg-WhiteIce" : "bg-white"
                }`}
              style={{
                border: "1px solid #DADBDD",
                flexShrink: 0, // Prevent the button from shrinking
              }}
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
        <div className="flex gap-4" onClick={() => reactToPrintFn()}>
          {/* <ItemSort/> */}
          <Print />
        </div>
      </div>
      <div
        ref={contentRef}
        className="mt-3 max-h-[25rem] overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <table className="min-w-full bg-white mb-5">
          <thead className="text-[12px] text-center text-dropdownText">
            <tr style={{ backgroundColor: "#F9F7F0" }} className="sticky top-0 z-10">
              {/* Serial Number Header */}
              <th className="py-2.5 px-4 font-medium border-b border-tableBorder">Sl.No</th>

              {columns.map(
                (col) =>
                  col.visible && (
                    <th
                      key={col.id}
                      className={`py-2 px-4 font-medium border-b border-tableBorder ${col.id === "itemsDetails" ? "hide-print" : ""}`}
                    >
                      {col.label}
                    </th>
                  )
              )}
              <th className="py-2.5 px-4 font-medium border-b border-tableBorder"></th>
              <th className="py-2 px-4 font-medium border-b border-tableBorder hide-print">
                <CustomiseColmn columns={columns} setColumns={setColumns} tableId={"item"} />
              </th>
              {/* "See Details" Header */}

            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {filteredItems && filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <tr key={item.id} className="relative">
                  {/* Serial Number Cell */}
                  <td className="py-2.5 px-4 border-y border-tableBorder">{index + 1}</td>

                  {columns.map(
                    (col) =>
                      col.visible && (
                        <td
                          key={col.id}
                          className={`py-2.5 px-4 border-y border-tableBorder ${col.id === "itemsDetails" ? "hide-print" : ""}`}
                        >
                          {renderColumnContent(col.id, item)}
                        </td>
                      )
                  )}
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder hide-print"></td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 3} // Adjusted colSpan to account for the serial number, customize, and action columns
                  className="text-center py-4 border-y border-tableBorder"
                >
                  <p className="text-red-500">No Data Found!</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>


      </div>

      {/* Modal for showing item details */}
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        className="w-[90%] sm:w-[80%] max-h-[90vh] overflow-y-auto  sm:max-h-none"
      >
        {selectedItem ? (
          <div className='text-[#303F58]'>
            <div className="flex justify-end  me-3">
              <div className="text-2xl font-normal cursor-pointer relative z-10" onClick={closeModal}>
                &times;
              </div>
            </div>
            <div className="px-5 pb-3 bg-white rounded-lg">

              <div className="grid grid-cols-12 gap-4">
                <div className='lg:col-span-5 md:col-span-12 sm:col-span-3 col-span-12 space-y-2'>
                  <div className=" w-full rounded-[4px] pb-2 border-[#F1F1F1] border-2 ">
                    <div className='h-16 bg-[#FFF0DA] items-center rounded-t-[2px] flex justify-between px-2'>
                      <div className='flex flex-col w-full items-start '>
                        <p className='text-lg font-bold w-full '>{selectedItem.itemName}</p>
                        <p className='text'>{selectedItem.sku ? selectedItem.sku : ""}</p>
                      </div>
                      <div className='flex gap-1 justify-end'>
                        <Button
                          variant="tertiary"
                          className="text-xs font-medium h-[20px] pl-2 pr-2"
                          onClick={handleEdit}
                        >
                          <Pen color="#585953" /> Edit
                        </Button>
                      </div>
                    </div>
                    <div className={`flex justify-center ${oneItem?.itemImage && 'py-2'}`}>
                      <img
                        src={
                          oneItem?.itemImage ||
                          noImage
                        }
                        alt="Item image"
                        className="rounded-lg object-contain text-xs w-52 h-32"
                      />
                    </div>
                    <div className=" flex gap-2 justify-end pe-3">
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
                  <div className='w-full rounded-lg border flex flex-col p-3 justify-between bg-gradient-to-r from-[#6B1515] to-[#240C0C]'>
                    <div className='flex justify-between'>
                      <p className='text-[16px] font-semibold text-[#D4D4D4]' >Outstanding Stock</p>
                      <div className='w-[34px] h-[34px] rounded-[3px] bg-[#741E1E] flex justify-center items-center'>
                        <ListTreeIcon />
                      </div>
                    </div>
                    <div className='text-start'>
                      <p className="text-[48px] font-bold text-[#C04545]">
                        {selectedItem?.openingStock || 0}<span className="text-[16px] text-[#8F99A9]"> units</span>
                      </p>
                    </div>
                    <div className='bg-[#882626] w-full px-2 flex text-[#D4D4D4] text-[15px] font-medium py-1 justify-between rounded-md'>
                      <p>Restock Point</p>
                      <p>{selectedItem?.reorderPoint || 0} Units</p>
                    </div>
                  </div>
                  {(oneItem?.preferredVendorName ||
                    oneItem?.preferredVendorMobile ||
                    oneItem?.preferredVendorBillingAddressStreet1 ||
                    oneItem?.preferredVendorBillingAddressStreet2 ||
                    oneItem?.preferredVendorBillingCity ||
                    oneItem?.preferredVendorBillingState ||
                    oneItem?.preferredVendorBillingCountry ||
                    oneItem?.preferredVendorBillingPinCode) && (
                      <div className="w-full  rounded-lg border flex flex-col p-4  justify-between  bg-gradient-to-r from-[#6B1515] to-[#240C0C]">
                        <div className="flex justify-between items-center">
                          <p className="text-[16px] font-semibold text-[#D4D4D4]">
                            Main <span className="text-[#DF3232]">Supplier</span>
                          </p>
                          <div className="w-[34px] h-[34px] rounded-[3px] bg-[#741E1E] flex justify-center items-center">
                            <UserCheck color='#FF7070' />
                          </div>
                        </div>
                        <div className="mt-4 space-y-2 text-start">
                          {oneItem?.preferredVendorName && (
                            <p className="text-[#FFFFFF]">
                              <span>Name :</span> {oneItem.preferredVendorName}
                            </p>
                          )}
                          {oneItem?.preferredVendorMobile && (
                            <p className="text-[#FFFFFF]">
                              <span>Phone :</span> {oneItem.preferredVendorMobile}
                            </p>
                          )}
                          {(oneItem?.preferredVendorBillingAddressStreet1 ||
                            oneItem?.preferredVendorBillingAddressStreet2 ||
                            oneItem?.preferredVendorBillingCity ||
                            oneItem?.preferredVendorBillingState ||
                            oneItem?.preferredVendorBillingCountry ||
                            oneItem?.preferredVendorBillingPinCode) && (
                              <p className="text-[#FFFFFF]">
                                <span>Address :</span>{" "}
                                {`${oneItem?.preferredVendorBillingAddressStreet1 ? oneItem.preferredVendorBillingAddressStreet1 + ", " : ""} 
                                ${oneItem?.preferredVendorBillingAddressStreet2 ? oneItem.preferredVendorBillingAddressStreet2 + ", " : ""} 
                                ${oneItem?.preferredVendorBillingCity ? oneItem.preferredVendorBillingCity + ", " : ""} 
                                ${oneItem?.preferredVendorBillingState ? oneItem.preferredVendorBillingState + ", " : ""} 
                                ${oneItem?.preferredVendorBillingCountry ? oneItem.preferredVendorBillingCountry + " - " : ""} 
                                ${oneItem?.preferredVendorBillingPinCode || ""}`}

                              </p>
                            )}
                        </div>
                      </div>
                    )}


                </div>
                <div className="lg:col-span-7 md:col-span-12 sm:col-span-3 col-span-12 border-2 rounded-lg border-[#E9E9E9] h-[600px] flex flex-col  ">
                  {/* Navigation Bar */}
                  <div className="p-3 sticky top-0 z-10 flex items-center text-sm gap-6 bg-white">
                    {/* Overview Tab */}
                    <p
                      className={`cursor-pointer flex items-center gap-2 ${activeTab === "overview" ? "text-[#303F58] font-semibold" : "text-[#8F99A9]"
                        }`}
                      onClick={() => setActiveTab("overview")}
                    >
                      <FileSearchIcon color={activeTab === "overview" ? "#303F58" : "#8F99A9"} /> Overview
                    </p>

                    {/* Transaction Tab */}
                    <p
                      className={`cursor-pointer flex items-center gap-2 ${activeTab === "transaction" ? "text-[#303F58] font-semibold" : "text-[#8F99A9]"
                        }`}
                      onClick={() => setActiveTab("transaction")}
                    >
                      <ArrowRightLeft color={activeTab === "transaction" ? "#303F58" : "#8F99A9"} size={0} /> Transaction
                    </p>
                  </div>

                  <img className="w-[95%] ml-5 h-[0.5%]" src={line} alt="" />


                  {/* Scrollable Content */}
                  <div className="flex-1 p-4 mt-8 overflow-y-auto hide-scrollbar">
                    {/* Conditional Rendering for Tabs */}
                    {activeTab === "overview" && (
                      <div className="space-y-5 text-[#303F58]">
                        {/* General Information */}
                        {(selectedItem?.itemType || selectedItem?.sku || selectedItem?.unit || selectedItem?.createdSource) && (
                          <div className="rounded-lg shadow p-6 text-left bg-[#F5F8FC]">
                            <div className="grid grid-cols-2 gap-y-4">
                              <div className="text-dropdownText font-normal text-sm space-y-4">
                                <p>Item Type</p>
                                <p>{selectedItem?.sku ? "SKU" : ""}</p>
                                <p>{selectedItem?.unit ? "Unit" : ""}</p>
                                <p>{selectedItem?.createdSource ? "Created Source" : ""}</p>
                              </div>
                              <div className="text-dropdownText font-semibold text-sm space-y-4">
                                <p>
                                  {selectedItem?.itemType
                                    ? selectedItem.itemType.charAt(0).toUpperCase() +
                                    selectedItem.itemType.slice(1)
                                    : "N/A"}
                                </p>
                                <p>{selectedItem?.sku ? selectedItem?.sku : ""}</p>
                                <p>{selectedItem?.unit || ""}</p>
                                <p>{selectedItem?.createdSource || ""}</p>
                              </div>
                            </div>
                          </div>
                        )}


                        {/* Purchase Information */}
                        {(selectedItem?.costPrice || orgData?.baseCurrency) && (
                          <div className="rounded-lg shadow p-6 text-left bg-[#F5F8FC]">
                            <p className="font-bold text-base text-textColor mb-4">Purchase Information</p>
                            <div className="grid grid-cols-2 gap-y-4">
                              <p className="text-dropdownText text-sm">Cost Price</p>
                              <p className="text-dropdownText font-semibold text-sm">
                                {orgData?.baseCurrency?.length === 1
                                  ? `${orgData.baseCurrency} ${selectedItem?.costPrice || "N/A"}`
                                  : `${selectedItem?.costPrice || "N/A"} ${orgData?.baseCurrency}`}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Sales Information */}
                        {(selectedItem?.sellingPrice || orgData?.baseCurrency) && (
                          <div className="rounded-lg shadow p-6 text-left bg-[#F5F8FC]">
                            <p className="font-bold text-base mb-4">Sales Information</p>
                            <div className="grid grid-cols-2 gap-y-4">
                              <p className="text-dropdownText text-sm">Selling Price</p>
                              <p className="text-dropdownText font-semibold text-sm">
                                {orgData?.baseCurrency?.length === 1
                                  ? `${orgData.baseCurrency} ${selectedItem?.sellingPrice || "N/A"}`
                                  : `${selectedItem?.sellingPrice || "N/A"} ${orgData?.baseCurrency}`}
                              </p>
                            </div>
                          </div>
                        )}


                        {/* storage information */}
                        {(selectedItem?.length || selectedItem?.warranty || selectedItem?.width || selectedItem?.weight) && (
                          <div className="rounded-lg shadow p-6 text-left bg-[#F5F8FC]">
                            <p className="font-bold text-base text-textColor mb-4">Storage Information</p>
                            <div className="grid  gap-y-4">
                              {selectedItem?.length && (
                                <>
                                  <p className="text-dropdownText text-sm">Length</p>
                                  <p className="text-dropdownText font-semibold text-sm">{selectedItem.length}</p>
                                </>
                              )}
                              {selectedItem?.warranty && (
                                <>
                                  <p className="text-dropdownText text-sm">Warranty</p>
                                  <p className="text-dropdownText font-semibold text-sm">{selectedItem?.warranty || "N/A"}</p>
                                </>
                              )}
                              {selectedItem?.width && (
                                <>
                                  <p className="text-dropdownText text-sm">Width</p>
                                  <p className="text-dropdownText font-semibold text-sm">{selectedItem.width}</p>
                                </>
                              )}
                              {selectedItem?.height && (
                                <>
                                  <p className="text-dropdownText text-sm">Height</p>
                                  <p className="text-dropdownText font-semibold text-sm">{selectedItem.height}</p>
                                </>
                              )}
                              <div className="col-span-2"></div> {/* Empty cells for alignment */}
                              {selectedItem?.weight && (
                                <>
                                  <p className="text-dropdownText text-sm">Weight</p>
                                  <p className="text-dropdownText font-semibold text-sm">{selectedItem.weight} Kg</p>
                                </>
                              )}
                              <div className="col-span-2"></div> {/* Empty cells for alignment */}
                            </div>
                          </div>
                        )}


                        {/* Classification Details */}
                        {(selectedItem?.manufacturer || selectedItem?.rack || selectedItem?.brand || selectedItem?.categories) && (
                          <div className="rounded-lg shadow p-6 text-left bg-[#F5F8FC]">
                            <p className="font-bold text-base text-textColor mb-4">Classification Details</p>
                            <div className="grid grid-cols gap-y-2">
                              {selectedItem?.manufacturer && (
                                <>
                                  <p className="text-dropdownText text-sm">Manufacturer</p>
                                  <p className="text-dropdownText font-semibold text-sm">{selectedItem.manufacturer}</p>
                                </>
                              )}
                              {selectedItem?.rack && (
                                <>
                                  <p className="text-dropdownText text-sm">Rack</p>
                                  <p className="text-dropdownText font-semibold text-sm">{selectedItem.rack}</p>
                                </>
                              )}
                              {selectedItem?.brand && (
                                <>
                                  <p className="text-dropdownText text-sm">Brand</p>
                                  <p className="text-dropdownText font-semibold text-sm">{selectedItem.brand}</p>
                                </>
                              )}
                              <div className="col-span-2"></div>
                              {selectedItem?.categories && (
                                <>
                                  <p className="text-dropdownText text-sm">Categories</p>
                                  <p className="text-dropdownText font-semibold text-sm">{selectedItem.categories}</p>
                                </>
                              )}
                              <div className="col-span-2"></div>
                            </div>
                          </div>
                        )}

                        {/* Item Code & Standards */}
                        {(selectedItem?.upc || selectedItem?.isbn || selectedItem?.mpn || selectedItem?.ean) && (
                          <div className="rounded-lg shadow p-6 text-left bg-[#F5F8FC]">
                            <p className="font-bold text-base mb-4">Item Code & Standards</p>
                            <div className="grid grid-cols gap-y-4">
                              {selectedItem?.upc && (
                                <>
                                  <p className="text-dropdownText text-sm">UPC</p>
                                  <p className="text-dropdownText font-semibold text-sm">{selectedItem.upc}</p>
                                </>
                              )}
                              {selectedItem?.isbn && (
                                <>
                                  <p className="text-dropdownText text-sm">ISBN</p>
                                  <p className="text-dropdownText font-semibold text-sm">{selectedItem.isbn}</p>
                                </>
                              )}
                              {selectedItem?.mpn && (
                                <>
                                  <p className="text-dropdownText text-sm">MPN</p>
                                  <p className="text-dropdownText font-semibold text-sm">{selectedItem.mpn}</p>
                                </>
                              )}
                              <div className="col-span-2"></div>
                              {selectedItem?.ean && (
                                <>
                                  <p className="text-dropdownText text-sm">EAN</p>
                                  <p className="text-dropdownText font-semibold text-sm">{selectedItem.ean}</p>
                                </>
                              )}
                              <div className="col-span-2"></div>
                            </div>
                          </div>
                        )}



                        {/* Track Inventory */}
                        {(selectedItem?.openingStock || selectedItem?.openingStockRatePerUnit || selectedItem?.reorderPoint) && (
                          <div className="rounded-lg shadow p-6 text-left bg-[#F5F8FC]">
                            <p className="font-bold text-base mb-4">Track Inventory</p>
                            <div className="grid grid-cols-2 gap-y-4">
                              {selectedItem?.openingStock && (
                                <>
                                  <p className="text-dropdownText text-sm">Opening Stock</p>
                                  <p className="text-dropdownText font-semibold text-sm">
                                    {selectedItem.openingStock}
                                  </p>
                                </>
                              )}
                              {selectedItem?.openingStockRatePerUnit && (
                                <>
                                  <p className="text-dropdownText text-sm">Opening Stock Per Unit</p>
                                  <p className="text-dropdownText font-semibold text-sm">
                                    {selectedItem.openingStockRatePerUnit}
                                  </p>
                                </>
                              )}
                              {selectedItem?.reorderPoint && (
                                <>
                                  <p className="text-dropdownText text-sm">Reorder Point</p>
                                  <p className="text-dropdownText font-semibold text-sm">
                                    {selectedItem.reorderPoint}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        )}


                      </div>
                    )}

                    {activeTab === "transaction" && (
                      <div className="text-[#303F58]">
                        {/* Transaction Tab Content */}
                        <p>Transaction details will go here...</p>
                      </div>
                    )}
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
                handleDeleteImage(selectedItem._id);
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
      <ConfirmModal
        open={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete?"
      />
    </div>
  );
};

export default ItemTable;