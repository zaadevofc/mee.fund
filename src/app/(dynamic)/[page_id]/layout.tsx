import { Metadata } from 'next';
import { getUserProfile } from '~/app/api/v1/users/users.service';
import { SEO } from '~/consts';
import { BASE_URL_API, fetchJson } from '~/libs/hooks';
import { signJWT } from '~/libs/tools';
import { cache } from 'react';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const user = decodeURIComponent(params.page_id);
  if (!user.startsWith('@'))
    return {
      title: user.replaceAll('-', ' ').replace(/\b\w/g, match => match.toUpperCase()),
    };

  const res = await cache(async () => await getUserProfile({ username: user.substring(1) }))() as any;

  if (!res) return {};

  const title = `${res?.name} (${user}) • MeeFund Komunitas Online`;

  return {
    title: {
      absolute: title,
    },
    description: `${res?._count?.followers} Pengikut • ${res?._count?.following} Mengikuti • ${res?._count?.posts} Postingan • ${res?.name} (${user}) di MeeFund: "${res?.bio?.slice(0, 130).replace(/\n/gi, ' ')}${res?.bio.replace(/\n/gi, ' ').length > 130 ? '...' : ''}"`,
    openGraph: {
      images: res?.picture ?? SEO.SITE_URL + 'assets/defaults/thumbnails/empty-picture.webp',
    },
    twitter: {
      images: res?.picture ?? SEO.SITE_URL + 'assets/defaults/thumbnails/empty-picture.webp',
    },
  };
}

export default function RootLayout({ children }: any) {
  return <>{children}</>;
}
