import { ChangeEvent, useContext, useEffect, useState } from "react";
import Button from "../../../../Components/Button";
import Banner from "../../banner/Banner";
import CehvronDown from "../../../../assets/icons/CehvronDown";
import WalletMinimal from "../../../../assets/icons/WalletMinimal";
import Link2 from "../../../../assets/icons/Link2";
import Modal from "../../../../Components/model/Modal";
import topImg from "../../../../assets/Images/14.png";
import CirclePlus from "../../../../assets/icons/circleplus";
import { endponits } from "../../../../Services/apiEndpoints";
import useApi from "../../../../Hooks/useApi";
import toast from "react-hot-toast";
import { settingsdataResponseContext } from "../../../../context/ContextShare";
type Props = {};

interface creditNote {
  overRideCostPrice: boolean;
  creditNoteQr: boolean;
  creditNoteQrType: string;
  creditNoteQrDescription: string;
  recordLocking: boolean;
  creditNoteTC: string;
  creditNoteCN: string;
}

function CreditNotes({}: Props) {
  const organizationDetails = [
    "${ORGANIZATION.CITY} ${ORGANIZATION.STATE} ${ORGANIZATION.POSTAL_CODE}",
    "${ORGANIZATION.COUNTRY}",
    "${ORGANIZATION.GSTNO_LABEL} ${ORGANIZATION.GSTNO_VALUE}",
    "${ORGANIZATION.PHONE}",
    "${ORGANIZATION.EMAIL}",
    "${ORGANIZATION.WEBSITE}",
  ];

  const organisationData = {
    creditNotes: [
      "Credit Note Date",
      "Credit Note#",
      "Reff#",
      "Total",
      "Total in Base Currency without Currency Code",
    ],
    customer: [
      "Salutation",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Mobile",
      "Department",
      "Designation",
      "Name",
      "Company Name",
      "Billing Attention",
      "Billing Address",
      "Billing City",
    ],
    organization: [
      "Organization Name",
      "Logo",
      "Street Address 1",
      "Street Address 2",
      "City",
      "ZIP/Postal Code",
      "State/Province",
      "Country",
      "Phone#",
      "Fax#",
    ],
  };



  const { request: addCrditNote } = useApi("put", 5007);
  const [invoiceURLDropdown, setInvoiceURLDropdown] = useState(false);
  const [configureModal, setConfigureModal] = useState(false);
  const [placeHolderModal, setPlaceHolderModal] = useState(false);
  const {settingsResponse, getSettingsData } = useContext(settingsdataResponseContext)!;

  const [inputData, setInputData] = useState<creditNote>({
    overRideCostPrice: false,
    creditNoteQr: false,
    creditNoteQrType: "",
    creditNoteQrDescription: "",
    recordLocking: false,
    creditNoteTC: "",
    creditNoteCN: "",
  });

  // console.log(inputData);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      const checked = target.checked;
      setInputData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      const target = e.target as HTMLSelectElement;
      const value = target.value;
      setInputData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };



  const handleOptionClick = (option: string) => {
    setInputData((prevData) => ({
      ...prevData,
      creditNoteQrType: option,
    }));
    setInvoiceURLDropdown(false);
  };

  const handleSaveCreditNote = async () => {
    try {
      const url = `${endponits.ADD_CREDIT_NOTE_SETTINGS}`;
      const apiResponse = await addCrditNote(url, inputData);
      console.log(apiResponse);
      const { response, error } = apiResponse;
      if (!error && response) {
        toast.success(response.data);
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      console.log(error, " Error in adding Credit note");
    }
  };

  const openModal = (configure: boolean, placeholder: boolean) => {
    if (configure) {
      setConfigureModal(configure);
    } else if (placeholder) {
      setPlaceHolderModal(placeholder);
    }
  };

  const closeModal = (configure: boolean, placeholder: boolean) => {
    if (!configure) {
      setConfigureModal(configure);
    } else if (!placeholder) {
      setPlaceHolderModal(placeholder);
    }
  };

  useEffect(() => {
    getSettingsData();
  }, []); 

  useEffect(() => {
    if (!inputData.creditNoteQr) {
      setInputData((prevData) => ({
        ...prevData,
        creditNoteQrDescription: "",
        creditNoteQrType: "",
      }));
    }


  }, [inputData.creditNoteQr]);


  useEffect(() => {
    console.log("Settings Response: ", settingsResponse);
    console.log("Input Data: ", inputData);
    if (settingsResponse) {
      setInputData((prevData) => ({
        ...prevData,
        ...settingsResponse?.data?.creditNoteSettings,
      }));
    }
  }, [settingsResponse]);
  

  return (
    <div className="p-5 text-[#303F58]">
      <Banner />
      <p className="  font-bold text-xl mt-4">Credit Notes</p>

      {/* Cost Price Preference */}
      <div className="mt-4 p-6 rounded-lg bg-white space-y-2">
        <p className="font-semibold text-sm">Cost Price Preference</p>
        <div className="flex items-start">
          <input
            type="checkbox"
            className="accent-[#97998E] bg-white h-5 w-5 mr-2 mt-1 shrink-0"
            checked={inputData.overRideCostPrice}
            name="overRideCostPrice"
            onChange={handleInputChange}
            id="overRideCostPrice"
          />
          <div className="flex-1">
            <label htmlFor="overRideCostPrice" className="text-sm font-medium">
              Allow users to override cost prices in credit notes
            </label>
            <p className="text-sm mt-1 text-[#818894]">
              Mark this option to allow users to manually edit and update the
              cost price that is fetched from the recent transaction. Once you
              override the cost price, the latest cost price will not be updated
              based on the recent transaction.
            </p>
          </div>
        </div>
      </div>

      {/* QR Code Toggle */}
      <div className="mt-4 p-6 rounded-lg bg-white space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm  ">Credit Note QR Code</p>
        </div>
        <div className="bg-[#FEFBF8] rounded-lg p-3 space-y-3">
          <p className="text-sm   ">
            Enable and configure the QR code you want to display on the PDF copy
            of an Credit Note. Your customers can scan the QR code using their
            device to access the URL or other information that you configure.
          </p>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={inputData.creditNoteQr}
                name="creditNoteQr"
                onChange={handleInputChange}
              />
              <div
                className={`w-9 h-5 rounded-full shadow-inner transition-colors ${
                  inputData.creditNoteQr ? "bg-checkBox" : "bg-dropdownBorder"
                }`}
              ></div>
              <div
                className={`dot absolute w-3 h-3 bg-white rounded-full top-1 transition-transform ${
                  inputData.creditNoteQr
                    ? "transform translate-x-full left-2"
                    : "left-1"
                }`}
              ></div>
            </div>
            <div className="ml-2   font-semibold text-sm">
              {inputData.creditNoteQr ? "Enabled" : "Disabled"}
            </div>
          </label>
        </div>
        {inputData.creditNoteQr && (
          <div className="grid grid-cols-12 items-center gap-3 text-sm">
            <div className="relative col-span-4">
              <label htmlFor="qrCodeType" className="text-slate-600">
                QR Code Type
              </label>
              <div
                onClick={() => setInvoiceURLDropdown(!invoiceURLDropdown)}
                className="relative w-full mt-2 cursor-pointer"
              >
                <p
                  id="qrCodeType"
                  className={`appearance-none w-full text-slate-600 bg-white text-sm h-[39px] pl-3 pr-8 rounded-sm leading-tight focus:outline-none border focus:bg-white ${
                    invoiceURLDropdown ? "border-darkRed" : "border-inputBorder"
                  } flex items-center`}
                >
                  {inputData.creditNoteQrType || "Select an option"}
                </p>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <CehvronDown color="gray" />
                </div>
              </div>

              {/* Custom dropdown items */}
              {invoiceURLDropdown && (
                <div className="absolute w-full mt-1 bg-white text-[#4B5C79] rounded-md shadow-lg z-10">
                  <div className="flex flex-col p-2">
                    <div
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b flex border-b-inputBorder space-x-1"
                      onClick={() => handleOptionClick(" UPI ID")}
                    >
                      <p className="mt-[2px]">
                        <WalletMinimal color="#4B5C79" size={16} />
                      </p>
                      <div className="flex flex-col">
                        <p className="font-medium text-slate-700 flex space-x-1 items-center">
                          UPI ID
                        </p>
                        <p className="text-xs text-slate-500">
                          UPI ID Will be displayed as QR code on invoices
                        </p>
                      </div>
                    </div>
                    <div
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b flex border-b-inputBorder space-x-1"
                      onClick={() => handleOptionClick(" Invoice URL")}
                    >
                      <p className="mt-[2px]">
                        <Link2 size={16} color="#4B5C79" />
                      </p>
                      <div className="flex flex-col">
                        <p className="font-medium text-slate-700 flex space-x-1 items-center">
                          Invoice URL
                        </p>
                        <p className="text-xs text-slate-500">
                          Lorem ipsum dolor sit amet consectetur. Commodo enim
                        </p>
                      </div>
                    </div>
                    <div
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex space-x-1"
                      onClick={() => handleOptionClick("Custom")}
                    >
                      <p className="mt-[2px]">
                        <Link2 color="#4B5C79" size={16} />
                      </p>
                      <div className="flex flex-col">
                        <p className="font-medium text-slate-700 flex space-x-1 items-center">
                          Custom
                        </p>
                        <p className="text-xs text-slate-500">
                          Lorem ipsum dolor sit amet consectetur. Commodo enim
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative col-span-8">
              <label htmlFor="location" className="text-slate-600">
                QR Code Description
              </label>
              <input
                className="pl-3 text-sm w-[100%] mt-2 rounded-sm text-start bg-white border border-inputBorder h-[39px] p-2 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Scan the QR code to view the configured information."
                name="creditNoteQrDescription"
                value={inputData.creditNoteQrDescription}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-span-12">
              <Button
                onClick={() => openModal(true, false)}
                className="w-[120px] h-[38px] flex justify-center rounded-lg"
              >
                <p>Configure</p>
              </Button>
              <Modal
                open={configureModal}
                onClose={() => closeModal(false, true)}
                align="top"
                className="w-[665px]"
              >
                <div className="p-5 mt-3">
                  <div className="mb-5 flex p-4 rounded-xl h-[64px] bg-CreamBg relative overflow-hidden">
                    <div
                      className="absolute top-0 -right-8 w-[178px] h-[68px]"
                      style={{
                        backgroundImage: `url(${topImg})`,
                        backgroundRepeat: "no-repeat",
                      }}
                    ></div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-textColor">
                        Configure Custom QR Code
                      </h3>
                    </div>
                    <div
                      className="ms-auto text-3xl cursor-pointer relative z-10"
                      onClick={() => closeModal(false, true)}
                    >
                      &times;
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div
                      onClick={() => openModal(false, true)}
                      className="text-[#820000] flex items-center space-x-1 font-bold text-sm cursor-pointer"
                    >
                      <p>Insert Placeholders</p>
                      <CirclePlus color="#820000" size="14" />
                    </div>
                    <Modal
                      open={placeHolderModal}
                      onClose={() => closeModal(true, false)}
                      style={{ width: "740px", padding: "12px" }}
                    >
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <h3 className="font-bold">Credit Notes</h3>
                          {organisationData.creditNotes.map((item) => (
                            <div
                              key={item}
                              className="p-2 my-2 text-[12px] rounded hover:bg-[#F3E6E6] cursor-pointer"
                            >
                              {item}
                            </div>
                          ))}
                        </div>

                        <div>
                          <h3 className="font-bold">Customer</h3>
                          {organisationData.customer.map((item) => (
                            <div
                              key={item}
                              className="p-2 my-2 text-[12px] rounded hover:bg-[#F3E6E6] cursor-pointer"
                            >
                              {item}
                            </div>
                          ))}
                        </div>

                        <div>
                          <h3 className="font-bold">Organization</h3>
                          {organisationData.organization.map((item) => (
                            <div
                              key={item}
                              className="p-2 my-2 text-[12px] rounded hover:bg-[#F3E6E6] cursor-pointer"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </Modal>
                    <div className="p-3 bg-[#F4F4F4]">
                      {organizationDetails.map((data) => (
                        <p key={data} className="text-[12px]">
                          {data}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end my-4 gap-2">
                    <Button
                      onClick={() => closeModal(false, true)}
                      variant="secondary"
                      className="h-[38px] w-[120px] flex justify-center"
                    >
                      <p className="text-sm">Cancel</p>
                    </Button>
                    <Button
                      onClick={() => closeModal(false, true)}
                      variant="primary"
                      type="submit"
                      className="h-[38px] w-[120px] flex justify-center"
                    >
                      <p className="text-sm">Update</p>
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        )}
      </div>

      {/* Record Locking Toggle */}
      <div className="mt-4 p-6 rounded-lg bg-white space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm  ">Record Locking</p>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={inputData.recordLocking}
                name="recordLocking"
                onChange={handleInputChange}
              />
              <div
                className={`w-9 h-5 rounded-full shadow-inner transition-colors ${
                  inputData.recordLocking ? "bg-checkBox" : "bg-dropdownBorder"
                }`}
              ></div>
              <div
                className={`dot absolute w-3 h-3 bg-white rounded-full top-1 transition-transform ${
                  inputData.recordLocking
                    ? "transform translate-x-full left-2"
                    : "left-1"
                }`}
              ></div>
            </div>
            <div className="ml-2   font-semibold text-sm">
              {inputData.recordLocking ? "Enabled" : "Disabled"}
            </div>
          </label>
        </div>
        <div className="bg-[#FEFBF8] rounded-lg p-3 space-y-3">
          <p className="text-sm  ">
            Record locking helps you control who can make changes to certain
            records within your organization. This can be useful if you want to
            protect important information or prevent accidental changes from
            being made. When you lock a record, only users with permission to
            edit locked records will be able to edit or delete it.
          </p>
        </div>
      </div>

      {/* Terms & Condition */}
      <div className="mt-4 p-6 rounded-lg bg-white">
        <p className="font-semibold   text-sm mb-3">Terms & Conditions</p>
        <textarea
          name="creditNoteTC"
          value={inputData.creditNoteTC}
          onChange={handleInputChange}
          className="w-full h-32 p-3 border border-inputBorder rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#7E0D0B]"
        />
      </div>

      <div className="mt-4 p-6 rounded-lg bg-white">
        <p className="font-semibold  text-sm mb-3">Customer Notes</p>
        <textarea
          value={inputData.creditNoteCN}
          name="creditNoteCN"
          onChange={handleInputChange}
          className="w-full h-32 p-3 border border-inputBorder rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#7E0D0B]"
        />
      </div>

      {/* Save Button */}
      <div className="mt-4 flex justify-end">
        <Button
          size="sm"
          className="text-sm  pl-10 pr-10"
          onClick={handleSaveCreditNote}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default CreditNotes;
