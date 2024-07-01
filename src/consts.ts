import { Metadata } from "next";
import {
  LuAccessibility,
  LuAward,
  LuBookMarked,
  LuCalendarHeart,
  LuCode2,
  LuFlower,
  LuGamepad2,
  LuHome,
  LuHotel,
  LuMedal,
  LuMonitorDot,
  LuPaintbrush,
  LuShare2,
  LuSiren,
  LuSmile
} from "react-icons/lu";

export const SEO = {
  SITE_URL: process.env.NODE_ENV === "development" ? 'http://localhost:3000/' : "https://mee.fund/",
  SITE_TITLE: "MeeFund - Komunitas kreatif yang penuh inovasi dan hiburan terbaik mu!",
  SITE_DESCRIPTION:
    "Panggung buat ide-idemu yang paling gokil. Mulai dari proyek kreatif, inovasi, sampai hiburan seru, semua bisa dapat tempat di MeeFund. Jadi, tunggu apa lagi? Saatnya unjuk gigi!",
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
  { icon: LuMonitorDot, label: "Coding", href: "/coding" },
  { icon: LuAward, label: "Pameran", href: "/pameran" },
  { icon: LuShare2, label: "Sharing", href: "/sharing" },
  { icon: LuAccessibility, label: "Tanya Sepuh", href: "/tanya-sepuh" },
  { icon: LuSmile, label: "Meme", href: "/meme" },
  { icon: LuGamepad2, label: "Gaming", href: "/gaming" },
  { icon: LuPaintbrush, label: "Karya Seni", href: "/karya-seni" },
  { icon: LuMedal, label: "Info Lomba", href: "/info-lomba" },
  { icon: LuHotel, label: "Info Lowongan", href: "/info-lowongan" },
]
