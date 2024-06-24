import { Metadata } from "next";
import {
  LuBookMarked,
  LuCode2,
  LuGamepad2,
  LuHome,
  LuHotel,
  LuMedal,
  LuPaintbrush,
  LuSiren,
  LuSmile
} from "react-icons/lu";

export const SEO = {
  SITE_URL: "https://mee.fund/",
  SITE_TITLE: "MeeFund - Cari hal seru sambil cari ilmu!",
  SITE_DESCRIPTION:
    "MeeFund media sosial edukasi yang seru dan asik. Kontribusi atau Cari hal seru sambil cari ilmu! Buat hiburan dan keseruan lainnya hanya di MeeFund!",
  SITE_AUTHORS: [
    { name: "zaadevofc", url: "https://zaadevofc.tech" },
    { name: "zaadevofc", url: "https://instagram.com/zaadevofc" },
  ],
  SITE_CREATOR: "zaadevofc",
  SITE_CREATOR_EMAIL: "zaadevofc@gmail.com",
  SITE_CATEGORY: "social media",
  SITE_KEYWORDS: [
    "meefund",
    "mee",
    "fund",
    "sosmed",
    "media sosial",
    "sosial media",
    "pendidikan",
    "edukasi",
    "meme",
    "fun",
    "indo",
    "indonesia",
  ],
};

export const METADATA: Metadata = {
  title: {
    default: SEO.SITE_TITLE,
    template: `%s | ${SEO.SITE_TITLE}`,
  },
  description: SEO.SITE_DESCRIPTION,
  authors: SEO.SITE_AUTHORS,
  creator: SEO.SITE_CREATOR,
  category: SEO.SITE_CATEGORY,
  keywords: SEO.SITE_KEYWORDS,
  appLinks: { web: { url: SEO.SITE_URL } },
  alternates: { canonical: SEO.SITE_URL },
  applicationName: SEO.SITE_TITLE,
  bookmarks: SEO.SITE_URL,
  publisher: SEO.SITE_CREATOR,
  openGraph: {
    url: SEO.SITE_URL,
    siteName: SEO.SITE_TITLE,
    ttl: 60,
    type: "website",
    countryName: "Indonesia",
    description: SEO.SITE_DESCRIPTION,
    title: SEO.SITE_TITLE,
    emails: SEO.SITE_CREATOR_EMAIL,
    images: SEO.SITE_URL + "assets/defaults/seo/android-chrome-512x512.png",
  },
  twitter: {
    site: SEO.SITE_TITLE,
    siteId: SEO.SITE_TITLE,
    title: SEO.SITE_TITLE,
    description: SEO.SITE_DESCRIPTION,
    creator: SEO.SITE_CREATOR,
    images: SEO.SITE_URL + "assets/defaults/seo/android-chrome-512x512.png",
    creatorId: SEO.SITE_CREATOR,
    card: "summary_large_image",
  },
};

export const RAINBOW_TEXT = [
  "meefund",
  "mantra",
  "pelangi",
  "rainbow",
  "indonesia"
]

export const POST_CATEGORY = [
  { icon: LuHome, label: "Beranda", href: "/" },
  { icon: LuBookMarked, label: "Pendidikan", href: "/pendidikan" },
  { icon: LuSiren, label: "Fakta Menarik", href: "/fakta-menarik" },
  { icon: LuCode2, label: "Coding", href: "/coding" },
  { icon: LuGamepad2, label: "Gaming", href: "/gaming" },
  { icon: LuSmile, label: "Meme", href: "/meme" },
  { icon: LuPaintbrush, label: "Karya Seni", href: "/karya-seni" },
  { icon: LuMedal, label: "Info Lomba", href: "/info-lomba" },
  { icon: LuHotel, label: "Info Lowongan", href: "/info-lowongan" },
]
