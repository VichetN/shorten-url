import ip2location from "ip-to-location";
import { customAlphabet, nanoid } from "nanoid";

export const isDebug = () => process?.env?.NODE_ENV === "development";

export const getDomain = () =>
  isDebug() ? "http://localhost:3000" : process?.env?.NEXT_PUBLIC_API_URL;

export const fetchDataByGet = (url, params = {}) => {
  const newParams =
    Object.keys(params).length > 0
      ? `?${new URLSearchParams(params).toString()}`
      : "";

  return `${getDomain()}${url}${newParams}`;
};

export const getPublicIP = async () => {
  return await fetch("https://api.ipify.org?format=json").then((res) =>
    res.json()
  );
};

export const getLocationByIP = async () => {
  const ip = await getPublicIP();
  // return await ipLocation(ip?.ip);
  // console.log(ip);
  return await ip2location.fetch(ip?.ip);
};

export const generateID = () => {
  const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz_", 10);
  return nanoid(7);
};
