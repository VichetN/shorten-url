import { UrlDetailPage } from "@/components/pages";

export default function UrlPage({ params }) {
  const { slug } = params;

  return <UrlDetailPage slug={slug} />;
}
