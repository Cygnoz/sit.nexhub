import ArrowRight from '../../assets/icons/ArrowRight'
import ArrowrightUp from '../../assets/icons/ArrowrightUp'
import Globe from '../../assets/icons/Globe'
import Home from '../../assets/icons/home'
import LightBulb from '../../assets/icons/LightBulb'
import PlusCircle from '../../assets/icons/PlusCircle'
import RecieptIndianRupee from '../../assets/icons/RecieptIndianRupee'
import SearchIcon from '../../assets/icons/SearchIcon'
import Vegan from '../../assets/icons/Vegan'
import LandingHeader from '../LandingPage/LandingHeader'
import group from '../../assets/Images/Group.png'
import sleep from '../../assets/Images/sleep_3430674 1.png'
import mechineLearning from '../../assets/Images/machine-learning_13063295 1.png'
import passport from '../../assets/Images/passport_5219226 1.png'
import droidBilly from '../../assets/Images/droidBilly.png'
// import Mic from '../../assets/icons/Mic'
import SaImage from '../../assets/Images/SAImage.png'
import CygnozLogo from '../../assets/Images/CygnozLogo.png'
import SAFormModal from './TicketRiseModal'
import { useEffect, useRef, useState } from 'react'
import OrganizationIcon from '../../assets/icons/OrganizationIcon'
import io, { Socket } from "socket.io-client";
const CLIENT_SOCKET_URL = import.meta.env.VITE_REACT_APP_TICKETS
import { useOrganization } from '../../context/OrganizationContext'
import { endponits } from '../../Services/apiEndpoints'
import useApi from '../../Hooks/useApi'



type Props = {}



