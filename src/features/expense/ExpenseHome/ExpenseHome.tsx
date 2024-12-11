import { useState } from "react";
import Category from "../../inventory/Category/CategoryModal";
import AddExpenseModal from "./AddExpenseModal";
// import Button from "../../../Components/Button";
// import CirclePlus from "../../../assets/icons/circleplus";
import ExpenseTable from "./ExpenseTable";
import AddExpenseCategory from "./AddExpenseCategory";

type Props = {};

const ExpenseHome = ({}: Props) => {
  const [openCategoryModal, setOpenCategoryModal] = useState(false);

  const toggleCategoryModal = () => {
    setOpenCategoryModal(!openCategoryModal);
  };
  
  return (
    <div className="mx-6 my-4 text-textColor space-y-5">
      <div className="flex">
        <div>
        <h3 className="font-bold text-2xl text-textColor">Expense</h3>
        <p className="text-sm text-gray mt-1">
        Gain a clear understanding of your financial outflows with the Expense Overview section.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-4">
           <AddExpenseCategory/>
          <AddExpenseModal />
        </div>
      </div>
    

      <div className="bg-white p-3 rounded-lg">
        <ExpenseTable />
      </div>
      <Category isOpen={openCategoryModal} onClose={toggleCategoryModal} page="expense"/>
    </div>
  );
};

export default ExpenseHome;
