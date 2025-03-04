import Cards from './Cards'
import RecentTransactions from './RecentTransactions';
import SalesOverTime from './SalesOverTime';
import TopSalesByCustomer from './TopSalesByCustomer';
import TopSalesOrder from './TopSalesOrder';
type Props = {}

function SalesDashboard({ }: Props) {

  return (

    <>
      <div className='mx-5 space-y-8 text-[#303F58]'>
        <div className=" flex  items-center relative">
          <div>
            <h3 className="font-bold text-xl text-textColor ">Sales Overview</h3>
            <p className="text-sm text-gray mt-1">
              A sales overview is a summary of our business’s sales performance
            </p>
          </div>
        </div>
        {/* Cards */}
        <Cards />

        <div className="grid grid-cols-10 gap-5">
          <div className="col-span-6 flex justify-center">
            <SalesOverTime />
          </div>
          <div className="col-span-4 flex justify-center">
            <TopSalesOrder />
          </div>
          <div className="col-span-5 flex justify-center">
            <TopSalesByCustomer />
          </div>
          <div className="col-span-5 flex justify-center">
            <RecentTransactions />
          </div>
        </div>

      </div>

    </>
  );
}

export default SalesDashboard;
