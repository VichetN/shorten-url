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
