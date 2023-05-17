"use client";

import { fetchDataByGet, fetcher, getDomain, isValidURL } from "@/utils";
import useSWR from "swr";
import { HiLink } from "react-icons/hi";

import { useState } from "react";
import axios from "axios";
import UrlShortList from "./urlShortList";
import { useRequest } from "ahooks";
import { toast } from "react-toastify";
import Link from "next/link";
import UpdateDefaultLink from "./updateDefaultLink";

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
  const [targetLink, setTargetLink] = useState("");
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

  const {
    data: getUrl,
    refresh,
    loading,
  } = useRequest(getURL, {
    defaultParams: [{ id: slug }],
  });
  const urlData = getUrl?.data;
  const shortURL = `${getDomain()}/u/${urlData?.id}`;

  const { runAsync } = useRequest(addShortURL, {
    manual: true,
    onSuccess: (res) => {
      if (res?.success) {
        refresh();
      }
    },
  });

  const handleGenerateNewLink = () => {
    if (country === "" || targetLink?.trim() === "") {
      return;
    }

    if (!isValidURL(targetLink?.trim())) {
      toast.warn("Invalid URL!");
      return;
    }

    const findCountry = sortedList?.find((e) => e?.common === country) || null;

    let toastId = toast.loading("Please wait...");
    runAsync({
      countryCode: findCountry?.countryCode,
      country: findCountry?.common,
      id: urlData?.id,
      targetLink: targetLink?.trim(),
    }).then(() => {
      toast.update(toastId, {
        render: "Short URL added",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setCountry("");
      setTargetLink("");
    });
  };

  if (loading) {
    return (
      <div className="w-full lg:w-[600px] mx-auto">
        <p className="py-8 animate-bounce">Loading...</p>
      </div>
    );
  }

  return (
    <section className="p-4 w-full">
      <div className="w-full lg:w-[600px] mx-auto">
        <div className="py-4 flex gap-3">
          <div className="w-[40px]">
            <HiLink size={20} />
          </div>
          <h2>
            URL: <br className="block md:hidden" />{" "}
            <Link target="_blank" href={shortURL}>
              <u className="italic break-all">{urlData?.id && shortURL}</u>
            </Link>
          </h2>
        </div>

        <UpdateDefaultLink dataSource={urlData} refresh={refresh} />
        <hr className="w-full h-1 bg-black my-4" />
        {urlData?.defaultLink && (
          <>
            <p className="text-gray-500">Geo target links:</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <select
                  className="p-2 rounded-sm w-full"
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
              </div>
              <div className="col-span-2 flex gap-3 w-full">
                <input
                  className="p-2 rounded-sm flex-1 outline-none"
                  value={targetLink}
                  onChange={(e) => setTargetLink(e.target.value)}
                  placeholder="Target link *"
                />

                <button
                  className="px-2 bg-green-400 rounded-sm"
                  onClick={handleGenerateNewLink}
                >
                  ADD
                </button>
              </div>
            </div>

            <UrlShortList
              targetLinks={urlData?.targetLinks}
              refresh={refresh}
            />
          </>
        )}
      </div>
    </section>
  );
}
