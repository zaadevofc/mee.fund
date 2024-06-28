import { Metadata } from "next";
import { SEO } from "~/consts";
import { BASE_URL_API, fetchJson } from "~/libs/hooks";
import { signJWT } from "~/libs/tools";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const page_id = decodeURIComponent(params.page_id);
  if (!page_id.startsWith("@")) return {
    title: page_id.replaceAll("-", " ").replace(/\b\w/g, match => match.toUpperCase()),
  };

  const token = await signJWT({ username: page_id.substring(1) }, 60);
  const res = await fetchJson(
    SEO.SITE_URL + BASE_URL_API.substring(1) + `/user/profile?token=${token}`,
  );

  if (!res?.data) return {};

  const title = `${res?.data?.name} (${page_id}) • MeeFund komunitas online`;

  return {
    title: {
      absolute: title,
    },
    description: `${res?.data?._count?.followers} Pengikut • ${res?.data?._count?.following} Mengikuti • ${res?.data?._count?.posts} Postingan • ${res?.data?.name} (${page_id}) di MeeFund: "${res?.data?.bio?.slice(0, 130).replace(/\n/gi, " ")}${res?.data?.bio.replace(/\n/gi, " ").length > 130 ? "..." : ""}"`,
    openGraph: {
      images:
        res?.data?.picture ??
        SEO.SITE_URL + "assets/defaults/thumbnails/empty-picture.webp",
    },
    twitter: {
      images:
        res?.data?.picture ??
        SEO.SITE_URL + "assets/defaults/thumbnails/empty-picture.webp",
    },
  };
}

export default function RootLayout({ children }: any) {
  return <>{children}</>;
}
