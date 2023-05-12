import { v4 as uuidv4 } from "uuid";
import kv from "@vercel/kv";
import { NextResponse } from "next/server";
import shortUUID from "short-uuid";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let data;

    if (id) {
      const urlList = await kv.json.get("urlListData");

      let copyShortLinks = urlList?.map((e) => e?.shortLinks);
      copyShortLinks = copyShortLinks?.flat();

      const shortUrl = copyShortLinks?.find((e) => e?.id === id);
      const originalUrl = urlList?.find((e) => e?.id === shortUrl?.originalUrlId);

      data = originalUrl;
    }

    // const data = await kv.del("urlListData");

    return NextResponse.json({ msg: "ok", data });
  } catch (error) {
    // Handle errors
    return NextResponse.json({ msg: error.message });
  }
}

export async function POST(req) {
  try {
    const { id, countryCode, country } = await req.json();

    const shortId = shortUUID.generate();
    const shortUrl = `${
      process.env.NEXT_PUBLIC_API_URL
    }/${countryCode?.toLowerCase()}/${shortId}`;

    const newShortURL = {
      id: shortId,
      shortUrl,
      country,
      countryCode,
      originalUrlId: id,
    };

    let urlList = await kv.json.get("urlListData");
    const urlIndex = urlList?.findIndex((e) => e?.id === id);

    const newShortLinks = [
      ...(urlList[urlIndex]?.shortLinks || []),
      newShortURL,
    ];

    const newUrl = { ...urlList[urlIndex], shortLinks: [...newShortLinks] };
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

      const newShortLinks = [
        ...(urlList[urlIndex]?.shortLinks || []).filter((e) => e?.id !== id),
      ];
      const newUrl = { ...urlList[urlIndex], shortLinks: [...newShortLinks] };
      urlList?.splice(urlIndex, 1, newUrl);

      await kv.json.set("urlListData", "$", urlList);
    }

    return NextResponse.json({ msg: "ok", success: true });
  } catch (error) {
    // Handle errors
    return NextResponse.json({ msg: error.message });
  }
}
