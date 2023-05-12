import { useRequest } from "ahooks";
import Link from "next/link";
import { IoMdTrash } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import axios from "axios";
import { fetchDataByGet } from "@/utils";
import { useRouter, usePathname } from "next/navigation";

const deleteURL = async (params) => {
  const res = await axios.delete(
    fetchDataByGet("/api/url-workers", { ...params })
  );
  return res?.data;
};

function UrlItem({ dataSource, refresh }) {
  const pathname = usePathname();
  const router = useRouter();
  // delete url
  const { run: runDelete, loading } = useRequest(deleteURL, {
    manual: true,
    onSuccess: (res) => {
      if (res?.success) {
        refresh();
        if (pathname === `/${dataSource?.id}`) {
          router.replace("/");
        }
      }
    },
  });

  return (
    <li className=" bg-white my-2 flex">
      <Link href={`/${dataSource?.id}`} className="w-full">
        <div className="flex-1 p-3">
          <span className="w-full">{dataSource?.url}</span>
        </div>
      </Link>
      <button
        className="text-red-400 px-2"
        onClick={() => runDelete({ id: dataSource?.id })}
        disabled={loading}
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

function UrlList({ dataSource = [], refresh }) {
  return (
    <div className="py-4">
      <ul>
        {dataSource?.map((load) => (
          <UrlItem key={load?.id} dataSource={load} refresh={refresh} />
        ))}
      </ul>
    </div>
  );
}

export default UrlList;
