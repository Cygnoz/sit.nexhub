import  { useRef, useState } from "react";
import { Link } from "react-router-dom";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import Upload from "../../../assets/icons/Upload";
import Button from "../../../Components/Button";
import ExpenseFilterCards from "./ExpenseFilterCards";
import CehvronDown from "../../../assets/icons/CehvronDown";
import AddExpenseTable from "./AddExpenseTable";

type Props = {};

function AddExpensePage({}: Props) {
  const [selectedSection, setSelectedSection] = useState<"expense" | "mileage" | null>(null);

  const handleRecordClick = (section: "expense" | "mileage") => {
    setSelectedSection(section);
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
 

  return (
    <div className="bg-white mx-7">
      <div className="flex gap-5 items-center mb-4">
        <Link to={"/expense/home"}>
          <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <h4 className="font-bold text-xl text-textColor">Add Expense</h4>
      </div>
      <div className="px-3 mb-4">
  <label className="block mb-1">
    <div className="w-3/4 mx-2 border-dashed border-2 border-neutral-700 p-4 rounded gap-2 text-center mt-2">
      <div className="flex gap-1 justify-center">
        <Upload />
        <span>Upload Your Receipt</span>
      </div>
      <p className="text-xs mt-1 text-gray-600">
        Maximum file size allowed is 5MB
      </p>
      <div className="mt-2 flex justify-center">
        <Button onClick={handleButtonClick}>Upload Your Files</Button>
      </div>
    </div>
    <input
      type="file"
      ref={fileInputRef}
      className="hidden"
      name="documents"
    />
  </label>
</div>


      <ExpenseFilterCards onSelectSection={handleRecordClick} />

      {selectedSection === "expense" && (
  <div className="grid grid-cols-3 gap-4 mt-5 mx-4">
    <div className="col-span-1">
      <label className="text-sm mb-1 text-labelColor">Date</label>
      <div className="relative w-full">
        <input
          type="text"
          className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          placeholder="Select Date"
        />
      </div>
    </div>

    <div className="col-span-1">
      <label className="text-sm mb-1 text-labelColor">Employee</label>
      <div className="relative w-full">
        <input
          type="text"
          className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
          placeholder="Select an employee"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <CehvronDown color="gray" />
        </div>
      </div>
    </div>

    <div className="col-span-1">
      <label className="text-sm mb-1 text-labelColor">Paid Through</label>
      <div className="relative w-full">
        <input
          type="text"
          className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
          placeholder="Select an Account"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <CehvronDown color="gray" />
        </div>
      </div>
    </div>

    {/* New Fields */}
    <div className="col-span-1">
      <label className="text-sm mb-1 text-labelColor">Vendor </label>
      <div className="relative w-full">
        <input
          type="text"
          className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
          placeholder="Select Vendor"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <CehvronDown color="gray" />
        </div>
      </div>
    </div>

    <div className="col-span-1">
      <label className="text-sm mb-1 text-labelColor">Invoice #</label>
      <div className="relative w-full">
        <input
          type="number"
          className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
          placeholder="Vendor"
        />
      </div>
    </div>

    {/* AddExpenseTable Component */}
    <div className="col-span-3">
      <AddExpenseTable />
    </div>
  </div>
)}


{selectedSection === "mileage" && (
  <div className="grid grid-cols-3 gap-4 mt-5 mx-4">
    <div className="col-span-1">
      <label className="text-sm mb-1 text-labelColor">Date</label>
      <div className="relative w-full">
        <input
          type="text"
          className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          placeholder="Select Date"
        />
      </div>
    </div>

    <div className="col-span-1">
      <label className="text-sm mb-1 text-labelColor">Employee</label>
      <div className="relative w-full">
        <input
          type="text"
          className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          placeholder="Select an Account"
        />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <CehvronDown color="gray" />
              </div>
      </div>
    </div>

    <div className="col-span-1">
      <label className="text-sm mb-1 text-labelColor">Paid Through</label>
      <div className="relative w-full">
        <input
          type="text"
          className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          placeholder="Select an Account"
        />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <CehvronDown color="gray" />
              </div>
      </div>
    </div>

    {/* Distance and Rate per km Fields */}
    <div className="col-span-3 flex gap-4">
  <div className="flex-1">
    <label className="text-sm mb-1 text-labelColor">Distance</label>
    <div className="relative w-full flex items-center">
      <input
        type="number"
        className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        placeholder="Length"
      />
      <span className="absolute right-2 text-zinc-400">|KM</span>
    </div>
  </div>

  <div className="flex-1">
  <label className="text-sm mb-1 text-labelColor">Rate per km</label>
  <div className="relative w-full flex items-center">
    <span className="absolute left-2 text-zinc-400">INR|</span>
    <input
      type="number"
      className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-10 pr-2 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      placeholder="0.00"
    />
  </div>
</div>

</div>


    <div className="col-span-1">
      <label className="text-sm mb-1 text-labelColor">Amount</label>
      <div className="relative w-full flex items-center">
      <span className="absolute left-2 text-zinc-400">INR|</span>
        <input
          type="number"
          className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
         
        />
      </div>
    </div>
    

    <div className="col-span-1">
      <label className="text-sm mb-1 text-labelColor">Vendor</label>
      <div className="relative w-full">
        <input
          type="text"
          className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          placeholder="Select Vendor"
        />
           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <CehvronDown color="gray" />
              </div>
      </div>
    </div>

    <div className="col-span-1">
      <label className="text-sm mb-1 text-labelColor">Invoice#</label>
      <div className="relative w-full">
        <input
          type="text"
          className="appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          placeholder="Value"
        />
      </div>
    </div>

    <div className="col-span-2">
      <label className="block text-sm text-labelColor">Notes</label>
      <textarea
        className="mt-1 w-full border border-inputBorder rounded-md text-sm p-2 h-20"
        placeholder="Select a Tax"
      />
     
    </div>
  </div>
)}



      
      <div className="flex justify-end gap-2 mb-3">
                <Button  variant="secondary" size="lg">
                  Cancel
                </Button>

                <Button type="submit" variant="primary" size="lg">
                  Save
                </Button>
              </div>
    </div>
    
    
  );
}

export default AddExpensePage;
