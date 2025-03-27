import PrinterIcon from "../assets/icons/PrinterIcon";
import Button from "./Button";
const PrintButton = () => {

  return (
    <Button variant="secondary" className="text-xs h-[33.47px]">  <PrinterIcon color="#0099F8" height={16} width={16} /> <p className="text-sm font-medium">Print</p></Button>

  );
};

export default PrintButton;
