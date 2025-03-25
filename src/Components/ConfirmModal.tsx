import React from "react";
import Modal from "./model/Modal";
import Button from "./Button";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({ open, onClose, onConfirm, message }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="rounded-lg p-8 w-[90%] sm:w-[546px] sm:h-[160px] text-[#303F58] space-y-8"
    >
      <p className="text-sm">{message}</p>
      <div className="flex justify-end gap-2 mb-3">
        <Button
          onClick={onClose}
          variant="secondary"
          className="pl-8 pr-8 text-sm h-10"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="primary"
          className="pl-8 pr-8 text-sm h-10"
        >
          Ok
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
