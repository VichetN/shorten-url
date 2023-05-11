import Link from "next/link";
import { IoMdTrash } from "react-icons/io";

function UrlItem({ dataSource }) {
  return (
    <li className=" bg-white my-2 flex">
      <Link href={`/${dataSource?.id}`} className="w-full">
        <div className="flex-1 p-3">
          <span className="w-full">{dataSource?.url}</span>
        </div>
      </Link>
      <button className="text-red-400 px-2">
        <IoMdTrash size={20} />
      </button>
    </li>
  );
}

function UrlList({dataSource = []}) {
  return (
    <div className="py-4">
      <ul>
        {dataSource?.map((load) => (
          <UrlItem key={load?.id} dataSource={load} />
        ))}
      </ul>
    </div>
  );
}

export default UrlList;
