import { v4 as uuidv4 } from "uuid";
import kv from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // const data = await kv.lrange("urlList", 0, -1);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let data;

    if (id) {
      const urlList = await kv.json.get("urlListData");
      data = urlList.find((item) => item.id === id);
    } else {
      data = await kv.json.get("urlListData");
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
    const { url } = await req.json();

    const urlList = await kv.json.get("urlListData");
    const newUrl = { id: uuidv4(), url };
    const newUrlList = [...(urlList || []), newUrl];

    await kv.json.set("urlListData", "$", newUrlList);

    return NextResponse.json({ msg: "ok", data: newUrl });
  } catch (error) {
    // Handle errors
    return NextResponse.json({ msg: error.message });
  }
  //   const res = await kv.hset(`url:${uuidv4()}`);
  //   return NextResponse.json(res);
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    // const { id } = await req.json();

    if (id) {
      const urlList = await kv.json.get("urlListData");
      const data = urlList.filter((item) => item.id !== id);
      await kv.json.set("urlListData", "$", data);
    }

    return NextResponse.json({ msg: "ok", success: true });
  } catch (error) {
    // Handle errors
    return NextResponse.json({ msg: error.message });
  }
  //   const res = await kv.hset(`url:${uuidv4()}`);
  //   return NextResponse.json(res);
}
