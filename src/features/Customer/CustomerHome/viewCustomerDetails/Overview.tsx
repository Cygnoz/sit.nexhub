import MailIcon from "../../../../assets/icons/MailIcon";
import EditCustomerModal from "../EditCustomerModal";
import PhoneIcon from "../../../../assets/icons/PhoneIcon";
import CustomerStatusHistory from "./CustomerStatusHistory";
import OtherDetails from "./ViewMore/OtherDetails";
import Factory from "../../../../assets/icons/Factory";



const Overview = ({
  customerData,
  statusData,
  customerId,
  handleStatusSubmit
}: {
  customerData: any;
  statusData: any;
  customerId: string;
  handleStatusSubmit: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (


    <div>


      <div className="rounded-md p-2 mt-2">
        <div className="grid grid-cols-4 gap-4 text-sm text-textColor">
          <div className="space-y-3  text-sm border-[1px] border-[#DADBDD]   bg-[#F9F9F9]  rounded-md p-4">
            <div className="flex items-center">
              <div className="flex justify-between w-full">
                <div className="flex flex-1">
                  <img
                    src={customerData.customerProfile ? customerData.customerProfile : "https://i.postimg.cc/MHh2tQ41/avatar-3814049-1280.webp"}
                    alt="Profile"
                    className="w-8 h-8 object-cover rounded-full mr-3"
                  />
                  <p className="font-bold text-[#820000] mt-1 pe-5">
                    {customerData?.customerDisplayName}
                  </p>
                </div>
                <div className="flex flex-1 justify-end">
                  <select
                    className="text-[10px] h-6 bg-white border-blk rounded-md border text-textColor border-textColor"
                    value={statusData.status}
                    name="status"
                    onChange={handleStatusSubmit}
                  >
                    <option value="" className="disabled hidden"></option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center gap-2 text-textColor">
                <MailIcon color={"#303F58"} />
                <p> {customerData.customerEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-textColor ">
              <PhoneIcon color={"#303F58"} size={18} />
              <p> {customerData.mobile}</p>
            </div>
            <div className="flex ">
              
              <p className="font-bold text-textColor">
                Opening Balance {customerData.debitOpeningBalance ?
                  `(Db) : ${customerData.debitOpeningBalance}` :
                  customerData.creditOpeningBalance ?
                    `(Cr) : ${customerData.creditOpeningBalance}` :
                    "N/A"}
              </p>

            </div>

            <div className="flex justify-between">
              {customerData.companyName &&
                <p className="font-bold text-textColor  flex gap-1">
                  <Factory color={"#303F58"} width={14}/>
                  {customerData.companyName}
                </p>}
              <div
                className={`w-fit  flex justify-center rounded-md text-xs text-white py-0.5 px-1  ${statusData.status === "Active" ? "bg-[#78AA86]" : "bg-zinc-400"
                  }`}
              >
                {statusData.status}
              </div>
            </div>
          </div>

          <div className="bg-[#FEFBF8] p-2 rounded-lg border-[1px] border-[#DADBDD] ">
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
              {customerData.billingAttention ||
                customerData.billingAddressLine1 ||
                customerData.billingAddressLine2 ||
                customerData.billingCity ||
                customerData.billingPinCode ||
                customerData.billingCountry ||
                customerData.billingPhone ? (
                <>
                  {customerData.billingAttention && <p>{customerData.billingAttention}</p>}
                  {customerData.billingAddressLine1 && (
                    <p>{customerData.billingAddressLine1}, {customerData.billingAddressLine2}</p>
                  )}
                  {customerData.billingCity && <p>{customerData.billingCity}</p>}
                  {customerData.billingPinCode && <p>Pin: {customerData.billingPinCode}</p>}
                  {customerData.billingCountry && customerData.billingState && <p>{customerData.billingState},{customerData.billingCountry}</p>}
                  {customerData.billingPhone && <p>Phone: {customerData.billingPhone}</p>}
                </>
              ) : (
                <p>No billing address available.</p>
              )}
            </div>
          </div>

          <div className="bg-[#FCFFED] p-2 rounded-lg border-[1px] border-[#DADBDD] ">
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
              {customerData.shippingAttention ||
                customerData.shippingAddress1 ||
                customerData.shippingAddress2 ||
                customerData.shippingCity ||
                customerData.shippingPinCode ||
                customerData.shippingCountry ||
                customerData.shippingPhone ? (
                <>
                  {customerData.shippingAttention && <p>{customerData.shippingAttention}</p>}
                  {customerData.shippingAddress1 && (
                    <p>{customerData.shippingAddress1}{customerData.shippingAddress2 ? `, ${customerData.shippingAddress2}` : ''}</p>
                  )}
                  {customerData.shippingCity && <p>{customerData.shippingCity}</p>}
                  {customerData.shippingPinCode && <p>Pin: {customerData.shippingPinCode}</p>}
                  {customerData.shippingCountry && customerData.shippingState && <p>{customerData.shippingState}, {customerData.shippingCountry}</p>}
                  {customerData.shippingPhone && <p>Phone: {customerData.shippingPhone}</p>}
                </>
              ) : (
                <p>No shipping address available.</p>
              )}
            </div>
          </div>


          <div className="pe-8 p-2 bg-[#F6F6F6] rounded-lg border-[1px] border-[#DADBDD] ">
            <p className="font-bold m-2">Other Details</p>
            <div className="space-y-2 text-xs p-2">
              <div className="flex text-textColor">
                <p>Customer Type</p>
                <p className="ml-auto font-semibold">
                  {customerData.customerType ? customerData.customerType : "-"}
                </p>
              </div>
              <div className="flex text-textColor">
                <p>Default Currency</p>
                <p className="ml-auto font-semibold">
                  {customerData.currency ? customerData.currency : "-"}
                </p>
              </div>
              <div className="flex text-textColor">
                <p>Payment Terms</p>
                <p className="ml-auto font-semibold">
                  {customerData.paymentTerms ? customerData.paymentTerms : "-"}
                </p>
              </div>
              <div className="flex text-textColor">
                <p>Portal Language</p>
                <p className="ml-auto font-semibold">English</p>
              </div>
              <div className="text-end">
                <OtherDetails />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <CustomerStatusHistory id={customerId} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
