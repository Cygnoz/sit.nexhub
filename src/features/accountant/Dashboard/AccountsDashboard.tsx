import AccountPayableAging from './AccountPayableAging'
import AccountReceivableAging from './AccountReceivableAging'
import AvaragePurchase from './AvaragePurchase'
import Cards from './Cards'
import TotalRevenue from './TotalRevenue'
type Props = {}


function AccountsDashboard({}: Props) {
  
  return (

    <>
    <div className='mx-5 space-y-8 text-[#303F58]'>
    <div className=" flex  items-center relative">
          <div>
            <h3 className="font-bold text-xl text-textColor ">Accountant Overview</h3>
            <p className="text-sm text-gray mt-1">
            Provides a comprehensive summary of financial accounts. It serves a vital tool for monitoring financial performace
            </p>
          </div>
        </div>
    
        <Cards />

        <div className="grid grid-cols-10 gap-5">
          <div className="col-span-6 flex justify-center">
          <TotalRevenue />
          </div>
          <div className="col-span-4 flex justify-center">
          <AccountReceivableAging />
          </div>
          <div className="col-span-6 flex justify-center">
          <AccountPayableAging />
          </div>
          <div className="col-span-4 flex justify-center">
          <AvaragePurchase />
          </div>
        </div>
      </div>

      </>
  );
}

export default AccountsDashboard;
