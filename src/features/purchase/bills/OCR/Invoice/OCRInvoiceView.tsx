import { Link } from "react-router-dom";
import CheveronLeftIcon from "../../../../../assets/icons/CheveronLeftIcon";
import OCRNewInvoice from "./OCRNewInvoice";
import pdf from "../../../../../assets/Images/image.png"


const OCRInvoiceView = () => {
  return (
    <>
      <div className="mx-5 my-4 flex items-center relative gap-x-4 ">
        <Link to={"/purchase/bills/invoice"}>
          <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div>
          <h3 className="font-bold text-2xl text-textColor">All Invoice</h3>
        </div>
        <div className="ml-auto gap-3 flex items-center">
          <OCRNewInvoice />
        </div>
      </div>
      <div className="bg-white rounded-lg grid grid-cols-12 gap-4 mx-5 p-5">
        <div className="col-span-7 rounded-lg ">
          <div className="h-10 bg-[#E5E5E5] rounded-t-lg text-xs font-bold text-[#4B5C79] flex items-center px-4">
            <p>INV-001.png</p>
          </div>
          <div className=" flex items-center justify-center mt-2 ">
            <img src={pdf} alt="" className="max-w-2xl" />
          </div>

          <div>
            <img src="" alt="" />
          </div>
        </div>
        <div className="col-span-5"> 
        <div className="h-10 bg-[#E5E5E5] rounded-t-lg text-xs font-bold text-[#4B5C79] flex items-center px-4">
            <p>Field</p>
          </div>        </div>
      </div>
    </>
  );
};

export default OCRInvoiceView;
