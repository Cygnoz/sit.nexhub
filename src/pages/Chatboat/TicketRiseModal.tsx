import { useEffect, useState } from "react";
import Button from "../../Components/Button";
import Modal from "../../Components/model/Modal";
import { endponits } from "../../Services/apiEndpoints";
import useApi from "../../Hooks/useApi";
import toast, { Toaster } from "react-hot-toast";

type Props = {
  setTicketId:any
    organization:any
};

function TicketRiseModal({ setTicketId,organization}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
    setFormData((prev)=>({
        ...prev,
        subject:'',
        description:''
      }))
  };
  const {request:riseTicket}=useApi('post',3004)
  const [formData,setFormData]=useState({
    requester:'',
    subject:'',
    description:''
  })

  
  
  

  
  // const { request: getOneOrganization } = useApi("get", 5004);
  // useEffect(() => {
  //   const fetchOrganization = async () => {
  //     try {
  //       const url = `${endponits.GET_ONE_ORGANIZATION}`;
  //       const apiResponse: any = await getOneOrganization(url);
  //       console.log("api", apiResponse);
  
  //       setFormData((prev) => ({
  //         ...prev, // Correct spread syntax
  //         requester: apiResponse.response.data.primaryContactEmail,
  //       }));
  //     } catch (error: any) {
  //       const errorMessage = error.response?.data?.message || "Error fetching organization data";
  //       toast.error(errorMessage);
  //     }
  //   };
  
  //   fetchOrganization();
  // }, [formData]); // Add dependencies if needed
  const handleSubmit=async()=>{
    const {description,subject}=formData
   if(description || subject){
    try{
        const {response,error}=await riseTicket(endponits.UNASSIGNED_TICKET,formData)
        console.log("res",response);
        console.log("err",error);
        if(response && !error){
            toast.success(response.data.message)
            handleModalToggle()
            setTicketId(response.data.ticketId)
        }else{
          toast.error(error.response.data.message)

        }
    }catch(err){
        console.log(err);
    }
   }else{
    toast("Please fill the description or subject")
   }
  }
  useEffect(()=>{
    setFormData((prev) => ({
    ...prev, // Correct spread syntax
    requester: organization?.primaryContactEmail,
    }));
  },[organization])

  // console.log("org",organization);
  

  // console.log("form",formData);
  
  return (
    <>
      <Button
        onClick={handleModalToggle}
        className="ms-auto"
        variant="fourthiary"
        size="sm"
      >
        <p className="text-[12px]">Connect with Agent {">"}</p>
      </Button>
      <Modal open={isModalOpen} onClose={handleModalToggle} className="w-[38%]">
        <div className="p-3 space-y-4">
          <div className="flex justify-between items-center ">
            <h3 className="text-xl font-bold text-textColor">
              Rise Your Ticket
            </h3>
            <div
              className="ms-auto text-3xl text-black cursor-pointer "
              onClick={handleModalToggle}
            >
              &times;
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1 text-labelColor">
              Subject
            </label>
            <input
              type="text"
              name="accountName"
              value={formData.subject}
                onChange={(e)=>setFormData((prev) => ({
                    ...prev, // Correct spread syntax
                    subject:e.target.value,
                  }))}
              placeholder="Enter the subject"
              className="border-inputBorder text-black w-full text-sm border rounded p-1.5 pl-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-labelColor">
              Description
            </label>
            <input
              type="text"
              name="accountName"
              value={formData.description}
              onChange={(e)=>setFormData((prev) => ({
                ...prev, // Correct spread syntax
                description:e.target.value,
              }))}
              placeholder="Enter the desciption"
              className="border-inputBorder text-black w-full text-sm border rounded p-1.5 pl-2"
            />
          </div>
          <div className="flex justify-end gap-2 mb-3">
            <Button
              onClick={handleModalToggle}
              className="pl-10 pr-10"
              variant="secondary"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={handleSubmit}
              className="pl-10 pr-10"
              size="sm"
            >
              Send
            </Button>
          </div>
        </div>
      </Modal>
      <Toaster reverseOrder={false} />
    </>
  );
}

export default TicketRiseModal;
