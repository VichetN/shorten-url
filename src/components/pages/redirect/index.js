"use client";

import { fetchDataByGet, getLocationByIP } from "@/utils";
import { useRequest } from "ahooks";
import axios from "axios";
import { notFound, redirect } from "next/navigation";
import { useEffect } from "react";

const getData = async (params) => {
  const location = await getLocationByIP();
  const data = await axios.get(
    fetchDataByGet("/api/short-url-workers", {
      ...params,
      countryCode: location?.countryCode,
    })
  );
  console.log(location);
  return data?.data?.data;
};

function RedirectPage({ itemId }) {
  const { data: urlData } = useRequest(getData, {
    defaultParams: [{ id: itemId }],
  });

  //   useEffect(() => {
  //     if (urlData) {
  //       let newUrl = urlData?.url;
  //       if (!newUrl?.includes("http")) {
  //         newUrl = `http://${newUrl}`;
  //       }

  //       if (!urlData?.url) {
  //         notFound();
  //       }

  //       redirect(newUrl);
  //     }
  //   }, [urlData?.url]);

  return <div className="animate-pulse">Redirecting...</div>;
}

export default RedirectPage;
