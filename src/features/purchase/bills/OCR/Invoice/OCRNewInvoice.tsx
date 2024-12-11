import React, { useState } from "react";
import Button from "../../../../../Components/Button";
import PlusCircle from "../../../../../assets/icons/PlusCircle";
import Modal from "../../../../../Components/model/Modal";
import UploadFile from "../../../../../assets/icons/UploadFile";
import bgImage from "../../../../../assets/Images/6.png";

const OCRNewInvoice = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const openModal = () => setModalOpen(true);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedFile(null); // Reset the file on modal close
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div>
      <Button variant="primary" size="sm" onClick={openModal}>
        <PlusCircle color="white" />
        <p className="text-sm">Add Invoice</p>
      </Button>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        className="w-[45%]"
        aria-labelledby="upload-invoice-title"
      >
        <div className="p-5 mt-3">
          {/* Modal Header */}
          <div className="mb-5 flex py-3 px-5 rounded-xl bg-CreamBg relative overflow-hidden">
            <div
              className="absolute top-0 -right-8 w-[30%] h-[80px] object-fit"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className="relative z-10">
              <h3
                id="upload-invoice-title"
                className="text-xl mt-1 font-bold text-textColor"
              >
                Upload Invoice
              </h3>
            </div>
            <div
              className="ms-auto text-3xl cursor-pointer relative z-10"
              onClick={closeModal}
              aria-label="Close Modal"
              role="button"
            >
              &times;
            </div>
          </div>

          <div
            className="border border-dashed border-[#1849D6] py-7 flex items-center justify-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="flex flex-col justify-center items-center text-[#0B0B0B] space-y-2 h-full w-full text-sm">
              <UploadFile />
              {selectedFile ? (
                <p className="text-center font-medium">{selectedFile.name}</p>
              ) : (
                <p className="text-center">
                  Drag your file(s) to start uploading
                </p>
              )}
              <div className="flex items-center justify-center gap-x-2 text-sm text-[#6D6D6D]">
                <div className="border h-0 w-[80px] border-[#E7E7E7]"></div>
                <span>OR</span>
                <div className="border h-0 w-[80px] border-[#E7E7E7]"></div>
              </div>

              {/* File Input */}
              <div
                className="border border-[#565148] rounded-lg py-2 px-4 cursor-pointer"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                Browse Files
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          <p className="text-[#6D6D6D] text-sm my-4">Support PDF, PNG, JPG</p>

          <div className="flex justify-end gap-2 mb-3 text-sm">
            <Button
              onClick={closeModal}
              className="px-10"
              variant="secondary"
              size="sm"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="px-10" size="sm">
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OCRNewInvoice;
