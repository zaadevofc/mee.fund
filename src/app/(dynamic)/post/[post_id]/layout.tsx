import { Metadata } from "next";
import { SEO } from "~/consts";
import { BASE_URL_API, fetchJson } from "~/libs/hooks";
import { dayjs, signJWT } from "~/libs/tools";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const post = decodeURIComponent(params.post_id);
  const token = await signJWT({ ids: post }, 60);
  // const res = await fetchJson(
  //   SEO.SITE_URL + BASE_URL_API.substring(1) + `/post/detail?token=${token}`,
  // );

  const res = {} as any

  if (!res?.data) return {};

  const content = res?.data?.content?.slice(0, 130).replace(/\n/gi, " ");
  const title = `@${res?.data?.user?.username}${content.length > 0 ? ": " + content : ""} • MeeFund Komunitas Online`;

  return {
    title: {
      absolute: title,
    },
    description: `${res?.data?._count?.likes} Suka • ${res?.data?._count?.comments} Komentar • ${dayjs(res?.data?.created_at).format("DD MMMM YYYY")}: "${content}" • MeeFund Komunitas Online`,
    openGraph: {
      images: res?.data?.media[0]?.url,
    },
    twitter: {
      images: res?.data?.media[0]?.url,
    },
  };
}

export default function RootLayout({ children }: any) {
  return <>{children}</>;
}
