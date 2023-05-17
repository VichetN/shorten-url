import { UrlDetailPage } from "@/components/pages";

// export async function generateStaticParams() {
//   const res = await fetch(fetchDataByGet("/api/url-workers")).then((res1) =>
//     res1.json()
//   );
//   return res?.data?.map((load) => ({
//     slug: String(load?.id),
//   }));
// }

// const getURL = async (params) => {
//   const res = await fetch(
//     fetchDataByGet("/api/url-workers", {
//       ...params,
//     }),
//     {
//       next: {
//         revalidate: 20,
//       },
//     }
//   ).then((res1) => res1.json());

//   return res;
// };

export default async function UrlPage({ params }) {
  const { slug } = params;

  return <UrlDetailPage slug={slug} />;
}
