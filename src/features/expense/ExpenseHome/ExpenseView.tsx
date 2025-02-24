import { Link, useNavigate, useParams } from "react-router-dom";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import Button from "../../../Components/Button";
import Pen from "../../../assets/icons/Pen";
import PrinterIcon from "../../../assets/icons/PrinterIcon";
import { useEffect, useState } from "react";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import { useOrganization } from "../../../context/OrganizationContext";
import Journal from "../../purchase/bills/ViewBill/Jornal";
import ConfirmModal from "../../../Components/ConfirmModal";
import toast from "react-hot-toast";
import Trash2 from "../../../assets/icons/Trash2";

type Props = {};

const ExpenseView = ({}: Props) => {
  const [expense, setExpense] = useState<any | []>([]);
  const [expensedata,setExpenseData]=useState<any |[]>([])
  const { request: getExpense } = useApi("get", 5008);
  const [Currency,setCurrency]=useState<any>([])
  const {organization}=useOrganization()
  const { id } = useParams();
  const navigate = useNavigate();
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const { request: deleteExpense } = useApi("delete", 5008);
  const { request: getCurrencies } = useApi("get", 5004);


  const confirmDelete = () => {
    setConfirmModalOpen(true);
  };

  const getExpenses = async () => {
    try {
      const url = `${endponits.GET_A_EXPENSE}/${id}`;
      const { response, error } = await getExpense(url);

      if (!error && response) {
        setExpense(response.data);
        setExpenseData(response.data.expense)
      } else {
      }
    } catch (error) {
      console.log("Error in fetching expense", error);
    }
  };
  const getCurrency = async () => {
    try {
      const url = `${endponits.GET_CURRENCIES}`;
      const { response, error } = await getCurrencies(url);
  
      if (!error && response) {
        const currencies = response.data;
        const baseCurrency = currencies.find((currency:any) => currency.baseCurrency) || currencies[0]; // Default to first if no base currency
        setCurrency(baseCurrency);
        console.log(baseCurrency, "Base Currency Set");
      }
    } catch (error) {
      console.log("Error in fetching currencies", error);
    }
  };
  

  const handleEditClick = (id: any) => {
    navigate(`/expense/edit-expense/${id}`)
  }


  const handleDelete = async () => {
    if (!id) return;
    try {
      const url = `${endponits.DELETE_EXPENSE}/${id}`;
      const { response, error } = await deleteExpense(url);
      if (!error && response) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/expense/home");
        }, 1000);
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      toast.error("Error occurred while deleting.");
    } finally {
      setConfirmModalOpen(false);
    }
  };
  

  useEffect(() => {
    getExpenses();
    getCurrency()
  }, []);

  return (
    <div className="mx-5 my-4 rounded-lg bg-white p-6 space-y-3">
      <div className="flex items-center gap-5">
        <Link to={"/expense/home"}>
          <div
            style={{ borderRadius: "50%" }}
            className="w-[40px] h-[40px] flex items-center justify-center bg-backButton"
          >
            <CheveronLeftIcon />
          </div>
        </Link>
        <p className="text-textColor text-xl font-bold">View Expense</p>
      </div>

      <div className="flex border-b py-3 border-slate-400">
        <div className="text-textColor text-lg font-semibold ">
          <p>
          Expense <span className="font-light px-3"> |</span> {expense?.expenseNumber}{" "}
            
          </p>
        </div>
        <div className="flex ml-auto gap-4">
            <Button variant="secondary" size="sm" onClick={() => handleEditClick(id)}>
              <Pen color="currentColor" />
              Edit
            </Button>
            <Button variant="secondary" size="sm" onClick={() => confirmDelete()}>
              <Trash2 color="currentColor" size={16} />
              Delete
            </Button>
          <Button variant="secondary" size="sm">
            <PrinterIcon color="currentColor" height={16} width={16} />
            Print
          </Button>
        </div>
      </div>
      <p className="text-base font-semibold text-dropdownText">
        <span className="me-4">Expense Date:</span> {expense?.expenseDate}
      </p>

      <div className=" text-textColor gap-4 px-5 pt-3">
        <div className="">
          <div className="bg-gradient-to-r from-[#E3E6D5] to-[#F7E7CE] h-[77px] flex items-center px-5">
            <p className="font-bold">
             {Currency?.currencySymbol} {expense.grandTotal}{" "}
              <span className="font-semibold ">| Expense Amount </span>{" "}
            </p>
          </div>
          <div className="grid grid-cols-2 mt-5 space-y-5 justify-beteween border-b border-gray-400 py-4 ">
            <div>
              <p className=" text-currentColor">Paid Through</p>
              <p className="font-bold text-textColor">{expense.paidThroughAccountName}</p>
            </div>

            <div>
              <p className=" font-bold text-textColor -mt-4">Tax</p>
              {expensedata[0]?.igstAmount>0? `IGST[${expensedata[0]?.igst}%]`: `SGST[${expensedata[0]?.sgst}%] CGST[${expensedata[0]?.cgst}%]`}
            </div>

            <div>
              <p className=" text-currentColor">Tax Amount</p>
              <p className="font-bold text-textColor">{organization?.baseCurrency} {expense.grandTotal} {expense.amountIs=="Tax Inclusive"? "(Inclusive)":"(Exclusive)"}</p>
            </div>

            <div>
              <p className=" text-currentColor">Paid To</p>
              <p className="font-bold text-textColor">
                {expense.supplierDisplayName}
              </p>
            </div>

            <div>
              <p className=" text-currentColor">GST Treatment</p>
              <p className="font-bold text-textColor">{expense.gstTreatment}</p>
            </div>

            <div>
              <p className=" text-currentColor">GST / UIN</p>
              <p className="font-bold text-textColor">{expense.gstin}</p>
            </div>

            <div>
              <p className=" text-currentColor">Source of Supply</p>
              <p className="font-bold text-textColor">
                {expense.sourceOfSupply}
              </p>
            </div>

            <div>
              <p className=" text-currentColor">Destination of Supply</p>
              <p className="font-bold text-textColor">
                {expense.destinationOfSupply}
              </p>
            </div>
          </div>

<Journal page="Expense"/>
        </div>

        {/* <div className="col-span-4 bg-[#F6F6F6] py-6 px-4">
          <p className="text-lg font-bold text-textColor">Expense History</p>
          <div className="relative ms-5 my-6">
            {historyData.map((item, index) => (
              <div key={index} className="flex my-10 gap-5">
                <div className="relative">
                  {index !== historyData.length - 1 && (
                    <div className="absolute  left-1/2 transform -translate-x-1/2 h-[130%] w-px bg-slate-300"></div>
                  )}
                  <div className="bg-darkRed h-10 w-10 rounded-full relative items-center justify-center flex">
                    <CircleDollerSign />
                  </div>
                </div>
                <div className=" space-y-2 w-full ">
                  <div className="flex gap-8">
                    <p>{item.date}</p>
                    <p> {item.time}</p>
                  </div>

                  <p className="font-bold text-lg">{item.title}</p>
                  <div className="">
                    <p>Expense Created for &#8377; {item.amount}</p>
                    <div className="flex gap-5">
                      <p className="font-bold">By Info</p>
                      <p className="font-bold border-b-2">View Details</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
       <ConfirmModal
        open={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete?"
      />
    </div>
  );
};

export default ExpenseView;
