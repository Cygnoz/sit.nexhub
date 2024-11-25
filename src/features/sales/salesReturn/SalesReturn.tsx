import {useNavigate } from "react-router-dom"
import Button from "../../../Components/Button"
import PlusCircle from "../../../assets/icons/PlusCircle"
import ChevronRight from "../../../assets/icons/ChevronRight"
import SalesTable from "../commonComponents/SalesTable"

type Props = {}
const SalesReturn = ({}: Props) => {
    const Navigate = useNavigate();

  return (
    <div className="mx-5 my-4  text-[#303F58] overflow-x-hidden">
    <div className="flex items-center relative">
    <div>
      <h3 className="font-bold text-2xl text-textColor">
        Sales Return
      </h3>
      <p className="text-sm text-gray mt-1">
        Process of a cutomer returning purchased goods to seller
      </p>
    </div>
    <div className="ml-auto gap-3 flex items-center relative">
      <Button
        onClick={() => Navigate("/sales/newsalesreturn")}
        variant="secondary"
        size="sm"
      >
        
        <p className="text-sm">Create New</p>
        <PlusCircle color="#565148" />
      </Button>
      <Button
        onClick={() => Navigate("/sales/salesorder")}
        variant="primary"
        size="sm"
      >
        <p className="text-sm">Go to sales Order</p>
        <ChevronRight color="white" />
      </Button>
    </div>
  </div>
  <div className="bg-white p-5 rounded-lg space-y-4 mt-4">
      <SalesTable
      page="salesReturn"
      />
       
      </div>
  </div>
  )
}

export default SalesReturn