import { fetchDataByGet } from "@/utils";
import axios from "axios";
import { redirect, notFound } from "next/navigation";
import React from "react";

const getData = async (params) => {
  const data = await axios.get(
    fetchDataByGet("/api/short-url-workers", { ...params })
  );
  return data?.data?.data;
};

export default async function Page({ params }) {
  const { slug, itemId } = params;

  const urlData = await getData({ id: itemId });

  if (urlData?.url) {
    let newUrl = urlData?.url;
    if (!newUrl?.includes("http")) {
      newUrl = `http://${newUrl}`;
    }
    redirect(newUrl);
  } else {
    notFound();
  }

  return <div>Loading...</div>;
}
