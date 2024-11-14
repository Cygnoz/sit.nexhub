import { useState } from "react";
import Eye from "../../../../assets/icons/Eye";
import Modal from "../../../../Components/model/Modal";
import bgImage from "../../../../assets/Images/14.png";
import Button from "../../../../Components/Button";

type TaxGst = {
  _id: string;
  taxName: string;
  taxRate: string;
  cgst: string;
  sgst: string;
  igst: string;
};

type Props = {
  taxRate: TaxGst | null;
};

function ViewTaxDetails({ taxRate }: Props) {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <div onClick={openModal}>
        <Eye color="#6F685D" />
      </div>

      <Modal open={isModalOpen} onClose={closeModal} className="w-[45.4%] px-8 py-6">
        <div className="mb-5 flex p-4 rounded-xl bg-CreamBg relative overflow-hidden">
          <div
            className="absolute top-0 -right-8 w-[178px] h-[89px]"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="text-start">
            <h3 className="text-xl font-bold text-textColor">View Tax</h3>
            <p className="text-dropdownText font-semibold text-sm mt-2">
            Details of the selected Tax.
            </p>
          </div>
          <div
            className="ms-auto text-3xl text-textColor font-light cursor-pointer relative z-10"
            onClick={closeModal}
          >
            &times;
          </div>
        </div>
        {taxRate && (
          <div className="p-6 flex rounded-lg text-start bg-[#F3F3F3] mt-6">
         <div className="w-[20%] text-sm text-dropdownText">
            <p>Tax Name</p>
            <p className="mt-2">Rate (%)</p>
            <p className="mt-2">CGST</p>
            <p className="mt-2">SGST</p>
            <p className="mt-2">IGST</p>
         </div>
         <div className="text-base  font-bold text-textColor">
            <p>{taxRate.taxName}</p>
            <p className="mt-0.5">{taxRate.taxRate}</p>
            <p className="mt-0.5">{taxRate.cgst}</p>
            <p className="mt-1">{taxRate.sgst}</p>
            <p className="mt-1">{taxRate.igst}</p>
         </div>
          </div>
        )}
        <div className="flex justify-end items-center mt-6 gap-2">
          <Button
            variant="secondary"
            onClick={closeModal}
            className="pl-10 pr-10 h-[38px]"
            size="sm"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="pl-10 pr-10 h-[38px]"
            size="sm"
          >
            Save
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default ViewTaxDetails;
