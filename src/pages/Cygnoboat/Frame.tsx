import React, { useEffect, useRef } from "react";
import { useOrganization } from "../../context/OrganizationContext";

interface ExternalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

const Frame: React.FC<ExternalPopupProps> = ({ isOpen, onClose, url }) => {
  const { organization } = useOrganization();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const popupRef = useRef<HTMLDivElement>(null); // Ref for the popup container

  useEffect(() => {
    if (!organization || !iframeRef.current) return;
  
    const data = {
      email: organization.primaryContactEmail || "",
      image: organization.organizationLogo || "",
      name: "John",
    };
  
    const handleIframeLoad = () => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: "ORG_DATA", data },
        "*"
      );
    };
  
    const iframe = iframeRef.current;
    iframe.addEventListener("load", handleIframeLoad);
  
    return () => {
      iframe.removeEventListener("load", handleIframeLoad);
    };
  }, [organization, url]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 z-[9999] bg-black fixed inset-0 flex justify-end items-center me-2  h-full pt-2">
      <div ref={popupRef} className="w-[28%]  h-full ">
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full border-none rounded-xl h-full"
          title="External Website"
        />
      </div>
    </div>
  );
};

export default Frame;
