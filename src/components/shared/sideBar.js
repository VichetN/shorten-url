"use client";
import axios from "axios";
import { useRequest } from "ahooks";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { generateID, isValidURL } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { openMenuSideBarAtom } from "@/recoils";
import { SlClose } from "react-icons/sl";
import UrlList from "./urlList";

function MenuContent({ inputValue, setInputValue, handleAdd }) {
  const handleGenerateURL = () => {
    const id = generateID();
    setInputValue(id);
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2 flex gap-2">
        <div className="flex rounded-sm bg-white overflow-hidden">
          <input
            className="p-2  w-full flex-1 outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Target url*"
            disabled
          />
          <div className="w-fit p-2">
            <button
              onClick={handleGenerateURL}
              className="bg-gray-500 text-sm p-1 rounded-full text-white"
            >
              Generate
            </button>
          </div>
        </div>
        <button className="px-2 bg-green-400 rounded-sm" onClick={handleAdd}>
          ADD
        </button>
      </div>
    </div>
  );
}

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
  const [urlListArr, setUrlListArr] = useState([]);
  const [openSideBar, setOpenSideBar] = useRecoilState(openMenuSideBarAtom);
  const router = useRouter();
  const pathname = usePathname();

  let toastId;

  const { data: urlList, refresh } = useRequest(getAllURL);
  const { runAsync } = useRequest(addURL, {
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

    toastId = toast.loading("Please wait...");
    runAsync({
      id: newValue,
    }).then(() => {
      toast.update(toastId, {
        render: "Added",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    });
  };

  useEffect(() => {
    if (openSideBar) {
      setOpenSideBar(false);
    }
  }, [pathname]);

  useEffect(() => {
    setUrlListArr(urlList?.data || []);
  }, [urlList?.data]);

  return (
    <>
      <AnimatePresence>
        {openSideBar && (
          <motion.main
            initial={{ opacity: 0, x: -500 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -500 }}
            className="p-4 w-full bg-gray-600 h-screen block lg:hidden absolute left-0 top-0"
          >
            <div className="w-full mb-4">
              <button
                className="text-white p-2"
                onClick={() => setOpenSideBar(false)}
              >
                <SlClose size={40} />
              </button>
            </div>
            <MenuContent
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleAdd={handleAdd}
            />
            <UrlList dataSource={urlListArr} refresh={refresh} />
          </motion.main>
        )}
      </AnimatePresence>
      <main className="hidden lg:block p-4 w-full bg-gray-600 h-screen md:w-[400px]">
        <MenuContent
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleAdd={handleAdd}
        />
        <UrlList dataSource={urlListArr} refresh={refresh} />
      </main>
    </>
  );
}

export default SideBar;
