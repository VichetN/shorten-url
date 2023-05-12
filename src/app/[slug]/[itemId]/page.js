import { fetchDataByGet, getDomain } from "@/utils";
import axios from "axios";
import { redirect } from "next/navigation";
import React from "react";

const getData = async (params) => {
  const data = await axios.get(
    fetchDataByGet("/api/short-url-workers", { ...params })
  );
  return data?.data?.data;
};

export default async function Page({ params }) {
  const { slug, itemId } = params;
  const urlData = await getData({ countryCode: slug, id: itemId });
  if (urlData) {
    redirect(urlData?.url);
  }

  return <div>Loading...</div>;
}
