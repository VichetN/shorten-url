"use client";

import { fetcher } from "@/utils";
import useSWR from "swr";
import UrlList from "./urlList";

function SideBar() {
  const { data } = useSWR(
    "https://restcountries.com/v3.1/independent?status=true&fields=name",
    fetcher
  );

  const countries = data?.map((load) => load?.name);
  const sortedList = countries?.sort((a, b) =>
    a.common.localeCompare(b.common)
  );
  return (
    <main className="p-4 w-full bg-gray-600 h-screen md:w-[400px]">
      <div className="grid grid-cols-2 gap-4">
        {/* <div className="col-span-2 md:col-span-1">
          <select className="p-2 rounded-sm w-full">
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
        </div> */}

        <div className="col-span-2 flex gap-2">
            <input className="p-2 rounded-sm w-full" placeholder="Target url*" />
            <button className="px-2 bg-green-400 rounded-sm">ADD</button>
        </div>
      </div>

      <UrlList />
    </main>
  );
}

export default SideBar;
