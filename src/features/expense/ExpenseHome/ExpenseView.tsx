import { Link, useParams } from "react-router-dom";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import Button from "../../../Components/Button";
import Pen from "../../../assets/icons/Pen";
import PrinterIcon from "../../../assets/icons/PrinterIcon";
import CircleDollerSign from "../../../assets/icons/CircleDollerSign";
import { useEffect, useState } from "react";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";


type Props = {};

const ExpenseView = ({}: Props) => {

  const [expense,setExpense]=useState<any| []>([])
  const {request :getExpense}=useApi("get",5008)
  const  {id}=useParams()

  const historyData = [
    {
      date: "30/05/2024",
      time: "02:30 PM",
      title: "Expense Created",
      amount: "2000",
    },
    {
      date: "30/05/2024",
      time: "02:30 PM",
      title: "Expense Created",
      amount: "2000",
    },
    {
      date: "30/05/2024",
      time: "02:30 PM",
      title: "Expense Created",
      amount: "2000",
    },
  ];


  const getExpenses = async () => {
    try {
      const url = `${endponits.GET_A_EXPENSE}/${id}`;
      const { response, error } = await getExpense(url);
  
      if (!error && response) {
        setExpense(response.data)
        console.log(response.data, "response");
     
  
      }
      else{

      }
    } catch (error) {
      console.log("Error in fetching expense", error);
    }
  };

  useEffect(()=>{
getExpenses()
  },[])

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
           {/* {expense?.expense[0]?.expenseAccount ? expense?.expense[0]?.expenseAccount:  " "}<span className="font-light px-3"> |</span>{" "} */}
            Materials
          </p>
        </div>
        <div className="flex ml-auto gap-4">
          <Button variant="secondary" size="sm">
            <Pen color="currentColor" />
            Edit
          </Button>
          <Button variant="secondary" size="sm">
            <PrinterIcon color="currentColor" height={20} width={20} />
            Print
          </Button>
        </div>
      </div>
      <p className="text-base font-semibold text-dropdownText">
        <span className="me-4">Expense Date:</span> {expense?.expenseDate}
      </p>

      <div className="grid grid-cols-12 text-textColor gap-4">
       

<div className="col-span-7">
  <div className="bg-gradient-to-r from-[#E3E6D5] to-[#F7E7CE] h-[77px] flex items-center px-5">

    <p className="font-bold">{expense.grandTotal} <span className="font-semibold ">| Expense Amount </span> </p>

  </div>
  <div className="grid grid-cols-2 mt-5 space-y-5 justify-beteween border-b">
  <div>
    <p className=" text-currentColor">Paid Through</p>
    <p className="font-bold text-textColor">{expense.paidThrough}</p>
  </div>

  <div>
    <p className=" text-currentColor -mt-4">Tax</p>
    {expense?.expense?.map((item:any, index:any) => (
  <p className="font-bold text-textColor" key={index}>{item?.taxGroup || 'N/A'}</p>
))}
  </div>

  <div>
    <p className=" text-currentColor">Tax Amount</p>
    <p className="font-bold text-textColor">{expense.grandTotal}</p>
  </div>

  <div>
    <p className=" text-currentColor">Paid To</p>
    <p className="font-bold text-textColor">{expense.supplierDisplayName}</p>
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
    <p className="font-bold text-textColor">{expense.sourceOfSupply}</p>
  </div>

  <div>
    <p className=" text-currentColor">Destination of Supply</p>
    <p className="font-bold text-textColor">{expense.destinationOfSupply}</p>
  </div>
</div>

</div>


        <div className="col-span-4 bg-[#F6F6F6] py-6 px-4">
          <p className="text-lg font-bold text-textColor">
            Expense History
          </p>
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
        </div>
      </div>
    </div>
  );
};

export default ExpenseView;
