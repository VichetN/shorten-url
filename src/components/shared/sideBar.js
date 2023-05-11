"use client";
import axios from "axios";
import UrlList from "./urlList";
import { useRequest } from "ahooks";
import { useState } from "react";
import { useRouter } from "next/navigation";

const addURL = async (params) => {
  const res = await axios.post("/api/url-workers", { ...params });
  return res?.data;
};

const getAllURL = async (params) => {
  const res = await axios.get("/api/url-workers", { ...params });
  return res?.data;
};

function SideBar() {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter()

  const { data: urlList, refresh } = useRequest(getAllURL);
  const { run } = useRequest(addURL, {
    manual: true,
    onSuccess: (res) => {
      if (res?.data) {
        refresh();
        setInputValue("");
        router.push(`/${res?.data?.id}`);
      }
    },
  });

  const handleAdd = () => {
    const newValue = inputValue?.trim();
    if (newValue === "") {
      return;
    }

    run({
      url: newValue,
    });
  };

  return (
    <main className="p-4 w-full bg-gray-600 h-screen md:w-[400px]">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex gap-2">
          <input
            className="p-2 rounded-sm w-full"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Target url*"
          />
          <button className="px-2 bg-green-400 rounded-sm" onClick={handleAdd}>
            ADD
          </button>
        </div>
      </div>

      <UrlList dataSource={urlList?.data} />
    </main>
  );
}

export default SideBar;
