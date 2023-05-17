import { isValidURL } from "@/utils";
import { useRequest } from "ahooks";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const updateDefaulURL = async (params) => {
  const res = await axios.put("/api/url-workers", { ...params });
  return res?.data;
};

function UpdateDefaultLink({ dataSource, refresh }) {
  const [defaultLink, setDefaultLink] = useState("");

  useEffect(() => {
    if (dataSource?.defaultLink) {
      setDefaultLink(dataSource?.defaultLink);
    }
  }, [dataSource?.defaultLink]);

  const { runAsync } = useRequest(updateDefaulURL, {
    manual: true,
    onSuccess: (res) => {
      if (res?.success) {
        refresh();
      }
    },
  });

  const handleSave = () => {
    if (defaultLink?.trim() === "") {
      return;
    }

    if (!isValidURL(defaultLink?.trim())) {
      toast.warn("Invalid url!");
      return;
    }

    let toastId = toast.loading("Please wait...");
    runAsync({
      id: dataSource?.id,
      defaultLink: defaultLink?.trim(),
    }).then(() => {
      toast.update(toastId, {
        render: "Default link updated",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    });
  };

  return (
    <div>
      <p className="text-gray-500">Default link:</p>
      <div className="flex gap-3 w-full">
        <input
          className="p-2 rounded-sm flex-1 outline-none"
          value={defaultLink}
          onChange={(e) => setDefaultLink(e.target.value)}
          placeholder="default link *"
        />

        <button className="px-2 bg-green-400 rounded-sm" onClick={handleSave}>
          SAVE
        </button>
      </div>
    </div>
  );
}

export default UpdateDefaultLink;
