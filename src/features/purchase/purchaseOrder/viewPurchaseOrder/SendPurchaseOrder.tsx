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
    navigate(`/purchase/bills/new?id=${data._id}`);};



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
          <Button variant="primary" className="pl-4 pr-4" size="sm"  onClick={openModal}>
            <p className="text-sm font-medium">Mark as Confirmed</p>
          </Button>
        
        </div>
        <Modal open={isModalOpen} onClose={closeModal} style={{ width: "55%" }}>
        <div className="p-5 ">
        
        <div
  className="mb-5 flex items-center justify-center py-3 rounded-xl bg-CreamBg relative overflow-hidden"
  style={{
    backgroundImage: `url(${bgImage})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right center"
  }}
>
  <div className="relative flex flex-col items-center text-center">
    <p className="font-bold text-base mt-2 text-textColor">
      Purchase Order Has Been Marked as Confirmed
    </p>
  </div>
  <div
    className="absolute top-3 right-3 text-3xl cursor-pointer z-10"
    onClick={closeModal}
  >
    <p>&times;</p>
  </div>
</div>

      
          <form>
            <div className="text-center" >
            
            <p className="text-textColor px-2 text-sm">
         Purchase Order Has Been Marked as Confirmed would to like to proceed to bill

         </p>

              <div className="flex justify-center items-center gap-4 my-4">
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