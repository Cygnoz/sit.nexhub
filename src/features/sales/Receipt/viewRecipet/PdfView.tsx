import { useEffect, useState } from "react";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import { ToWords } from "to-words";



type Props = { data: any , organization?:any};

function PdfView({ data, organization }: Props) {
  const { request: getCustomer } = useApi("get", 7002);
  const { request: getCurrency } = useApi("get", 7004);
  const [supplier, setSupplier] = useState<[] | any>([]);
  console.log(supplier,"supplier");
  
  const [currency, stecurrency] = useState<[] | any>([]);

  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      ignoreDecimal: true,
      ignoreZeroCurrency: true,
    },
  });
  const getCustomerAddress = async () => {
    try {
      const url = `${endponits.GET_ONE_CUSTOMER}/${data.customerId}`;
      const { response, error } = await getCustomer(url);
      if (!error && response) {
        setSupplier(response.data);
      } else {
        console.log("Error in fetching Supplier ,", error);
      }
    } catch (error) {
      console.log("Error in fetching Supplier ,", error);
    }
  };

  const getCurrencies = async () => {
    try {
      const url = `${endponits.GET_CURRENCIES}`;
      const { response, error } = await getCurrency(url);
      if (!error && response) {
        stecurrency(response.data);
      } else {
        console.log("Error in fetching Supplier ,", error);
      }
    } catch (error) {
      console.log("Error in fetching Supplier ,", error);
    }
  };
  console.log(data, "data");
  const baseCurrency = currency.find((c: any) => c.baseCurrency === true);
console.log(baseCurrency);


  const formattedAmount = baseCurrency 
    ? `${baseCurrency?.currencyName} ${
        data?.amountReceived && !isNaN(Number(data?.amountReceived))
          ? toWords?.convert(Number(data?.amountReceived))
          : "Zero"
      } Only`
    : "Currency not found";
  
  useEffect(() => {
    getCustomerAddress();
    getCurrencies();
  }, [data]);
  

  return (
    <div className=" flex justify-center">
      <div className="bg-white drop-shadow-2xl w-[350px] sm:w-[595px] p-8 pl-[24px] pr-[24px]">
        <div className="flex justify-between items-center mb-8 mt-1">
          <div>
            <img
                src={organization?.organizationLogo}
                alt="Company Logo"
              className="h-[49px] w-[71px] object-cover"
            />
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-textColor">
            Customer Receipt
            </h2>
            {/* <p className="text-sm font-bold text-dropdownText mt-[5px]">
              {data?.paymentId}CR-01
            </p> */}
            <h3 className="font-normal text-sm mt-[14px] text-pdftext">
              {supplier?.companyName}
            </h3>
            <p className="font-normal text-sm text-pdftext">
              {supplier.customerEmail && supplier.customerEmail}{" "}
              {supplier?.mobile && `| +${supplier.mobile}`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-2">
          <div className="grid grid-cols-2 items-center space-y-3">
            <p className="font-normal text-xs text-pdftext">Payment Date</p>
            <p className="text-xs  text-pdftext text-end">
              {data?.paymentDate ? data?.paymentDate : "-"}
            </p>
            {/* <p className="font-normal text-xs text-pdftext">Reference Number</p>
            <p className="text-xs  text-pdftext text-end">
              {data?.reference ? data.reference : "-"}
            </p> */}
            <p className="font-normal text-xs text-pdftext">Payment Mode</p>
            <p className="text-xs  text-pdftext text-end">
              {data?.paymentMode ? data.paymentMode : "-"}
            </p>
          </div>
          <div className="flex items-center justify-center ">
            <div className="bg-gradient-to-r from-[#E3E6D5] to-[#F7E7CE] px-8 flex justify-center items-center flex-col py-5 rounded-sm">
              <h3 className="text-[14px] font-bold ">Amount Received</h3>
              <p className="text-base  font-bold text-end">
              {baseCurrency?.currencySymbol}   {data?.amountReceived ? data.amountReceived : "-"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 pb-5">
          {" "}
          <p className="font-normal text-xs text-pdftext">
          Amount Received in Words
          </p>
          <p className="text-xs  text-pdftext text-end">
          {formattedAmount?formattedAmount:"-"}
          </p>
        </div>

        <table className="w-full mb-8 border border-dropdownBorder mt-5">
          <thead className="border-b border-dropdownBorder bg-gray-100">
            <tr className="font-bold text-[10px] text-pdftext text-center">
              <th className="py-2 px-4">Invoice Number</th>
              <th className="py-2 px-4">Invoice Date </th>
              <th className="py-2 px-4">Invoice Amount</th>
              <th className="py-2 px-4">Payment Amount</th>
            </tr>
          </thead>
          {data?.invoice?.map((item: any) => (
            <tbody>
              <tr className="text-[10px] text-center">
                <td className="py-2 px-4">{item?.salesInvoice}</td>
                <td className="py-2 px-4">{item?.salesInvoiceDate}</td>
                <td className="py-2 px-4">{item?.totalAmount}</td>
                <td className="py-2 px-4">{item?.paymentAmount}</td>
              </tr>
            </tbody>
          ))}
        </table>

        <div className="mb-8 text-xs space-y-2">
          <h3 className="font-normal text-xs text-pdftext">Bill to</h3>
          <p className="text-pdftext text-sm font-bold ">
            {supplier.companyName}
          </p>
          <p className="font-normal text-xs text-pdftext">
              {supplier.customerEmail && supplier.customerEmail}{" "}
              {supplier?.mobile && `| +${supplier.mobile}`}
            </p>
          <p className="font-normal text-xs text-pdftext ">
            {supplier?.billingAddressStreet1}
            {supplier?.billingAddressStreet1 &&
              supplier?.billingAddressStreet2 &&
              ","}
            {supplier?.billingAddressStreet2}
          </p>{" "}
          <p>
            {supplier?.supplierCity} {supplier?.billingPinCode}
          </p>{" "}
          <p>
            {supplier.billingState},{supplier.billingCountry}{" "}
          </p>
        </div>

        <div className="w-full mt-[64px] gap-2 mb-[55.5px] flex  items-center">
          <p className="text-pdftext text-xs font-normal">Signature</p>
          <div className="border-t border-[0.5px] border-loremcolor w-[40%]"></div>
        </div>
      </div>
    </div>
  );
}

export default PdfView;
