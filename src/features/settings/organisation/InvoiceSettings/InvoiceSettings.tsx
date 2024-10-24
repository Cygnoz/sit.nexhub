import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ChevronRight from "../../../../assets/icons/ChevronRight";
import CirclePlus from "../../../../assets/icons/circleplus";
import Plus from "../../../../assets/icons/Plus";
import facebooklogo from "../../../../assets/Images/facebook logo.svg";
import instagramLogo from "../../../../assets/Images/instagram logo.svg";
import linkedinlog from "../../../../assets/Images/linkedin logo.svg";
import QrCode from "../../../../assets/Images/qr-code.svg";
import Qrsign from "../../../../assets/Images/sign.svg";
import twitterLogo from "../../../../assets/Images/twitter-logo.png";
import xMark from "../../../../assets/Images/x.svg";
import Button from "../../../../Components/Button";
import Modal from "../../../../Components/model/Modal";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import Banner from "../../banner/Banner";
import { settingsdataResponseContext } from "../../../../context/ContextShare";
type Props = {};

function InvoiceSettings({}: Props) {
  const { request: AddInvoiceSettings } = useApi("put", 5004);
  const [isAddPlaceHolderOpen, setAddPlaceHolderOpen] = useState(false);
  const [isSeePreviewOpen, setSeePreviewOpen] = useState(false);
  const [showQROpenLocation, setShowQROpenLocation] = useState(false);
  const [showQROpenPayment, setShowQROpenPayment] = useState(false);
  const [showSignOpen, setShowSignOpen] = useState(false);
  const {settingsResponse, getSettingsData } = useContext(settingsdataResponseContext)!;
  const [isOrganisationAddressOpen, setOrganisationAddressOpen] =
    useState(false);
  const organizationDetails = [
    "${ORGANIZATION.CITY} ${ORGANIZATION.STATE} ${ORGANIZATION.POSTAL_CODE}",
    "${ORGANIZATION.COUNTRY}",
    "${ORGANIZATION.GSTNO_LABEL} ${ORGANIZATION.GSTNO_VALUE}",
    "${ORGANIZATION.PHONE}",
    "${ORGANIZATION.EMAIL}",
    "${ORGANIZATION.WEBSITE}",
  ];
  const organisationAddress = [
    "Street Adress 1",
    "Fax",
    "Street Adress 1",
    "Phone Label",
    "Organization Name",
    "City",
    "Email",
    "State/Province",
    "Website",
    "Country",
    "Zip/Postal Code",
    "Fax Label",
  ];
  const previewList = [
    "Kerala",
    "India",
    "GSTIN 32f4565464",
    "6233494546",
    "Dheeraj@",
  ];
  const [invoiceSettings, setInvoiceSettings] = useState({
    organizationAddressFormat: "${ORGANIZATION.CITY}",
    qrLocation: "",
    displayQrLocation: false,
    qrPayment: "",
    displayQrPayment: false,
    digitalSignature: "",
    displayDigitalSignature: false,
    xLink: "",
    displayXLink: false,
    instagramLink: "",
    displayInstagramLink: false,
    linkedinLink: "",
    displayLinkedinLink: false,
    facebookLink: "",
    displayFacebookLink: false,
    accountHolderName: "",
    displayAccountHolderName:false,
    bankName: "",
    displayBankName:false,
    accNum: "",
    displayAccNum:false,
    ifsc: "",
    displayIfsc:false,
    defaultTermsAndCondition:""
  });

  const handleInvoiceSettings = async (e: any) => {
    e.preventDefault();

    try {
      const url = `${endponits.ADD_INVOICE_SETTINGS}`;
      const apiResponse = await AddInvoiceSettings(url, invoiceSettings);
      const { response, error } = apiResponse;
      if (!error && response) {
        toast.success(response.data);
      } else {
        toast.error(`API Error: ${error}`);
      }
    } catch (error) {
      toast.error(`Error during API call: ${error}`);
    }
  };

  const encodeFileToBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

 
  useEffect(() => {
    getSettingsData();
  }, []); 
  
  useEffect(() => {
    if (settingsResponse) {
      setInvoiceSettings((prevData) => ({
        ...prevData,
        ...settingsResponse?.data?.invoice,
      }));
    }
  }, [settingsResponse]);


  const openModal = (
    placeholder = false,
    seePreview = false,
    showQRLocation = false,
    showSign = false,
    showQRPayment = false
  ) => {
    setAddPlaceHolderOpen(placeholder);
    setSeePreviewOpen(seePreview);
    setShowQROpenLocation(showQRLocation);
    setShowSignOpen(showSign);
    setShowQROpenPayment(showQRPayment);
  };

  const closeModal = (
    placeholder = false,
    seePreview = false,
    showQRLocation = false,
    showSign = false,
    showQRPayment = false
  ) => {
    setAddPlaceHolderOpen(placeholder);
    setSeePreviewOpen(seePreview);
    setShowQROpenLocation(showQRLocation);
    setShowSignOpen(showSign);
    setShowQROpenPayment(showQRPayment);
  };

  const handleFileChange = async (e: any, type: any) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await encodeFileToBase64(file);
      console.log(base64);

      setInvoiceSettings((prevState) => ({
        ...prevState,
        [type]: base64,
      }));
    }
  };

  const handleEventBindChange = (value: any, varName: string) => {
    setInvoiceSettings((prevState) => ({
      ...prevState,
      [varName]: value,
    }));
  };

  return (
    <div className="m-4">
      <Banner seeOrgDetails />

      <form onSubmit={(e) => handleInvoiceSettings(e)}>
        {/* Org Adresss format */}
        <div className="space-y-4 text-sm text-[#303F58]">
          <div className="grid  grid-cols-12 mt-5 ">
            <div className="col-span-7 h-14 flex items-center px-5 rounded-lg justify-between bg-white">
              <p className="font-bold">Organizational Address Format</p>
              <p onClick={() => setOrganisationAddressOpen((prev) => !prev)}>
                <ChevronRight
                  color="#303F58"
                  className={`transition-transform duration-500 ${
                    isOrganisationAddressOpen ? "rotate-90" : ""
                  } ease-in-out cursor-pointer`}
                />
              </p>
            </div>
            <div
              className={`col-span-7 rounded-lg bg-white overflow-hidden transition-max-height duration-500 ease-in-out  ${
                isOrganisationAddressOpen ? "mt-5 space-y-3" : "max-h-0"
              }`}
              style={{ minHeight: isOrganisationAddressOpen ? "225px" : "0" }}
            >
              <div className="m-4 space-y-3">
                <div
                  onClick={() => openModal(true, false)}
                  className="text-[#820000] flex items-center space-x-1 font-bold text-sm cursor-pointer"
                >
                  <p>Insert Placeholders</p>
                  <CirclePlus color="#820000" size="14" />
                </div>
                <Modal
                  open={isAddPlaceHolderOpen}
                  onClose={() => closeModal()}
                  style={{ width: "497px", padding: "12px" }}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {organisationAddress.map((address) => (
                      <div className="p-2  rounded hover:bg-[#F3E6E6] cursor-pointer">
                        {address}
                      </div>
                    ))}
                  </div>
                </Modal>
                <div className="p-3  bg-[#F4F4F4]">
                  {organizationDetails.map((data) => (
                    <p className="text-[12px]">{data}</p>
                  ))}
                </div>
                <p
                  onClick={() => openModal(false, true)}
                  className="text-center text-[#820000] text-[14px] font-bold cursor-pointer"
                >
                  See Preview
                </p>
                <Modal
                  open={isSeePreviewOpen}
                  onClose={() => closeModal()}
                  style={{ width: "298px", padding: "12px" }}
                >
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      {previewList.map((list) => (
                        <p>{list}</p>
                      ))}
                    </div>
                    <p
                      onClick={() => closeModal()}
                      className="text-[20px] cursor-pointer"
                    >
                      &times;
                    </p>
                  </div>
                </Modal>
              </div>
            </div>
          </div>

          {/* QR code Location */}
          <div className="space-y-3">
            <p className="font-bold">QR code Location</p>
            <div>
              <label>
                <div className="rounded-md p-5 bg-white grid grid-cols-12 gap-4 cursor-pointer">
                  <div className="col-span-10 flex">
                    <div className="w-20 h-20 rounded-md flex items-center justify-center bg-[#F7E7CE]">
                      <img src={QrCode} alt="Default QR Code Type 1" />
                    </div>
                    <div className="ms-3 flex items-center h-full">
                      <div className="space-y-2">
                        <p>
                          <b>Upload Organization's Location QR Code</b>
                        </p>
                        <p>
                          Upload or configure the location of your QR code on
                          the invoice
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-8">
                    {invoiceSettings.qrLocation && (
                      <Button
                        onClick={() => openModal(false, false, true)}
                        variant="secondary"
                        className="h-[26px] w-[68px] flex justify-center"
                        size="sm"
                      >
                        <p className="text-[10px] font-medium">Show QR</p>
                      </Button>
                    )}
                    <div className="bg-darkRed text-white items-center justify-center rounded-full flex h-8 w-8">
                      <Plus color="white" />
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "qrLocation")}
                />
              </label>
              <Modal
                open={showQROpenLocation}
                onClose={() => closeModal()}
                style={{
                  width: "360px",
                  padding: "32px",
                  borderRadius: "16px",
                }}
              >
                <div className="flex flex-col items-center justify-center space-y-6 my-6">
                  <p className="w-[220px] text-center text-[18px] font-bold">
                    Organization’s Location QR Code
                  </p>
                  <div className="px-4 py-2 border border-[#ABABAB] rounded-lg">
                    <img
                      src={invoiceSettings.qrLocation}
                      alt="QR Code Type 1"
                      width={150}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label htmlFor="qrLocation" className="cursor-pointer">
                      <div className="h-[32px] w-[92px] flex justify-center items-center rounded-lg bg-[#820000] hover:bg-[#820000]">
                        <p className="text-xs font-medium text-white">
                          Replace QR
                        </p>
                      </div>
                      <input
                        type="file"
                        id="qrLocation"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "qrLocation")}
                      />
                    </label>
                    <Button
                      onClick={() => closeModal()}
                      variant="secondary"
                      className="h-[32px] w-[92px] flex justify-center rounded-lg"
                      size="sm"
                    >
                      <p className="text-xs font-medium text-[#565148]">
                        Close
                      </p>
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
            <div className="flex items-center space-x-2">
              <input
                onChange={(e) =>
                  handleEventBindChange(e.target.checked, "displayQrLocation")
                }
                type="checkbox"
                id="customCheckbox"
                checked={invoiceSettings.displayQrLocation}
              />
              <label className="text-[14px]">Display in Invoice</label>
            </div>
          </div>

          {/* QR code Payment */}
          <div className="space-y-3">
            <p className="font-bold">QR code Payment</p>
            <div>
              <label>
                <div className="rounded-md p-5 bg-white grid grid-cols-12 gap-4 cursor-pointer">
                  <div className="col-span-10 flex">
                    <div className="w-20 h-20 rounded-md flex items-center justify-center bg-[#F7E7CE]">
                      <img src={QrCode} alt="" />
                    </div>
                    <div className="ms-3 flex items-center h-full">
                      <div className="space-y-2">
                        <p>
                          <b>Upload Payment Based QR Code</b>
                        </p>
                        <p>Upload Payment Based QR Code on the Invoice</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-8">
                    {invoiceSettings.qrPayment && (
                      <Button
                        onClick={() =>
                          openModal(false, false, false, false, true)
                        }
                        variant="secondary"
                        className="h-[26px] w-[68px] flex justify-center"
                        size="sm"
                      >
                        <p className="text-[10px] font-medium">Show QR</p>
                      </Button>
                    )}
                    <div className="bg-darkRed text-white items-center justify-center rounded-full flex h-8 w-8">
                      <Plus color="white" />
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "qrPayment")}
                />
              </label>
              <Modal
                open={showQROpenPayment}
                onClose={() => closeModal()}
                style={{
                  width: "360px",
                  padding: "32px",
                  borderRadius: "16px",
                }}
              >
                <div className="flex flex-col items-center justify-center space-y-6 my-6">
                  <p className="w-[220px] text-center text-[18px] font-bold">
                    Payment Based QR Code
                  </p>
                  <div className="px-4 py-2 border border-[#ABABAB] rounded-lg">
                    <img
                      src={invoiceSettings.qrPayment}
                      alt="QR Code Type 1"
                      width={150}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label htmlFor="qrPayment" className="cursor-pointer">
                      <div className="h-[32px] w-[92px] flex justify-center items-center rounded-lg bg-[#820000] hover:bg-[#820000]">
                        <p className="text-xs font-medium text-white">
                          Replace QR
                        </p>
                      </div>
                      <input
                        type="file"
                        id="qrPayment"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "qrPayment")}
                      />
                    </label>
                    <Button
                      onClick={() => closeModal()}
                      variant="secondary"
                      className="h-[32px] w-[92px] flex justify-center rounded-lg"
                      size="sm"
                    >
                      <p className="text-xs font-medium text-[#565148]">
                        Close
                      </p>
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
            <div className="flex items-center space-x-2">
              <input
                checked={invoiceSettings.displayQrPayment}
                onChange={(e) =>
                  handleEventBindChange(e.target.checked, "displayQrPayment")
                }
                type="checkbox"
                id="customCheckbox"
              />
              <label className="text-[14px]">Display in Invoice</label>
            </div>
          </div>

          {/* Invoice Signatory */}
          <div className="space-y-3">
            <p className="font-bold">Invoice Signatory</p>
            <div>
              <label>
                <div className="rounded-md p-5 bg-white grid grid-cols-12 gap-4 cursor-pointer">
                  <div className="col-span-10 flex">
                    <div className="w-20 h-20 rounded-md flex items-center justify-center bg-[#F7E7CE]">
                        
                        <img src={Qrsign} alt="Default Signature" />
                      
                    </div>
                    <div className="ms-3 flex items-center h-full">
                      <div className="space-y-2">
                        <p>
                          <b>Upload Organisation Digital Signature</b>
                        </p>
                        <p>
                          Upload the digital signature of the person authorized
                          to sign invoices
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-8">
                    {invoiceSettings.digitalSignature && (
                      <Button
                        onClick={() => openModal(false, false, false, true)}
                        variant="secondary"
                        className="h-[26px] w-[74px] flex justify-center"
                        size="sm"
                      >
                        <p className="text-[10px] font-medium">Show Sign</p>
                      </Button>
                    )}
                    <div className="bg-darkRed text-white items-center justify-center rounded-full flex h-8 w-8">
                      <Plus color="white" />
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "digitalSignature")}
                />
              </label>
              <Modal
                open={showSignOpen}
                onClose={() => closeModal()}
                style={{
                  width: "360px",
                  padding: "32px",
                  borderRadius: "16px",
                }}
              >
                <div className="flex flex-col items-center justify-center space-y-6 my-6">
                  <p className="w-[220px] text-center text-[18px] font-bold">
                    Organization’s Digital Signature
                  </p>
                  <div className="px-4 py-2 border border-[#ABABAB] rounded-lg">
                    <img
                      src={invoiceSettings.digitalSignature}
                      alt="Digital Signature"
                      width={150}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="digitalSignature"
                      className="cursor-pointer"
                    >
                      <div className="h-[32px] w-[92px] flex justify-center items-center rounded-lg bg-[#820000] hover:bg-[#820000]">
                        <p className="text-xs font-medium text-white">
                          Replace Sign
                        </p>
                      </div>
                      <input
                        type="file"
                        id="digitalSignature"
                        className="hidden"
                        onChange={(e) =>
                          handleFileChange(e, "digitalSignature")
                        }
                      />
                    </label>
                    <Button
                      onClick={() => closeModal()}
                      variant="secondary"
                      className="h-[32px] w-[92px] flex justify-center rounded-lg"
                      size="sm"
                    >
                      <p className="text-xs font-medium text-[#565148]">
                        Close
                      </p>
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
            <div className="flex items-center space-x-2">
              <input
                checked={invoiceSettings.displayDigitalSignature}
                onChange={(e) =>
                  handleEventBindChange(
                    e.target.checked,
                    "displayDigitalSignature"
                  )
                }
                type="checkbox"
                id="customCheckbox"
              />
              <label className="text-[14px]">
                Display in Invoice
              </label>
            </div>
          </div>

          <p className=" my-4">
  <b>Add Social Media</b>
