import { UrlDetailPage } from "@/components/pages";
import { fetchDataByGet } from "@/utils";

const getURL = async (params) => {
  // const res = await axios.get(`${getDomain()}/api/url-workers`, {
  //   params: { ...params },
  // });

  const res = await fetch(
    fetchDataByGet("/api/url-workers", {
      ...params,
    }),
    {
      next: {
        revalidate: 20,
      },
    }
  ).then((res1) => res1.json());

  return res;
};

export default async function UrlPage({ params }) {
  const { slug } = params;
  const urlData = await getURL({ id: slug });

  return <UrlDetailPage urlData={urlData?.data} />;
}
