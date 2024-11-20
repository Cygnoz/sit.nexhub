import { Link } from "react-router-dom"
import CheveronLeftIcon from "../../assets/icons/CheveronLeftIcon"
import Calender from "../../assets/icons/Calender"
import CehvronDown from "../../assets/icons/CehvronDown"
import PlusCircle from "../../assets/icons/PlusCircle"
import Button from "../../Components/Button"

type Props = {}

function ProfitAndLoss({}: Props) {
  return (
    <div className="flex items-center mx-5 my-4">
    <div className="flex justify-center items-center"> 
    <Link to={"/reports"}>
      <div className="flex justify-center items-center h-11 w-11 bg-[#F3F3F3] rounded-full">
        <CheveronLeftIcon />
      </div>
    </Link>
      <h3 className="font-bold text-xl ms-4 text-textColor">Profit And Loss</h3>
    </div>
    <div className="ml-auto gap-3 flex items-center">
      <div className="flex text-dropdownText gap-4">
        <div className="relative border-2 text-[#818894] border-slate-200 flex rounded-md px-2 py-1 text-sm items-center">
          <div className="pointer-events-none inset-y-0 flex items-center px-2 text-gray-700">
            <Calender color="currentColor" height={18} width={18} />
          </div>
          Select From Date
          <div className="pointer-events-none inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <CehvronDown color="gray" />
          </div>
        </div>
        <div className="relative border-2 text-[#818894]  border-slate-200 flex rounded-md px-2 py-1 text-sm items-center">
          Select To Date
          <div className="pointer-events-none inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <CehvronDown color="gray" />
          </div>
        </div>
        <div className="ml-auto flex items-center">
          <Button className="text-xs pt-1 pb-1 pl-3 pr-3" size="sm">
            Export <span> <CehvronDown color="white" /></span>
          </Button>
        </div>
      </div>
      <PlusCircle color="white" />
    </div>
  </div>
  )
}

export default ProfitAndLoss