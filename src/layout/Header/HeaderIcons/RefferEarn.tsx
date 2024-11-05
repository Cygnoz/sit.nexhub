import { useState } from "react";
import UserIcon from "../../../assets/icons/UserIcon"
import Drawer from "../../../Components/drawer/drawer";
import Button from "../../../Components/Button";
import twoMenImage from "../../../assets/Images/excited-men-watching-smartphones 1.png"
import frameBgIMage from "../../../assets/Images/Line 8.png"

type Props = {}

function RefferEarn({}: Props) {
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
      setDrawerOpen(!isDrawerOpen);
    };
  
  return (
    <>
    <button onClick={toggleDrawer}>
    <UserIcon />
  </button>

  <Drawer onClose={toggleDrawer} open={isDrawerOpen} position="right">
  <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black opacity-50" onClick={toggleDrawer}></div>
          <div className="relative bg-white w-[444px] h-full shadow-xl">
            <div className="flex items-center justify-between p-5">
              <h5 className="text-lg font-semibold text-gray-700">Refer & earn</h5>
              <button onClick={toggleDrawer} className="text-gray-500 hover:text-gray-700 text-3xl -mt-2">
                &times;
              </button>
            </div>
            <div className="p-4 overflow-y-scroll hide-scrollbar " style={{maxHeight: 'calc(100vh - 100px)'}}>
              <div className="space-y-2  text-center">
                <h3 className="text-lg font-bold text-gray-700 ">Refer a Friend, Enjoy <br />Great Perks!</h3>
                <p className="text-gray-600 text-xs">
                  Invite your friends to join our inventory management platform and earn exclusive rewards for every successful referral. The more you share, the more you earn!
                </p>
                <div className="flex justify-center">
               <Button size="sm"><p className="text-xs">Refer & earn</p></Button>
                </div>
                <div 
  className="relative"
  style={{
    backgroundImage: `url(${frameBgIMage})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  }}
>
  <img src={twoMenImage} alt="" className="mx-auto" style={{objectFit: "cover"}} />
</div>

                <div className="text-left">
                  <h4 className="text-md text-center font-semibold mt-6">How does it work?</h4>
                  <p className="text-gray-600 text-center text-xs mt-1">
                  Invite your friends to join our inventory management platform and earn exclusive rewards for every successful referral. The more you share, the more you earn!
                </p><br />
                  <ol className="list-decimal ml-5 text-sm text-gray-700 space-y-2">
                    <li>
                      <strong>How do I refer a friend?</strong> <br /><span className='text-xs'> You can refer a friend by sharing your unique referral link, which you can find in the “Refer a Friend” section of your account dashboard.</span>
                    </li>
                    <li>
                      <strong>What does my friend need to do for me to earn rewards?</strong><span className='text-xs'> Your friend needs to sign up for our inventory management software using your unique referral link.</span>
                    </li>
                    <li>
                      <strong>What kind of rewards can I earn?</strong> <br /><span className='text-xs'> Rewards can vary, but they typically include discounts on your subscription, free months of service, gift cards, or other special offers.</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
  </Drawer>
  </>
  )
}

export default RefferEarn