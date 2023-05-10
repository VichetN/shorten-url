import Link from "next/link";
import { IoMdTrash } from "react-icons/io";

function UrlItem({ dataSource }) {
  return (
    <li className="  my-2 flex">
      <Link href={`/${dataSource}`} className="w-full">
        <div className="flex-1 p-3">
          <h3 className="w-full">{dataSource}</h3>
          <p className="text-gray-400">
            https://shortlink.com/fr/slug-datadfsdfafd
          </p>
        </div>
      </Link>
      <button className="px-4">
        <IoMdTrash size={20} />
      </button>
    </li>
  );
}

function UrlShortList() {
  return (
    <div className="py-4 ">
      <ul className="bg-white">
        {["France", "German", "Hong Kong"].map((load) => (
          <UrlItem key={load} dataSource={load} />
        ))}
      </ul>
    </div>
  );
}

export default UrlShortList;
