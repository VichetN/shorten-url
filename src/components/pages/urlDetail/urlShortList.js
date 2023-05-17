import { fetchDataByGet, getDomain } from "@/utils";
import { useRequest } from "ahooks";
import axios from "axios";
import Link from "next/link";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoMdTrash } from "react-icons/io";

const deleteShortUrl = async (params) => {
  const res = await axios.delete(
    fetchDataByGet("/api/short-url-workers", { ...params })
  );
  return res?.data;
};

function UrlItem({ dataSource, refresh }) {
  // const url = `${getDomain()}/${dataSource?.countryCode?.toLowerCase()}/${
  //   dataSource?.id
  // }`;

  const { run: runDelete, loading } = useRequest(deleteShortUrl, {
    manual: true,
    onSuccess: (res) => {
      if (res?.success) {
        refresh();
      }
    },
  });

  const handleDelete = () => {
    runDelete({
      id: dataSource?.id,
      originalUrlId: dataSource?.originalUrlId,
    });
  };

  return (
    <li className="my-2 flex flex-col md:flex-row">
      <div className="flex-1 p-4 w-full">
        <h3 className="w-full font-bold">{dataSource?.country}</h3>
        <Link href={dataSource?.targetLink} target="_blank" className="w-auto">
          <p className="text-gray-400 cursor-pointer hover:underline break-all">
            {dataSource?.targetLink}
          </p>
        </Link>
      </div>
      <button
        className="border md:border-none p-4 w-fit m-4 md:m-0"
        onClick={handleDelete}
      >
        {loading ? (
          <AiOutlineLoading3Quarters className="animate-spin" size={20} />
        ) : (
          <IoMdTrash size={20} />
        )}
      </button>
    </li>
  );
}

function UrlShortList({ targetLinks = [], refresh }) {
  return (
    <div className="py-4 w-full">
      <ul className="bg-white">
        {targetLinks?.map((load) => (
          <UrlItem key={load?.id} dataSource={load} refresh={refresh} />
        ))}
      </ul>
    </div>
  );
}

export default UrlShortList;
