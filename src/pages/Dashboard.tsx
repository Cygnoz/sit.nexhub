import { useEffect, useState } from "react"
import Button from "../Components/Button"
import bannerBg from "../assets/Images/Banner-bg.png"
import happyWoman from "../assets/Images/Businesswoman happy about profit growth.png"
import Cards from "../features/dashboard/Cards"
import ExpenseByCategory from "../features/dashboard/ExpenseByCategory"
import SalesOverTime from "../features/dashboard/SalesOverTime"
import TopCustomers from "../features/dashboard/TopCustomers"
import TopSellingProducts from "../features/dashboard/TopSellingProducts"
import useApi from "../Hooks/useApi"
import { endponits } from "../Services/apiEndpoints"
import MonthYearDropdown from "../Components/dropdown/MonthYearDropdown"

type Props = {}

function Dashboard({ }: Props) {

const currentDate = new Date();
  const [month, setMonth] = useState(String(currentDate.getMonth() + 1).padStart(2, "0")); // Current month (zero-based index)
  const [year, setYear] = useState(currentDate.getFullYear()); // Current year
    const [cardData,setCardData] = useState<any>()
    const {request:getOverView}=useApi('get',5004)
    const { request: getTopCustomers } = useApi("get", 5004);
        const [customerData, setCustomerData] = useState<any>();
     const getMainOverView=async()=>{
        try{
            const {response,error}=await getOverView(`${endponits.MAIN_DASH_OVERVIEW}?date=${year}/${month}`)
            if(response&&!error){
                setCardData(response.data)
                console.log("res",response.data);
                
            }else{
                console.log("err",error);
            }
        }catch(error){
            console.log("er",error);
        }
      }
    
      useEffect(()=>{
        if(month||year){
            getMainOverView()
            getTopCus();
        }
      },[month,year])
      
      
        const getTopCus = async () => {
          try {
            const { response, error } = await getTopCustomers(
              `${endponits.MAIN_DASH_TOP_PRODUCT_CUSTOMER}?date=${year}/${month}`
            );
            if (response && !error) {
              console.log("top", response.data);
              
              // Transform API response into required forma
      
              setCustomerData(response.data);
            } else {
              console.log("err", error);
            }
          } catch (error) {
            console.log("er", error);
          }
        };
      
       
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
      <div className="flex items-center mb-4 justify-between relative mt-4">
        <p className=" text-[#454545] font-bold text-xl">Overview</p>
        <MonthYearDropdown setMonth={setMonth} year={year} setYear={setYear} month={month}/>
      </div>
      <Cards data={cardData}/>
<br />
      <div className="grid grid-cols-10 gap-5">
          <div className="col-span-6 flex justify-center">
            <SalesOverTime  date={`${year}/${month}`}/>
          </div>
          <div className="col-span-4 flex justify-center">
            <ExpenseByCategory date={`${year}/${month}`}/>
          </div>
          <div className="col-span-5 flex justify-center">
            <TopSellingProducts topSellingData={customerData?.topProducts} />
          </div>
          <div className="col-span-5 flex justify-center">
            <TopCustomers topCustomerData={customerData?.topCustomers}/>
          </div>
        </div>

    </div>
  )
}

export default Dashboard