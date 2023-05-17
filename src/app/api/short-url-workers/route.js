import { v4 as uuidv4 } from "uuid";
import kv from "@vercel/kv";
import { NextResponse } from "next/server";
import { getLocationByIP } from "@/utils";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let findLink;
    let location;

    if (id) {
      location = await getLocationByIP();

      const urlList = await kv.json.get("urlListData");
      const currentUrl = urlList?.find((e) => e?.id === id);
      findLink = currentUrl?.defaultLink;

      const findTargetLink = (currentUrl?.targetLinks || [])?.find(
        (e) => e?.countryCode === location?.country_code
      );
      if (findTargetLink) {
        findLink = findTargetLink?.targetLink;
      }
    }

    return NextResponse.json({ msg: "ok", data: { url: findLink, location } });
  } catch (error) {
    // Handle errors
    return NextResponse.json({ msg: error.message });
  }
}

export async function POST(req) {
  try {
    const { id, countryCode, country, targetLink } = await req.json();

    const targetId = uuidv4();
    // const shortUrl = `${
    //   process.env.NEXT_PUBLIC_API_URL
    // }/${countryCode?.toLowerCase()}/${targetId}`;

    const newTargetURL = {
      id: targetId,
      targetLink,
      country,
      countryCode,
      originalUrlId: id,
    };

    let urlList = await kv.json.get("urlListData");
    const urlIndex = urlList?.findIndex((e) => e?.id === id);

    const newTargetLinks = [
      ...(urlList[urlIndex]?.targetLinks || []),
      newTargetURL,
    ];

    const newUrl = { ...urlList[urlIndex], targetLinks: [...newTargetLinks] };
    urlList?.splice(urlIndex, 1, newUrl);

    await kv.json.set("urlListData", "$", urlList);

    return NextResponse.json({
      msg: "ok",
      success: true,
    });
  } catch (error) {
    // Handle errors
    return NextResponse.json({ msg: error.message });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const originalUrlId = searchParams.get("originalUrlId");
    let urlList;

    if (id && originalUrlId) {
      urlList = await kv.json.get("urlListData");

      const urlIndex = urlList?.findIndex((item) => item.id === originalUrlId);

      const newTargetLinks = [
        ...(urlList[urlIndex]?.targetLinks || []).filter((e) => e?.id !== id),
      ];
      const newUrl = { ...urlList[urlIndex], targetLinks: [...newTargetLinks] };
      urlList?.splice(urlIndex, 1, newUrl);

      await kv.json.set("urlListData", "$", urlList);
    }

    return NextResponse.json({ msg: "ok", success: true });
  } catch (error) {
    // Handle errors
    return NextResponse.json({ msg: error.message });
  }
}
