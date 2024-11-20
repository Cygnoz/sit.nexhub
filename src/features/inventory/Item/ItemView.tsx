import { useState } from 'react'
import Button from '../../../Components/Button'
import Modal from '../../../Components/model/Modal';
import toast from 'react-hot-toast';
import { useOrganization } from '../../../context/OrganizationContext';
import useApi from '../../../Hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { endponits } from '../../../Services/apiEndpoints';
import Pen from '../../../assets/icons/Pen';
import Trash2 from '../../../assets/icons/Trash2';
import FileSearchIcon from '../../../assets/icons/FileSearchIcon';
import Ellipsis from '../../../assets/icons/Ellipsis';
import noImage from '../../../assets/Images/noImage.png'
import line from '../../../assets/Images/Rectangle 5557.png'

import UserCheck from '../../../assets/icons/UserCheck';
import ArrowRightLeft from '../../../assets/icons/ArrowRightLeft';
import ListTreeIcon from '../../../assets/icons/ListTreeIcon';
import Eye from '../../../assets/icons/Eye';
import PencilEdit from '../../../assets/icons/PencilEdit';
type Props = {
  fetchAllItems: () => Promise<any>;
  item: any
}

function ItemView({ fetchAllItems, item }: Props) {
  const [isDeleteImageModalOpen, setDeleteImageModalOpen] = useState(false);

  const { request: UpdateItem } = useApi("put", 5003);
  const { organization: orgData } = useOrganization();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const openModal = (item: any) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };
  const navigate = useNavigate();

  const handleEdit = (item: any) => {
    setSelectedItem(item); // Set the selected item before navigation
    navigate("/inventory/Item/new", { state: { item } }); // Pass the selected item to the new page
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
  console.log(selectedItem);

  return (
    <div>
      <div className='flex justify-center items-center gap-2'>
        <div onClick={() => handleEdit(item)}> {/* Pass the current item to handleEdit */}
          <PencilEdit color={'#0B9C56'} />
        </div>
        <div onClick={() => openModal(item)}>
          <Eye color={'#569FBC'} />
        </div>
      </div>

      <Modal open={isModalOpen} onClose={closeModal} style={{ width: '80%' }}>
        {selectedItem ? (
          <div className='text-[#303F58]'>
            <div className="flex justify-end  me-3">
              <div className="text-2xl font-normal cursor-pointer relative z-10" onClick={closeModal}>
                &times;
              </div>
            </div>
            <div className="px-5 pb-3 bg-white rounded-lg">

              <div className="grid grid-cols-12 gap-4">
                <div className='col-span-3 space-y-2'>
                  <div className=" w-full rounded-[4px] pb-2 border-[#F1F1F1] border-2 ">
                    <div className='h-16 bg-[#FFF0DA] items-center rounded-t-[2px] flex justify-between px-2'>
                      <div className='flex flex-col w-full items-start '>
                        <p className='text-lg font-bold '>{selectedItem.itemName}</p>
                        <p className='text'>{selectedItem.sku ? selectedItem.sku : ""}</p>
                      </div>
                      <div className='flex gap-1 w-full justify-end'>
                        <Button
                          variant="tertiary"
                          className="text-xs font-medium h-[20px] pl-2 pr-2"
                          onClick={() => handleEdit(item)}
                        >
                          <Pen color="#585953" /> Edit
                        </Button>
                        <Ellipsis />
                      </div>
                    </div>
                    <div className={`flex justify-center ${selectedItem?.itemImage && 'py-2'}`}>
                      <img
                        src={
                          selectedItem?.itemImage ||
                          noImage
                        }
                        width={200}
                        alt="Item image"
                        className="rounded-lg text-xs"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png';
                        }}
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
                        28<span className="text-[16px] text-[#8F99A9]"> units</span>
                      </p>
                    </div>
                    <div className='bg-[#882626] w-full px-2 flex text-[#D4D4D4] text-[15px] font-medium py-1 justify-between rounded-md'>
                      <p>Expected Restock Date</p>
                      <p>10-03-26</p>
                    </div>
                  </div>
                  <div className="w-full  rounded-lg border flex flex-col p-4  justify-between  bg-gradient-to-r from-[#6B1515] to-[#240C0C] ">
                    <div className="flex justify-between items-center">
                      <p className="text-[16px] font-semibold text-[#D4D4D4]">
                        Main <span className="text-[#DF3232]">Supplier</span>
                      </p>
                      <div className="w-[34px] h-[34px] rounded-[3px] bg-[#741E1E] flex justify-center items-center">
                        <UserCheck color='#FF7070' />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-start">
                      <p className="text-[#FFFFFF]">
                        <span >Name :</span> Ted Cravitz
                      </p>
                      <p className="text-[#FFFFFF]">
                        <span >Phone :</span> 023-3652-547
                      </p>
                      <p className="text-[#FFFFFF]">
                        <span >Address :</span> 2871 Meadowbrook Lane, Minneapolis, MN 55422
                      </p>
                    </div>
                  </div>

                </div>
                <div className="col-span-9 border-2 rounded-lg border-[#E9E9E9] h-[650px] flex flex-col  ">
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
                        <div className="rounded-lg shadow p-6 text-left bg-[#F5F8FC]">
                          <div className="grid grid-cols-2 gap-y-4">
                            <div className="text-dropdownText font-normal text-sm space-y-4">
                              <p>Item Type</p>
                              <p>SKU</p>
                              <p>Unit</p>
                              <p>Created Source</p>
                            </div>
                            <div className="text-dropdownText font-semibold text-sm space-y-4">
                              <p>
                                {selectedItem?.itemType
                                  ? selectedItem.itemType.charAt(0).toUpperCase() +
                                  selectedItem.itemType.slice(1)
                                  : "N/A"}
                              </p>
                              <p>{selectedItem?.sku || "N/A"}</p>
                              <p>{selectedItem?.unit || "N/A"}</p>
                              <p>{selectedItem?.createdSource || "N/A"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Purchase Information */}
                        <div className="rounded-lg shadow p-6 text-left bg-[#F5F8FC]">
                          <p className="font-bold text-base text-textColor mb-4">Purchase Information</p>
                          <div className="grid grid-cols-2 gap-y-4">
                            <p className="text-dropdownText text-sm">Cost Price</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {orgData?.baseCurrency?.length === 1
                                ? `${orgData.baseCurrency} ${selectedItem?.costPrice || "N/A"}`
                                : `${selectedItem?.costPrice || "N/A"} ${orgData?.baseCurrency}`}
                            </p>
                            <p className="text-dropdownText text-sm">Purchase Account</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {selectedItem?.purchaseAccount || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Sales Information */}
                        <div className="rounded-lg shadow p-6 text-left bg-[#F5F8FC]">
                          <p className="font-bold text-base mb-4">Sales Information</p>
                          <div className="grid grid-cols-2 gap-y-4">
                            <p className="text-dropdownText text-sm">Selling Price</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {orgData?.baseCurrency?.length === 1
                                ? `${orgData.baseCurrency} ${selectedItem?.sellingPrice || "N/A"}`
                                : `${selectedItem?.sellingPrice || "N/A"} ${orgData?.baseCurrency}`}
                            </p>
                            <p className="text-dropdownText text-sm">Selling Account</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {selectedItem?.sellingAccount || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* storage information */}

                        <div className="rounded-lg shadow p-6 text-left bg-[#F5F8FC]">
                          <p className="font-bold text-base text-textColor mb-4">Storage Information</p>
                          <div className="grid grid-cols-4 gap-y-4">
                            {/* Row 1: Length and Warranty */}
                            <p className="text-dropdownText text-sm">Length</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {selectedItem?.length || "N/A"}
                            </p>
                            <p className="text-dropdownText text-sm">Warranty</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {selectedItem?.warranty || "N/A"}
                            </p>

                            {/* Row 2: Width */}
                            <p className="text-dropdownText text-sm">Width</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {selectedItem?.width || "N/A"}
                            </p>
                            <div className="col-span-2"></div> {/* Empty cells for alignment */}

                            {/* Row 3: Weight */}
                            <p className="text-dropdownText text-sm">Weight</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {selectedItem?.weight || "N/A"} Kg
                            </p>
                            <div className="col-span-2"></div> {/* Empty cells for alignment */}
                          </div>
                        </div>


                        {/* Classification Details */}

                        <div className="rounded-lg shadow p-6 text-left bg-[#F5F8FC]">
                          <p className="font-bold text-base text-textColor mb-4">Classification Details</p>
                          <div className="grid grid-cols-4 gap-y-4">
                            {/* Row 1: Manufacturer and Rack */}
                            <p className="text-dropdownText text-sm">Manufacturer</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {selectedItem?.manufacturer || "N/A"}
                            </p>
                            <p className="text-dropdownText text-sm">Rack</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {selectedItem?.rack || "N/A"}
                            </p>

                            {/* Row 2: Brand */}
                            <p className="text-dropdownText text-sm">Brand</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {selectedItem?.brand || "N/A"}
                            </p>
                            <div className="col-span-2"></div> {/* Empty cells for alignment */}

                            {/* Row 3: Categories */}
                            <p className="text-dropdownText text-sm">Categories</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {selectedItem?.categories || "N/A"} Kg
                            </p>
                            <div className="col-span-2"></div> {/* Empty cells for alignment */}
                          </div>
                        </div>




                        {/* Item Code & Standards */}
                        <div className="rounded-lg shadow p-6 text-left bg-[#F5F8FC]">
                          <p className="font-bold text-base mb-4">Item Code & Standards</p>
                          <div className="grid grid-cols-4 gap-y-4">
                            {/* Row 1: UPC and ISBN */}
                            <p className="text-dropdownText text-sm">UPC</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {selectedItem?.upc || "N/A"}
                            </p>
                            <p className="text-dropdownText text-sm">ISBN</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {selectedItem?.isbn || "N/A"}
                            </p>

                            {/* Row 2: MPN */}
                            <p className="text-dropdownText text-sm">MPN</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {selectedItem?.mpn || "N/A"}
                            </p>
                            <div className="col-span-2"></div> {/* Empty cells for alignment */}

                            {/* Row 3: EAN */}
                            <p className="text-dropdownText text-sm">EAN</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {selectedItem?.ean || "N/A"}
                            </p>
                            <div className="col-span-2"></div> {/* Empty cells for alignment */}
                          </div>
                        </div>

                        {/* Purchase Information */}
                        <div className="rounded-lg shadow p-6 text-left bg-[#F5F8FC]">
                          <p className="font-bold text-base mb-4">Purchase Information</p>
                          <div className="grid grid-cols-4 gap-y-4">
                            {/* Row 1: Cost and MRP */}
                            <p className="text-dropdownText text-sm">Cost</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {orgData?.baseCurrency?.length === 1
                                ? `${orgData.baseCurrency} ${selectedItem?.cost || "N/A"}`
                                : `${selectedItem?.costPrice || "N/A"} ${orgData?.baseCurrency}`}
                            </p>
                            <p className="text-dropdownText text-sm">MRP</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {orgData?.baseCurrency?.length === 1
                                ? `${orgData.baseCurrency} ${selectedItem?.mrp || "N/A"}`
                                : `${selectedItem?.saleMrp || "N/A"} ${orgData?.baseCurrency}`}
                            </p>

                            {/* Row 2: Preferred Vendor */}
                            <p className="text-dropdownText text-sm">Preferred Vendor</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {selectedItem?.preferredVendor || "N/A"}
                            </p>
                            <div className="col-span-2"></div> {/* Empty cells for alignment */}

                            {/* Row 3: Selling Price */}
                            <p className="text-dropdownText text-sm">Selling Price</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {orgData?.baseCurrency?.length === 1
                                ? `${orgData.baseCurrency} ${selectedItem?.sellingPrice || "N/A"}`
                                : `${selectedItem?.sellingPrice || "N/A"} ${orgData?.baseCurrency}`}
                            </p>
                            <div className="col-span-2"></div> {/* Empty cells for alignment */}
                          </div>
                        </div>


                        {/* Track Inventory */}
                        <div className="rounded-lg shadow p-6 text-left bg-[#F5F8FC]">
                          <p className="font-bold text-base mb-4">Track Inventory</p>
                          <div className="grid grid-cols-2 gap-y-4">
                            <p className="text-dropdownText text-sm">Opening  stock</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {selectedItem?.openingStock || "N/A"}
                            </p>
                            <p className="text-dropdownText text-sm">Opening  stock per unit</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {selectedItem?.openingStockRatePerUnit || "N/A"}
                            </p>
                            <p className="text-dropdownText text-sm">Reorder point</p>
                            <p className="text-dropdownText font-semibold text-sm">
                              {selectedItem?.reorderPoint || "N/A"}
                            </p>
                          </div>
                        </div>
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
  )
}

export default ItemView