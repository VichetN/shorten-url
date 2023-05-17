import { RedirectPage } from "@/components/pages";
import { redirect, notFound } from "next/navigation";
import React from "react";

export default function Page({ params }) {
  const { itemId } = params;

  // const urlData = await getData({
  //   id: itemId,
  //   countryCode: location?.country_code,
  // });

  // if (urlData?.url) {
  //   let newUrl = urlData?.url;
  //   if (!newUrl?.includes("http")) {
  //     newUrl = `http://${newUrl}`;
  //   }
  //   redirect(newUrl);
  // } else {
  //   notFound();
  // }

  return <RedirectPage itemId={itemId} />;
}
