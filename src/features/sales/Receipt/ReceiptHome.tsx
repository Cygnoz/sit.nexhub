import Button from "../../../Components/Button";
import PlusCircle from "../../../assets/icons/PlusCircle";
import Ellipsis from "../../../assets/icons/Ellipsis";
import BookIcon from "../../../assets/icons/BookIcon";
import { Link } from "react-router-dom";
import SalesTable from "../commonComponents/SalesTable";

type Props = {};

const ReceiptHome = ({ }: Props) => {
  return (
    <div className="mx-5 my-4">
      <div className="flex">
        <div>
          <h1>Receipt</h1>
          <p className="text-textColor text-sm">
            Showing the payment details. Verifies transaction details for record
            keeping puposes.
          </p>
        </div>
        <div className="ml-auto flex items-center justify-center gap-4">
          <Link to="/sales/receipt/new">
            <Button variant="primary" size="sm">
              <PlusCircle color={"white"} />
              New Receipt
            </Button>
          </Link>
          <Ellipsis />
        </div>

      </div>

      <div className="bg-white rounded-lg p-4 space-y-4 mt-6">
        <div className="flex gap-4">
          <div className="flex items-center justify-center bg-[#E3E6D5] text-sm  rounded-[4px] h-9 w-48 ">
            <BookIcon color={"#585953"} />
            All
          </div>
          <div className="flex-shrink-0 py-1 gap-3 text-darkRed text-sm font-semibold border
           border-slate-300 rounded-[4px] w-48 flex items-center justify-center">
            <PlusCircle color="darkRed" />
            New Custom View
          </div>
        </div>
        {/* table */}
        <SalesTable page="reciept" />
      </div>
    </div>
  );
};

export default ReceiptHome;