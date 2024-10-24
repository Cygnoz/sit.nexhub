import MailIcon from "../../../../assets/icons/MailIcon";
import EditCustomerModal from "../EditCustomerModal";
import Button from "../../../../Components/Button";
import CustomerHistory from "../CustomerHistory";
import Vector from "../../../../assets/icons/Vector";
import PhoneIcon from "../../../../assets/icons/PhoneIcon";

const Overview = ({
  customerData,
  statusData,
  customerId,
  handleStatusSubmit,
}: {
  customerData: any;
  statusData: any;
  customerId: string;
  handleStatusSubmit: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <div>
      <div className="space-y-3 w-[100%] text-sm border-[1px] border-[#DADBDD] rounded-md p-4">
        <div className="flex items-center">
          <p className="font-bold text-textColor border-e pe-5 border-e-textColor">
            <span className="font-medium"> Customer Name: </span>
            {customerData?.customerDisplayName}
          </p>
          <p className="font-bold text-textColor px-5 border-e pe-5 border-e-textColor">
            <span className="font-medium"> Company Name: </span>
            {customerData.companyName}
          </p>

          <div className="w-[33.6%] ml-auto">
            <div
              className={`w-fit px-2 flex justify-center rounded-md text-xs text-white p-0.5 -ms-2 ${
                statusData.status === "Active" ? "bg-[#78AA86]" : "bg-zinc-400"
              }`}
            >
              {statusData.status}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="flex items-center gap-2 text-textColor pe-5 border-e-[.2px] border-e-textColor">
            <MailIcon color={"#303F58"} />
            <p> {customerData.customerEmail}</p>
          </div>
          <div className="flex items-center gap-2 text-textColor px-5">
            <PhoneIcon color={"#303F58"} size={18} />
            <p> {customerData.mobile}</p>
          </div>
          <div className="ml-auto w-[40%] gap-2 flex">
            <EditCustomerModal customerDataPorps={customerData} />
            <select
              className="text-[10px] h-6 ps-2 bg-white border-blk rounded-md border text-textColor border-textColor"
              value={statusData.status}
              name="status"
              onChange={handleStatusSubmit} // handle status change here
            >
              <option value="" className="disabled hidden"></option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-[1px] border-[#DADBDD] rounded-md p-2 mt-2">
        <div className="grid grid-cols-3 gap-4 text-sm text-textColor">
          <div className="bg-[#F3F3F3] p-2 rounded-lg">
            <div className="flex w-full p-2">
              <p className="font-bold">Billing Address</p>
              <div className="ml-auto">
                <EditCustomerModal
                  addressEdit="billingAddressEdit"
                  customerDataPorps={customerData}
                />
              </div>
            </div>
            <div className="text-xs p-2">
              <p>{customerData.billingAttention}</p>
              <p>
                {customerData.billingAddressLine1}, {customerData.billingAddressLine2}
              </p>
              <p>{customerData.billingCity}</p>
              <p>Pin: {customerData.billingPinCode}</p>
              <p>{customerData.billingCountry}</p>
              <p>Phone: {customerData.billingPhone}</p>
            </div>
          </div>

          <div className="bg-[#F3F3F3] p-2 rounded-lg">
            <div className="flex w-full p-2">
              <p className="font-bold">Shipping Address</p>
              <div className="ml-auto">
                <EditCustomerModal
                  addressEdit="shippingAddressEdit"
                  customerDataPorps={customerData}
                />
              </div>
            </div>
            <div className="text-xs p-2">
              <p>{customerData.shippingAttention}</p>
              <p>
                {customerData.shippingAddress1}, {customerData.shippingAddress2}
              </p>
              <p>{customerData.shippingCity}</p>
              <p>Pin: {customerData.shippingPinCode}</p>
              <p>{customerData.shippingCountry}</p>
              <p>Phone: {customerData.shippingPhone}</p>
            </div>
          </div>

          <div className="pe-8 p-2">
            <p className="font-bold m-2">Other Details</p>
            <div className="space-y-2 text-xs p-2">
              <div className="flex text-textColor">
                <p>Customer Type</p>
                <p className="ml-auto font-semibold">
                  {customerData.customerType}
                </p>
              </div>
              <div className="flex text-textColor">
                <p>Default Currency</p>
                <p className="ml-auto font-semibold">
                  {customerData.currency}
                </p>
              </div>
              <div className="flex text-textColor">
                <p>Payment Terms</p>
                <p className="ml-auto font-semibold">
                  {customerData.paymentTerms}
                </p>
              </div>
              <div className="flex text-textColor">
                <p>Portal Language</p>
                <p className="ml-auto font-semibold">English</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-end">
          <Button variant="secondary" className="h-3 text-xs">
            <Vector />
            <CustomerHistory id={customerId} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
