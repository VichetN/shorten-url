"use client";

import { fetchDataByGet, fetcher } from "@/utils";
import useSWR from "swr";
import { HiLink } from "react-icons/hi";

import { useState } from "react";
import axios from "axios";
import UrlShortList from "./urlShortList";
import { useRequest } from "ahooks";
import { toast } from "react-toastify";

const addShortURL = async (params) => {
  const res = await axios.post("/api/short-url-workers", { ...params });
  return res?.data;
};

const getURL = async (params) => {
  const res = await fetch(
    fetchDataByGet("/api/url-workers", {
      ...params,
    }),
    {
      next: {
        revalidate: 20,
      },
    }
  ).then((res1) => res1.json());

  return res;
};

export default function UrlDetailPage({ slug }) {
  const [country, setCountry] = useState("");
  const { data } = useSWR(
    "https://restcountries.com/v3.1/all?status=true&fields=name,cca2", //&fields=name
    fetcher
  );
  const countries = data?.map((load) => ({
    ...load?.name,
    countryCode: load?.cca2,
  }));
  const sortedList = countries?.sort((a, b) =>
    a.common.localeCompare(b.common)
  );

  const { data: getUrl, refresh } = useRequest(getURL, {
    defaultParams: [{ id: slug }],
  });
  const urlData = getUrl?.data;

  const { runAsync } = useRequest(addShortURL, {
    manual: true,
    onSuccess: (res) => {
      if (res?.success) {
        refresh();
      }
    },
  });

  const handleGenerateNewLink = () => {
    if (country === "") {
      return;
    }

    const findCountry = sortedList?.find((e) => e?.common === country) || null;

    let toastId = toast.loading("Please wait...");
    runAsync({
      countryCode: findCountry?.countryCode,
      country: findCountry?.common,
      id: urlData?.id,
    }).then(() => {
      toast.update(toastId, {
        render: "Short URL added",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setCountry("");
    });
  };

  return (
    <section className="p-4 w-full">
      <div className="w-full lg:w-[600px] mx-auto">
        <div className="py-4 flex gap-3">
          <HiLink size={20} />
          <h2>
            Original link: <br className="block md:hidden" /><u className="italic">{urlData?.url}</u>
          </h2>
        </div>
        <div className="flex gap-3 w-full">
          <select
            className="p-2 rounded-sm flex-1 w-full"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">--select--</option>
            {sortedList?.map((load) => {
              const name = load?.common || load?.official;
              return (
                <option key={name} value={name}>
                  {name}
                </option>
              );
            })}
          </select>
          <button
            className="px-2 bg-green-400 rounded-sm"
            onClick={handleGenerateNewLink}
          >
            new link
          </button>
        </div>

        <UrlShortList shortLinks={urlData?.shortLinks} refresh={refresh} />
      </div>
    </section>
  );
}
