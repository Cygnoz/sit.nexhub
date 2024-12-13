import bgimage from "../../../../assets/Images/Organization-banner.png";
import Button from "../../../../Components/Button";
// import AddAddress from "./AddAddress";

type Props = {}

function Shipments({}: Props) {
  return (
    <div className="p-5">
      <div
        className="w-full h-[148px] bg-cover bg-center rounded-lg"
        style={{ backgroundImage: `url(${bgimage})` }}
      />
      <p className="text-textColor font-bold text-xl mt-4">Shipments</p>
      <div className="mt-4 p-6 rounded-lg bg-white">
        <p className="font-semibold text-dropdownText text-sm mb-3">
          Shipment Notification
        </p>
        <div className="flex items-center">
          <input
            type="checkbox"
            className="accent-[#97998E] bg-white h-5 w-5 mr-2"
            id="customCheckbox"
          />
          <label htmlFor="compositionSchemeCheckbox" className="text-textColor text-sm">
          Do you want to send notifications to customers for carrier shipments?
          </label>
        </div>
        <div className="flex items-center mt-3">
          <input
            type="checkbox"
            id="customCheckbox"
            className="accent-[#97998E] bg-white h-5 w-5 mr-2"
            
          />
          <label htmlFor="compositionScheme" className="text-textColor text-sm">
          Do you want to send notifications to customers for manual shipments?
          </label>
        </div>
      </div>

      {/* <div className="mt-[10px] p-6 rounded-lg bg-white flex items-center justify-between">
        <div>
      <p className="font-semibold text-dropdownText text-sm mb-3">
      Choose Default Dispatch Address
        </p>
        <p className="text-dropdownText text-sm">4517 Washington Ave. Manchester, Kentucky 39495</p>
        </div>
        <div className="flex gap-4">
         <AddAddress/>
        </div>
        </div> */}
        <div className="flex justify-end mt-4">
        <Button size="sm" className="text-sm  pl-10 pr-10">Save</Button>
        </div>
    </div>
  );
}

export default Shipments;
