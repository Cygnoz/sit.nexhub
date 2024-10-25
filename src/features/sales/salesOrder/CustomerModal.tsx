import React from 'react';

type Props = {
  onClose: () => void;
};

const CustomerModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">
      <div className="w-80 h-full bg-white shadow-lg flex flex-col">
        <button 
          className="self-end p-2 text-gray-500 hover:text-gray-700" 
          onClick={onClose}
        >
          &times;
        </button>
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Customer Details Heading</h2>
        </div>
        <div className="flex-grow overflow-y-auto p-4">
          <div className="border p-4 mb-4">
            <div className="mb-2">Name, Image</div>
            <div className="mb-2">Address</div>
            <div className="mb-2">Card no</div>
            <div className="mb-2">Total sale bill</div>
            <div className="mb-2">Balance</div>
            <div className="border p-2 mt-4">
              <div className="mb-2">Revenue</div>
              <div className="mb-2">Sales</div>
              <div className="mb-2">Order</div>
              <div className="mb-2">Edit button</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;
