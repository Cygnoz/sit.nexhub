import React, { useState } from 'react'
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
type Props = {
    fetchAllItems: () => Promise<any>;
    item:any
}

function ItemView({fetchAllItems,item}: Props) {
    const [isDeleteImageModalOpen, setDeleteImageModalOpen] = useState(false);

    const { request: UpdateItem } = useApi("put", 5003);
    const { organization: orgData } = useOrganization();
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const openModal = (item: any) => {
        setSelectedItem(item);
        setModalOpen(true);
      };
    
      const closeModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
      };
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
  console.log(selectedItem);
  
  return (
    <div>
    <Button
              variant="secondary"
              className="font-medium rounded-lg h-[1rem] text-[9.5px]"
              onClick={()=>openModal(item)}
            >
              See details
            </Button>

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
                <p className='text'>{selectedItem.sku?selectedItem.sku:""}</p>
                </div>
                <div className='flex gap-1 w-full justify-end'>
                    <Button
                      variant="tertiary"
                      className="text-xs font-medium h-[20px] pl-2 pr-2"
                      onClick={handleEdit}
                    >
                      <Pen color="#585953" /> Edit
                    </Button>
                  <Ellipsis/>
                </div>
                </div>
              <div className={`flex justify-center ${selectedItem?.itemImage&&'py-2'}`}>
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
            <div className='w-full rounded-lg border flex flex-col p-3 justify-between '>
                <div className='flex justify-between'>
                    <p className='text-[16px] font-semibold text-[#D4D4D4]'>Outstanding Stock</p>
                    <div className='w-[34px] h-[34px] rounded-[3px] bg-[#741E1E] flex justify-center items-center'>
                        <p>d</p>
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
            <div className="w-full  rounded-lg border flex flex-col p-4  justify-between bg-gradient-to-r from-[#4A0606] to-[#7D0C0C]  shadow-lg">
  <div className="flex justify-between items-center">
    <p className="text-[16px] font-semibold text-[#D4D4D4]">
      Main <span className="text-[#DF3232]">Supplier</span>
    </p>
    <div className="w-[34px] h-[34px] rounded-[3px] bg-[#741E1E] flex justify-center items-center">
      <p className="text-white">icon</p>
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
            <div className=" col-span-9 border-2 px-3 py-2 rounded-lg border-[#E9E9E9]">
              <div className="p-3 bg-[#F3F3F3] rounded-lg flex justify-start items-center text-[14px] gap-2 text">
                <p>Overview</p>
                <p>Transaction</p>
              </div>
              <div className="p-2 bg-[#F3F3F3] rounded-lg mt-4">
                <button
                  className="px-4 py-2 rounded-lg w-[185px] text-sm font-semibold bg-BgSubhead text-textColor"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FileSearchIcon color="#303F58" /> Overview
                  </span>
                </button>
              </div>
              <div className="bg-[#FDF8F0] rounded-lg mt-4 px-9 py-9">
                <div className="grid grid-cols-2 gap-y-4">
                  <div className="text-dropdownText font-normal text-sm space-y-4">
                    <p>Item Type</p>
                    <p>SKU</p>
                    <p>Unit</p>
                    <p>Date</p>
                    <p>Returnable</p>
                  </div>
                  <div className="text-dropdownText font-semibold text-sm space-y-4">
                    <p>
                      {selectedItem?.itemType
                        ? selectedItem.itemType.charAt(0).toUpperCase() +
                          selectedItem.itemType.slice(1)
                        : 'N/A'}
                    </p>
                    <p>{selectedItem?.sku || 'N/A'}</p>
                    <p>{selectedItem?.unit || 'N/A'}</p>
                    <p>{selectedItem?.createdDate?.split(' ')[0] || 'N/A'}</p>
                    <p>{selectedItem?.returnableItem ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="font-bold text-base text-textColor mb-2">
                    Purchase Information
                  </p>
                  <div className="grid grid-cols-2 gap-y-4">
                    <p className="text-dropdownText text-sm">Cost Price</p>
                    <p className="text-dropdownText font-semibold text-sm">
                      {orgData?.baseCurrency?.length === 1
                        ? `${orgData.baseCurrency} ${selectedItem?.costPrice || 'N/A'}`
                        : `${selectedItem?.costPrice || 'N/A'} ${orgData?.baseCurrency}`}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="font-bold text-base text-textColor mb-2">
                    Sales Information
                  </p>
                  <div className="grid grid-cols-2 gap-y-4">
                    <p className="text-dropdownText text-sm">Selling Price</p>
                    <p className="text-dropdownText font-semibold text-sm">
                      {orgData?.baseCurrency?.length === 1
                        ? `${orgData.baseCurrency} ${selectedItem?.sellingPrice || 'N/A'}`
                        : `${selectedItem?.sellingPrice || 'N/A'} ${orgData?.baseCurrency}`}
                    </p>
                  </div>
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
  )
}

export default ItemView