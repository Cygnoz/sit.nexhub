import { Link } from "react-router-dom";
import CheveronLeftIcon from "../../../../../../assets/icons/CheveronLeftIcon";
import NewInvoice from "../UploadInvoice/OCRNewInvoice";
import AllInvoiceTable from "./AllInvoiceTable";


const AllInvoiceHome = () => {

  return (
    <div className="">
      <div className="mx-5 my-4 flex items-center relative gap-x-4">
        <Link to={"/purchase/bills"}>
          <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div>
          <h3 className="font-bold text-2xl text-textColor">All Invoice</h3>
        </div>
        <div className="ml-auto gap-3 flex items-center">
          <NewInvoice/>
        </div>
      </div>

      <div className="mx-5 py-4 px-6 bg-white">
        <AllInvoiceTable />
      </div>
    </div>
  );
};

export default AllInvoiceHome;
