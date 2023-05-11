"use client";

import { fetcher } from "@/utils";
import useSWR from "swr";
import { HiLink } from "react-icons/hi";
import UrlShortList from "./urlShortList";

export default function UrlDetailPage({ urlData }) {
  const { data } = useSWR(
    "https://restcountries.com/v3.1/independent?status=true&fields=name",
    fetcher
  );

  const countries = data?.map((load) => load?.name);
  const sortedList = countries?.sort((a, b) =>
    a.common.localeCompare(b.common)
  );

  return (
    <section className="p-4 flex-1">
      {/* {slug} is Slug data */}
      <div className="w-[600px] mx-auto">
        <div className="py-4 flex gap-3">
          <HiLink size={20} />
          <h2>
            Original link:{" "}
            <u className="italic">{urlData?.url}</u>
          </h2>
        </div>
        <div className="flex gap-3">
          <select className="p-2 rounded-sm flex-1">
            <option value="" disabled>
              --select--
            </option>
            {sortedList?.map((load) => {
              const name = load?.common || load?.official;
              return (
                <option key={name} value={name}>
                  {name}
                </option>
              );
            })}
          </select>
          <button className="px-2 bg-green-400 rounded-sm">new link</button>
        </div>

        <UrlShortList />
      </div>
    </section>
  );
}