</p>
<div className="rounded-md p-5 bg-white">
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label htmlFor="" className="text-slate-600">Twitter</label>
      <div className="flex gap-2 items-center justify-center">
        <div className="flex items-center justify-center align-middle bg-slate-100 p-2 h-10 rounded-md mt-2">
          <img width={25} src={twitterLogo} alt="" />
        </div>
        <input
          type="text"
          placeholder="Add Twitter Link"
          onChange={(e) =>
            handleEventBindChange(e.target.value, "xLink")
          }
          value={invoiceSettings.xLink}
          className="pl-4 mt-3 text-sm w-[100%] rounded-md text-start bg-white border border-slate-300 h-[39px] p-2 focus:outline-none focus:ring-1 focus:ring-[#7E0D0B]"
          name="twitter"
        />
        <img src={xMark} className="mt-3" alt="" />
      </div>
      <div className="flex items-center space-x-2 mt-3">
        <input
          checked={invoiceSettings.displayXLink}
          onChange={(e) =>
            handleEventBindChange(e.target.checked, "displayXLink")
          }
          type="checkbox"
          id="customCheckbox"
        />
        <label className="text-[14px]">Display in Invoice</label>
      </div>
    </div>

    <div>
      <label className="text-slate-600">Instagram</label>
      <div className="flex gap-2 items-center justify-center">
        <div className="flex items-center justify-center bg-slate-100 p-2 h-10 rounded-md mt-2">
          <img src={instagramLogo} alt="" />
        </div>
        <input
          type="text"
          placeholder="Add Instagram Link"
          className="pl-4 mt-3 text-sm w-[100%] rounded-md text-start bg-white border border-slate-300 h-[39px] p-2 focus:outline-none focus:ring-1 focus:ring-[#7E0D0B]"
          value={invoiceSettings.instagramLink}
          name="insta"
          onChange={(e) =>
            handleEventBindChange(e.target.value, "instagramLink")
          }
        />
        <img src={xMark} className="mt-3" alt="" />
      </div>
      <div className="flex items-center space-x-2 mt-3">
        <input
          checked={invoiceSettings.displayInstagramLink}
          onChange={(e) =>
            handleEventBindChange(
              e.target.checked,
              "displayInstagramLink"
            )
          }
          type="checkbox"
          id="customCheckbox"
        />
        <label className="text-[14px]">Display in Invoice</label>
      </div>
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4 mt-4">
    <div>
      <label htmlFor="" className="text-slate-600">Linkedin</label>
      <div className="flex gap-2 items-center justify-center">
        <div className="flex items-center justify-center bg-slate-100 p-2 h-10 rounded-md mt-2">
          <img src={linkedinlog} alt="" />
        </div>
        <input
          type="text"
          placeholder="Add Linkedin Link"
          className="pl-4 mt-3 text-sm w-[100%] rounded-md text-start bg-white border border-slate-300 h-[39px] p-2 focus:outline-none focus:ring-1 focus:ring-[#7E0D0B]"
          name="linkedin"
          onChange={(e) =>
            handleEventBindChange(e.target.value, "linkedinLink")
          }
          value={invoiceSettings.linkedinLink}
        />
        <img src={xMark} className="mt-3" alt="" />
      </div>
      <div className="flex items-center space-x-2 mt-3">
        <input
          checked={invoiceSettings.displayLinkedinLink}
          onChange={(e) =>
            handleEventBindChange(
              e.target.checked,
              "displayLinkedinLink"
            )
          }
          type="checkbox"
          id="customCheckbox"
        />
        <label className="text-[14px]">Display in Invoice</label>
      </div>
    </div>

    <div>
      <label className="text-slate-600">Facebook</label>
      <div className="flex gap-2 items-center justify-center">
        <div className="flex items-center justify-center bg-slate-100 p-2 h-10 rounded-md mt-2">
          <img src={facebooklogo} alt="" />
        </div>
        <input
          type="text"
          placeholder="Add Facebook Link"
          className="pl-4 mt-3 text-sm w-[100%] rounded-md text-start bg-white border border-slate-300 h-[39px] p-2 focus:outline-none focus:ring-1 focus:ring-[#7E0D0B]"
          onChange={(e) =>
            handleEventBindChange(e.target.value, "facebookLink")
          }
          value={invoiceSettings.facebookLink}
          name="facebook"
        />
        <img src={xMark} className="mt-3" alt="" />
      </div>
      <div className="flex items-center space-x-2 mt-3">
        <input
          checked={invoiceSettings.displayFacebookLink}
          onChange={(e) =>
            handleEventBindChange(
              e.target.checked,
              "displayFacebookLink"
            )
          }
          type="checkbox"
          id="customCheckbox"
        />
        <label className="text-[14px]">Display in Invoice</label>
      </div>
    </div>
  </div>
