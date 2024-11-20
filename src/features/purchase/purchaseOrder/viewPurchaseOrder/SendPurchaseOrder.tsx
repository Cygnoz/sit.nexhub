import { useState } from "react";
import Button from "../../../../Components/Button"
import Modal from "../../../../Components/model/Modal";
import bgImage from "../../../../assets/Images/Frame 6.png";
import { useNavigate } from "react-router-dom";

type Props = { data?: any };



const SendPurchaseOrder=({data}:Props)=>{
    const [isModalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const openModal = () => {
      setModalOpen(true);
    };
  
    const closeModal = () => {
      setModalOpen(false);
    };


  const handleRowClick = () => {
    navigate(`/purchase/bills/new?id=${data._id}`);  };



    return (
        <div className="mt-4 bg-cuscolumnbg p-4 rounded-lg flex justify-between items-center">
        <div>
          <p className="text-base font-bold text-textColor">
            Send Purchase Order
          </p>
          <p className="text-sm font-normal text-dropdownText w-[90%] mt-2">
            Purchase order has been created. You can email the Purchase Order to
            your customer or mark it as Confirmed.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" className="pl-4 pr-4" size="sm"  onClick={openModal}>
            <p className="text-sm font-medium">Mark as Confirmed</p>
          </Button>
        
        </div>
        <Modal open={isModalOpen} onClose={closeModal} style={{ width: "55%" }}>
        <div className="p-5 mt-3 text-center">
          <div className="mb-5 flex py-3 px-3 rounded-xl bg-CreamBg relative overflow-hidden">
            <div
              className="absolute top-0 -right-8 w-[178px] h-[70px]"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className=" flex items-center justify-center">
              <p className="font-bold text-base mt-2 text-center text-textColor">
               Purchase Order Has Been Marked as Confirmed
              </p>
            </div>
            <div
              className="ms-auto text-3xl cursor-pointer  z-10"
              onClick={closeModal}
            >
              &times;
            </div>
          </div>
      
          <form>
            <div >
            
            <p className="text-textColor px-2 text-sm">
         Purchase Order Has Been Marked as Confirmed would to like to proceed to bill

         </p>

              <div className="flex justify-center items-center gap-2 my-3">
                  <Button variant="primary" size="sm" className="px-3" onClick={handleRowClick}>
                    Yes
                </Button>
                <Button onClick={closeModal} variant="secondary" className="px-3"  size="sm">
                  No
                </Button>
              
              </div>
            </div>
          </form>
        </div>
      </Modal>


      </div>
    )
}
export default SendPurchaseOrder;