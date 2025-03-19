import axios from "axios";

const BASE_URLS: Record<number, string> = {
  5000:import.meta.env.VITE_REACT_APP_OCR,
  7001: import.meta.env.VITE_REACT_APP_ACCOUNTS,
  7002: import.meta.env.VITE_REACT_APP_CUSTOMERS,
  7003: import.meta.env.VITE_REACT_APP_INVENTORY,
  7004: import.meta.env.VITE_REACT_APP_ORGANIZATION,
  7005: import.meta.env.VITE_REACT_APP_PURCHASE,
  7006: import.meta.env.VITE_REACT_APP_REPORT,
  7007: import.meta.env.VITE_REACT_APP_SALES,
  7008: import.meta.env.VITE_REACT_APP_STAFF,
  7009: import.meta.env.VITE_REACT_APP_SUPPLIER,
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
