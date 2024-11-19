import Button from "../../../../Components/Button"

const SendPurchaseOrder=()=>{
    return (
        <div className="mt-4 bg-cuscolumnbg p-4 rounded-lg flex justify-between items-center">
        <div>
          <p className="text-base font-bold text-textColor">
            Send Purchase Order
          </p>
          <p className="text-sm font-normal text-dropdownText w-[90%] mt-2">
            Purchase order has been created. You can email the Purchase Order to
            your customer or mark it as Confirmed.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" className="pl-4 pr-4" size="sm">
            <p className="text-sm font-medium">Mark as Confirmed</p>
          </Button>
          <Button className="pl-4 pr-4" size="sm">
            <p className="text-sm font-medium">Send Purchase Order</p>
          </Button>
        </div>
      </div>
    )
}
export default SendPurchaseOrder;