import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Banner from "../banner/Banner";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";
import Button from "../../../Components/Button";

type Props = {};

function PurchaseOrders({}: Props) {
  const initialPurchaseOrder = {
    purchaseOrderClose: "",
    purchaseTC: "",
    purchaseNote: "",
  };

  const [purchaseOrderData, setPurchaseOrderData] = useState(initialPurchaseOrder);

  const { request: fetchPurchaseOrderSettings } = useApi("get", 5004);
  const { request: savePurchaseOrderSettings } = useApi("put", 5005);

  useEffect(() => {
    const fetchAllSettings = async () => {
      try {
        const url = `${endponits.GET_SETTINGS}`;
        const { response, error } = await fetchPurchaseOrderSettings(url);
        
        if (!error && response) {
          const settings = response.data.purchaseOrderSettings;
          const { purchaseOrderClose, purchaseTC, purchaseNote } = settings;
          setPurchaseOrderData({
            ...purchaseOrderData,
            purchaseOrderClose: purchaseOrderClose || "",
            purchaseTC: purchaseTC || "",
            purchaseNote: purchaseNote || "",
          });
        } else {
          console.error("Error:", error);
        }
      } catch (error) {
        console.error("Error fetching purchase order settings:", error);
      }
    };
  
    fetchAllSettings();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setPurchaseOrderData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRadioChange = (value: string) => {
    setPurchaseOrderData((prevData) => ({
      ...prevData,
      purchaseOrderClose: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const url = `${endponits.ADD_PURCHASE_ORDER_SETTINGS}`;
      const { response, error } = await savePurchaseOrderSettings(url, purchaseOrderData);
      if (!error && response) {
        toast.success("Purchase order settings saved successfully!");
      } else {
        toast.error("Failed to save purchase order settings.");
      }
    } catch (error) {
      console.error("Error saving purchase order settings:", error);
      toast.error("An error occurred while saving the settings.");
    }
  };

  return (
    <div className="p-5">
      <Banner />

      <p className="text-textColor font-bold mt-4 text-xl">Purchase Orders</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {/* Closure Option Radio Buttons */}
          <div className="mt-4 p-6 rounded-lg bg-white">
            <p className="font-bold  text-base text-textColor mb-3">
              When do you want your Purchase Orders to be closed?
            </p>
            <div className="flex flex-col">
              <div className="flex gap-1 items-center mt-3">
                <div
                  onClick={() => handleRadioChange("When a Purchase Receive is recorded")}
                  className="grid place-items-center cursor-pointer"
                >
                  <input
                    id="receiveRadio"
                    type="radio"
                    name="purchaseOrderClose"
                    value="When a Purchase Receive is recorded"
                    checked={purchaseOrderData.purchaseOrderClose === "When a Purchase Receive is recorded"}
                    className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${purchaseOrderData.purchaseOrderClose === "When a Purchase Receive is recorded" ? "border-8 border-neutral-400" : "border-1 border-neutral-400"}`}
                  />
                  <div className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${purchaseOrderData.purchaseOrderClose === "When a Purchase Receive is recorded" ? "bg-neutral-100" : "bg-transparent"}`} />
                </div>
                <label htmlFor="receiveRadio" className="text-slate-600 ms-2">
                  When a Purchase Receive is recorded
                </label>
              </div>
              <div className="flex gap-1 items-center mt-3">
                <div
                  onClick={() => handleRadioChange("When a Bill is created")}
                  className="grid place-items-center cursor-pointer"
                >
                  <input
                    id="billRadio"
                    type="radio"
                    name="purchaseOrderClose"
                    value="When a Bill is created"
                    checked={purchaseOrderData.purchaseOrderClose === "When a Bill is created"}
                    className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${purchaseOrderData.purchaseOrderClose === "When a Bill is created" ? "border-8 border-neutral-400" : "border-1 border-neutral-400"}`}
                  />
                  <div className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${purchaseOrderData.purchaseOrderClose === "When a Bill is created" ? "bg-neutral-100" : "bg-transparent"}`} />
                </div>
                <label htmlFor="billRadio" className="text-slate-600 ms-2">
                  When a Bill is created
                </label>
              </div>
              <div className="flex gap-1 items-center mt-3">
                <div
                  onClick={() => handleRadioChange("When Receives and Bills are recorded")}
                  className="grid place-items-center cursor-pointer"
                >
                  <input
                    id="receiveBillRadio"
                    type="radio"
                    name="purchaseOrderClose"
                    value="When Receives and Bills are recorded"
                    checked={purchaseOrderData.purchaseOrderClose === "When Receives and Bills are recorded"}
                    className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${purchaseOrderData.purchaseOrderClose === "When Receives and Bills are recorded" ? "border-8 border-neutral-400" : "border-1 border-neutral-400"}`}
                  />
                  <div className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${purchaseOrderData.purchaseOrderClose === "When Receives and Bills are recorded" ? "bg-neutral-100" : "bg-transparent"}`} />
                </div>
                <label htmlFor="receiveBillRadio" className="text-slate-600 ms-2">
                  When Receives and Bills are recorded
                </label>
              </div>
            </div>
          </div>

          {/* Terms & Condition */}
          <div className="mt-4 p-6 rounded-lg bg-white">
            <p className="font-bold text-textColor text-sm mb-3">
              Terms & Conditions
            </p>
            <textarea
              name="purchaseTC"
              className="w-full h-36 p-3 border border-inputBorder rounded-lg resize-none"
              value={purchaseOrderData.purchaseTC}
              onChange={handleChange}
            />
          </div>

          {/* Notes */}
          <div className="mt-4 p-6 rounded-lg bg-white">
            <p className="font-bold text-textColor text-sm mb-3">Notes</p>
            <textarea
              name="purchaseNote"
              className="w-full h-36 p-3 border border-inputBorder rounded-lg resize-none"
              value={purchaseOrderData.purchaseNote}
              onChange={handleChange}
            />
          </div>

          {/* Save Button */}
          <div className="mt-4 flex justify-end">
            <Button variant="primary" type="submit" className="pl-10 pr-10 h-[38px] text-sm" size="sm">
              Save
            </Button>
          </div>
        </form>
    </div>
  );
}

export default PurchaseOrders;
