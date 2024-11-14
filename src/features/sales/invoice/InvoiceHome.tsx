import PlusCircle from "../../../assets/icons/PlusCircle";
import Button from "../../../Components/Button";
import { Link } from "react-router-dom";
import QuoteTable from "../quote/QuoteTable";


type Props = {};

const InvoiceHome = ({}: Props) => {
  



  return (
    <div className="mx-5 my-4 h-[100vh]">
      <div className="flex mb-8">
        <div>
        <h3 className="font-bold text-2xl text-textColor">Invoice</h3>
        <p className="text-sm text-gray mt-1">
        Invoice Lorem ipsum dolor sit amet consectetur. Commodo enim odio
            fringilla egestas consectetur amet.
          </p>
        </div>
        <div className="ml-auto flex items-center justify-center gap-4">
          <Link to={"/sales/invoice/new"}>
          <Button size="sm">
            <PlusCircle color="white" />
            <p className="text-sm">New Invoice</p>
          </Button>
          </Link>
        
        </div>
      </div>

      {/* filter tabs */}
      <div className="bg-white p-5 rounded-lg space-y-4">
      <QuoteTable
      page="invoice"
      />
       
      </div>
    </div>
  );
};

export default InvoiceHome;
