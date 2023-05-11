import { getDomain } from "@/utils";
import React from "react";

const getData = async () => {
  const data = await fetch("/api/hello").then((res) => res.json());
  return data;
};

export default async function Page({ params }) {
  const d = await getData();
  return (
    <div>
      {getDomain()}/{JSON.stringify(d, null, 2)}
    </div>
  );
}