function AgentChat({}: Props) {
   const [ticketId,setTicketId]=useState(null)      //Room Id
     const [socket, setSocket] = useState<Socket | null>(null);
   const [message, setMessage] = useState("");
   const {request:getChatHistory}=useApi('get',3004)
   const textareaRef:any = useRef(null);
 

   const [messages, setMessages] = useState<any[]>([]);
     const chatBoxRef:any = useRef(null);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);
  useEffect(() => {
    const newSocket = io(CLIENT_SOCKET_URL);
    setSocket(newSocket);

    newSocket.emit("joinRoom", ticketId);

    newSocket.on("chatHistory", (chatHistory: any) => {
      setMessages(chatHistory);
    });

    newSocket.on("newMessage", (newMessage:any) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [ticketId]);
  const {organization}=useOrganization()
  console.log("org",organization);
  
  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && message.length>0 && socket) {
      const messageBody={
        ticketId,
        senderId:organization?.primaryContactEmail,
        receiverId:messages[0].senderId,
        message,
      }
      console.log("messageBody",messageBody);
      
      socket.emit("sendMessage",messageBody );
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "19px"; // Reset height to auto
 
      }
    }
  };

  console.log("messages",messages);
  


  const getChatHis=async()=>{
    try{
      const {response,error}=await getChatHistory(`${endponits.CHAT_HISTORY}/${ticketId}`)
      if(response && !error){
       setMessages(response.data?.data?.reverse())
      }
    }catch(err){
      console.log("er",err);
      
    }
  }
  
  useEffect(()=>{
    getChatHis()
  },[ticketId])
  
  console.log("messages",messages);
  
  
  // console.log("senderId",organization?.primaryContactEmail);
  // console.log("ticketId",socket from ticketId from agent Component);
  // console.log("receverID",socket from receiverId that ticketId agent Component);
  // console.log("msg",messages);
  const handleInput = (e:any) => {
    const textarea = e.target;
    textarea.style.height = "auto"; // Reset the height
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight); // Get the line height
    const maxHeight = lineHeight * 4; // Max height for 3 rows
    const minHeight = lineHeight * 1; // Min height for 1 row
  
    // Set the new height within bounds
    textarea.style.height = `${Math.min(
      Math.max(textarea.scrollHeight, minHeight),
      maxHeight
    )}px`;
  
    setMessage(textarea.value);
  };
  const handleKeyDown = (e:any) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents adding a new line
      sendMessage(e); // Manually trigger the form submission
    }
  };
  return (
    <>
    <div className={`bg-[#1A2023] text-white overflow-y-hidden h-screen  p-10`}>
    <LandingHeader/>
    <div className='grid grid-cols-12'>
    <div className='col-span-3 p-2 flex flex-col space-y-4'>
  <div className='flex gap-2'>
    <div className='bg-[#262D30] rounded-full flex justify-center items-center w-12 h-11'>
      <Home color='#FFFEFB' size={20} />
    </div>
    <div className='bg-[#262D30] w-full h-11 rounded-[30px] py-3 px-4 flex justify-between items-center'>
      <p>New Chat</p>
      <PlusCircle size={17} />
    </div>
  </div>
  <div className='bg-[#404B52] h-11 w-full relative rounded-full flex items-center px-4'>
    <div className='absolute -left-1 top-[13px]'><SearchIcon  /></div>
    <input
      type='text'
      className='bg-transparent ms-2 w-full h-full text-white px-2 focus:outline-none'
      placeholder='Search'
    />
  </div>
  {/* Recent Search  */}
  <div className='flex flex-col space-y-4'>
  <p className='text-[16px] font-medium'>Recent Search</p>
  <div className='bg-[#262D30] h-[58px] w-full relative rounded-full flex justify-between items-center p-3'>
    <div className='bg-[#D0EDFF] rounded-full w-[38px] h-[38px] flex justify-center items-center'>
        <Vegan/>
    </div>
    <p className='text-[14px]'>Tips for a balanced diet on a...</p>
    <ArrowRight color='white' size={20} stroke={2}/>
  </div>
  <div className='bg-[#262D30] h-[58px] w-full relative rounded-full flex justify-between items-center p-3'>
    <div className='bg-[#D0EDFF] rounded-full w-[38px] h-[38px] flex justify-center items-center'>
        <Globe size={20} color='#303F58'/>
    </div>
    <p className='text-[14px]'>Tips for optimizing website s...</p>
    <ArrowRight color='white' size={20} stroke={2}/>
  </div>
  <div className='bg-[#262D30] h-[58px] w-full relative rounded-full flex justify-between items-center p-3'>
    <div className='bg-[#D0EDFF] rounded-full w-[38px] h-[38px] flex justify-center items-center'>
    <LightBulb color='#303F58' size={20}/>
    </div>
    <p className='text-[14px]'>How to prepare for a tech int...</p>
    <ArrowRight color='white' size={20} stroke={2}/>
  </div>
  <div className='bg-[#262D30] h-[58px] w-full relative rounded-full flex justify-between items-center p-3'>
    <div className='bg-[#D0EDFF] rounded-full w-[38px] h-[38px] flex justify-center items-center'>
        <RecieptIndianRupee  color='#303F58' size={20}/>
    </div>
    <p className='text-[14px]'>Beginner-friendly investment..</p>
    <ArrowRight color='white' size={20} stroke={2}/>
  </div>
  <div className='bg-[#262D30] h-[58px] w-full relative rounded-full flex justify-between items-center p-3'>
    <div className='bg-[#D0EDFF] rounded-full w-[38px] h-[38px] flex justify-center items-center'>
        <ArrowrightUp color='#303F58' size={20}/>
    </div>
    <p className='text-[14px]'>Ways to develop a growth m...</p>
    <ArrowRight color='white' size={20} stroke={2}/>
  </div>
  </div>
</div>
        <div className='col-span-6  px-2 flex flex-col justify-between'>
        <div ref={chatBoxRef} className="space-y-2  h-[69vh] scroll-smooth  overflow-auto hide-scrollbar">
        <div className='flex flex-col space-y-1  items-start w-full mb-2'>
         <img src={droidBilly} className='w-6 h-7 rounded-full' alt="" />
         <div className='w-fit'>
         <div className="bg-[#262D30] w-fit px-4 mb-2 ms-4 py-2 rounded-tl-none rounded-2xl text-sm ">
          <p >I can't answer your message</p>
          </div> 
          {!ticketId&&<SAFormModal organization={organization} setTicketId={setTicketId}/>}
         </div>
         </div>
         
          {
            ticketId&&messages.length==0&&
            <p className='ms-4 text-xs'>Our agent will connect you,wait a minute....</p>
          }
        
  {messages.map((msg) => (
    <div
      key={msg.ticketId}
      className={`flex flex-col space-y-1 w-full mb-2 ${
        msg.senderId.role === 'Customer' ? "items-end" : "items-start"
      }`}
    >
      { msg.senderId.role !== 'Customer' ? (
        <img
          src={SaImage} // Replace with actual sender logo if available
          className="w-7 h-7 rounded-full shadow-lg bg-white "
          alt="Sender"
        />
      ):
      <OrganizationIcon/>
      }
     <div
  className={`${
    msg.senderId.role === "Customer"
      ? "bg-[#59BEFD] text-white rounded-tr-none"
      : "bg-[#262D30] text-white rounded-tl-none"
  } w-fit max-w-full px-4 py-2 rounded-2xl text-sm ${
    msg.senderId.role === "Customer" ? "me-3 ms-8" : "ms-4 me-8"
  }`}
>
  <p
   
    className="break-words"
    style={{
      overflowWrap: "break-word", // Break long words to the next line
      wordBreak: "break-word",   // Additional support for word breaking
      maxWidth: "100%",          // Ensures content stays within container
    }}
  >{msg?.message}</p>
</div>

    </div>
  ))}
</div>

 
     <form onSubmit={sendMessage} className="flex items-center justify-between space-x-2 w-full mt-2  bg-[#262D30] p-3 rounded-full">
         
         <img src={CygnozLogo} className='w-[22px]' alt="" />
         
        
         <textarea
         ref={textareaRef}
  value={message}
  onChange={(e) =>handleInput(e)}
  onKeyDown={handleKeyDown}
           className="bg-gray-700 text-white bg-[#262D30] w-full text-sm focus:outline-none resize-none hide-scrollbar"
           placeholder="Type Something..."
           rows={1}
         />
         <div className='flex space-x-2 items-center'>
           {/* <Mic/> */}
         <button type='submit' className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-[#69ACD6]  to-[#2A3075]"><ArrowRight stroke={2} color='white' size={20}/></button>
         </div>
       </form>
        </div>
        <div className='col-span-3 ps-3'>
            <p className='font-bold mb-4'>Suggestions</p>
            <div className='grid grid-cols-2 gap-4 '>
                <div className='w-[160px]  bg-[#262D30] rounded-2xl p-4 space-y-4'>
                    <div className='w-[48px] h-[48px] bg-[#333A3D] rounded-full flex items-center justify-center'>
                      <img src={group} alt="" />
                    </div>
                    <p className='text-sm'>Summary of your past sales performance</p>
                </div>
                <div className='w-[160px]  bg-[#262D30] rounded-2xl p-4 space-y-4'>
                <div className='w-[48px] h-[48px] bg-[#333A3D] rounded-full flex items-center justify-center'>
                      <img src={mechineLearning} alt="" />
                    </div>
                    <p className='text-sm'>Overview of your current sales performance</p>
                </div>
                <div className='w-[160px]  bg-[#262D30] rounded-2xl p-4 space-y-4'>
                <div className='w-[48px] h-[48px] bg-[#333A3D] rounded-full flex items-center justify-center'>
                      <img src={sleep} alt="" />
                    </div>
                    <p className='text-sm'>Forecast your sales for the upcoming quarter</p>
                </div>
                <div className='w-[160px]  bg-[#262D30] rounded-2xl p-4 space-y-4'>
                <div className='w-[48px] h-[48px] bg-[#333A3D] rounded-full flex items-center justify-center'>
                      <img src={mechineLearning} alt="" />
                    </div>
                    <p className='text-sm'>Tips to improve customer satisfaction</p>
                </div>
                <div className='w-[160px]  bg-[#262D30] rounded-2xl p-4 space-y-4'>
                <div className='w-[48px] h-[48px] bg-[#333A3D] rounded-full flex items-center justify-center'>
                      <img src={passport} alt="" />
                    </div>
                    <p className='text-sm'>Reducing your business costs</p>
                </div>
                <div className='w-[160px]  bg-[#262D30] rounded-2xl p-4 space-y-4'>
                <div className='w-[48px] h-[48px] bg-[#333A3D] rounded-full flex items-center justify-center'>
                      <img src={sleep} alt="" />
                    </div>
                    <p className='text-sm'>Analyze repeat purchase rate</p>
                </div>
            </div>
        </div>
    </div>
    </div>
    
    </>
  )
}

export default AgentChat