import axios from "axios";

const BASE_URLS: Record<number, string> = {
  5000:import.meta.env.VITE_REACT_APP_OCR,
  5001: import.meta.env.VITE_REACT_APP_ACCOUNTS,
  5002: import.meta.env.VITE_REACT_APP_CUSTOMERS,
  5003: import.meta.env.VITE_REACT_APP_INVENTORY,
  5004: import.meta.env.VITE_REACT_APP_ORGANIZATION,
  5005: import.meta.env.VITE_REACT_APP_PURCHASE,
  5006: import.meta.env.VITE_REACT_APP_REPORT,
  5007: import.meta.env.VITE_REACT_APP_SALES,
  5008: import.meta.env.VITE_REACT_APP_STAFF,
  5009: import.meta.env.VITE_REACT_APP_SUPPLIER,
  3004: import.meta.env.VITE_REACT_APP_TICKETS,
};

const createInstance = (
  port: number,
  contentType: string,
  useAuth: boolean
) => {
  const baseURL = BASE_URLS[port];
  let headers: Record<string, string> = {
    "Content-Type": contentType,
    Accept: "application/json",
  };



  if (useAuth) {
    const authToken: string | null = localStorage.getItem("authToken");
    if (authToken) {
      headers = { ...headers, Authorization: `${authToken}`};
    }
  }

  return axios.create({
    baseURL,
    headers,
  });
};

const baseInstance = (port: number) =>
  createInstance(port, "application/json", false);

const authInstance = (port: number) =>
  createInstance(port, "application/json", true);

const MauthInstance = (port: number) =>
  createInstance(port, "multipart/form-data", true);

export default { baseInstance, authInstance, MauthInstance };
