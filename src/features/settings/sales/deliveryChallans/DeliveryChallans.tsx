import { ChangeEvent, useContext, useEffect, useState } from "react";
import Button from "../../../../Components/Button";
import bgimage from "../../../../assets/Images/Organization-banner.png";
import useApi from "../../../../Hooks/useApi";
import toast from "react-hot-toast";
import { endponits } from "../../../../Services/apiEndpoints";
import { settingsdataResponseContext } from "../../../../context/ContextShare";

type Props = {};

interface DeliveryChallan {
  deliveryChellanTC: string;
  deliveryChellanCN: string;
}

function DeliveryChallans({}: Props) {
  const { request: addDeliveryChallan } = useApi("put", 7007);
  const {settingsResponse, getSettingsData } = useContext(settingsdataResponseContext)!;
  const [inputData, setInputData] = useState<DeliveryChallan>({
    deliveryChellanTC: "",
    deliveryChellanCN: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveDeliveryChallan = async () => {
    try {
      const url = `${endponits.ADD_SALES_DELIVARY_CHALLANS}`;
      const apiResponse = await addDeliveryChallan(url, inputData);
      console.log(apiResponse);
      const { response, error } = apiResponse;
      if (!error && response) {
        toast.success("Delivery Challan saved successfully!");
      } else {
        toast.error("Failed to save Delivery Challan.");
      }
    } catch (error) {
      console.log(error, "Error in saving Delivery Challan");
      toast.error("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    getSettingsData();
  }, []); 
  
  useEffect(() => {
    if (settingsResponse) {
      setInputData((prevData) => ({
        ...prevData,
        ...settingsResponse?.data?.deliveryChellans,
      }));
    }
  }, [settingsResponse]);
  console.log(settingsResponse?.data);

  return (
    <div className="p-5">
      <div
        className="w-full h-[148px] bg-cover bg-center rounded-lg"
        style={{ backgroundImage: `url(${bgimage})` }}
      />

      <p className="text-textColor font-bold text-xl mt-4">Delivery Challans</p>

      <div className="mt-4 p-6 rounded-lg bg-white">
        <p className="font-bold text-textColor text-sm mb-3">
          Terms & Conditions
        </p>
        <textarea
          name="deliveryChellanTC"
          value={inputData.deliveryChellanTC}
          onChange={handleInputChange}
          className="w-full h-32 p-3 border border-inputBorder rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#7E0D0B]"
        />
      </div>

      <div className="mt-4 p-6 rounded-lg bg-white">
        <p className="font-bold text-textColor text-sm mb-3">Customer Notes</p>
        <textarea
          name="deliveryChellanCN"
          value={inputData.deliveryChellanCN}
          onChange={handleInputChange}
          className="w-full h-32 p-3 border border-inputBorder rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#7E0D0B]"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          size="sm"
          className="text-sm  pl-10 pr-10"
          onClick={handleSaveDeliveryChallan}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default DeliveryChallans;
