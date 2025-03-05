import Button from "../Components/Button"
import bannerBg from "../assets/Images/Banner-bg.png"
import happyWoman from "../assets/Images/Businesswoman happy about profit growth.png"
import Cards from "../features/dashboard/Cards"
import ExpenseByCategory from "../features/dashboard/ExpenseByCategory"
import SalesOverTime from "../features/dashboard/SalesOverTime"
import TopCustomers from "../features/dashboard/TopCustomers"
import TopSellingProducts from "../features/dashboard/TopSellingProducts"

type Props = {}

function Dashboard({ }: Props) {


  return (
    <div className="mx-6 my-4 h-[100vh]">
      <div
        className="relative rounded-lg p-9 flex justify-between items-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerBg})` }}
      >
        <div className="absolute top-2 right-5 text-3xl font-light">
          &times;
        </div>
        <div>
          <p className="text-[#263238] font-bold text-xl">Get Ready to Unlock Predictive Maintenance Insights!</p>
          <p className="mt-1 text-[#272727] w-[70%] text-base">Anticipate maintenance needs before issues arise,
            optimizing uptime and reducing unexpected costs</p>
        </div>
        <Button className="h-9 pl-4 pr-4 me-[20%]">
          Explore Now
        </Button>
        <img src={happyWoman} className="w-48 right-16 object-cover absolute" alt="" />
        <div>

        </div>
      </div>
      <div className="flex items-center mb-4 justify-between relative">
        <p className="mt-6 text-[#454545] font-semibold">Overview</p>
        <div className="mt-3">
          <select name="" id="" className="border border-outlineButton rounded-lg p-2 text-outlineButton text-sm font-medium">
            <option value="">Select Month</option>
          </select>
        </div>
      </div>
      <Cards/>
<br />
      <div className="grid grid-cols-10 gap-5">
          <div className="col-span-6 flex justify-center">
            <SalesOverTime />
          </div>
          <div className="col-span-4 flex justify-center">
            <ExpenseByCategory/>
          </div>
          <div className="col-span-5 flex justify-center">
            <TopSellingProducts/>
          </div>
          <div className="col-span-5 flex justify-center">
            <TopCustomers/>
          </div>
        </div>

    </div>
  )
}

export default Dashboard