</div>
<p className="my-4">
  <b>Add Payment Information</b>
</p>
<div className="bg-white rounded-md mt-4 p-5">
  <p className="my-4">
    <b>Enter Bank account Details</b>
  </p>

  <div className="grid grid-cols-2 gap-4 mt-4">
    <div>
      <label className="text-slate-600">Account Holder Name</label>
      <input
        type="text"
        placeholder="Enter Account Holder Name"
        className="pl-4 text-sm w-[100%] mt-3 rounded-md text-start bg-white border border-slate-300 h-[39px] p-2 focus:outline-none focus:ring-1 focus:ring-[#7E0D0B]"
        onChange={(e) =>
          handleEventBindChange(e.target.value, "accountHolderName")
        }
        value={invoiceSettings.accountHolderName}
        name="accountHolderName"
      />
      <div className="flex items-center space-x-2 mt-3">
        <input
          checked={invoiceSettings.displayAccountHolderName}
          onChange={(e) =>
            handleEventBindChange(e.target.checked, "displayAccountHolderName")
          }
          type="checkbox"
          id="customCheckbox"
        />
        <label className="text-[14px]">Display in Invoice</label>
      </div>
    </div>
    
    <div>
      <label className="text-slate-600">Bank Name</label>
      <input
        type="text"
        placeholder="Enter Bank Name"
        className="pl-4 mt-3 text-sm w-[100%] rounded-md text-start bg-white border border-slate-300 h-[39px] p-2 focus:outline-none focus:ring-1 focus:ring-[#7E0D0B]"
        onChange={(e) =>
          handleEventBindChange(e.target.value, "bankName")
        }
        value={invoiceSettings.bankName}
        name="bankName"
      />
      <div className="flex items-center space-x-2 mt-3">
        <input
          checked={invoiceSettings.displayBankName}
          onChange={(e) =>
            handleEventBindChange(e.target.checked, "displayBankName")
          }
          type="checkbox"
          id="customCheckbox"
        />
        <label className="text-[14px]">Display in Invoice</label>
      </div>
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4 mt-4">
    <div>
      <label className="text-slate-600">Account Number</label>
      <input
        type="rating"
        placeholder="Enter Account Number"
        className="pl-4 mt-3 text-sm w-[100%] rounded-md text-start bg-white border border-slate-300 h-[39px] p-2 focus:outline-none focus:ring-1 focus:ring-[#7E0D0B]"
        onChange={(e) =>
          handleEventBindChange(e.target.value, "accNum")
        }
        value={invoiceSettings.accNum}
        name="accNum"
      />
      <div className="flex items-center space-x-2 mt-3">
        <input
          checked={invoiceSettings.displayAccNum}
          onChange={(e) =>
            handleEventBindChange(e.target.checked, "displayAccNum")
          }
          type="checkbox"
          id="customCheckbox"
        />
        <label className="text-[14px]">Display in Invoice</label>
      </div>
    </div>

    <div>
      <label className="text-slate-600">IFSC Code</label>
      <input
        type="text"
        placeholder="Enter IFSC Code"
        className="pl-4 text-sm mt-3 w-[100%] rounded-md text-start bg-white border border-slate-300 h-[39px] p-2 focus:outline-none focus:ring-1 focus:ring-[#7E0D0B]"
        onChange={(e) =>
          handleEventBindChange(e.target.value, "ifsc")
        }
        value={invoiceSettings.ifsc}
        name="ifsc"
      />
      <div className="flex items-center space-x-2 mt-3">
        <input
          checked={invoiceSettings.displayIfsc}
          onChange={(e) =>
            handleEventBindChange(e.target.checked, "displayIfsc")
          }
          type="checkbox"
          id="customCheckbox"
        />
        <label className="text-[14px]">Display in Invoice</label>
      </div>
    </div>
  </div>
  <div />
</div>
<p className="font-bold text-textColor text-sm mb-3">Terms & Condition</p>
<div className="mt-4 p-6 rounded-lg bg-white">
  <textarea value={invoiceSettings.defaultTermsAndCondition} onChange={(e) =>
          handleEventBindChange(e.target.value, "defaultTermsAndCondition")
        } className="w-full h-32 p-3 border border-inputBorder rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#7E0D0B]" />
</div>
</div>
        <div className="flex my-4 gap-4">
          <Button
            variant="primary"
            type="submit"
            className="h-[38px] w-[120px] flex justify-center"
            // onClick={(e) => handleCreateOrganization(e)}
          >
            <p className="text-sm">Save</p>
          </Button>

          <Button
            variant="secondary"
            className="h-[38px] w-[120px] flex justify-center"
          >
            {" "}
            <p className="text-sm">Cancel</p>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default InvoiceSettings;
