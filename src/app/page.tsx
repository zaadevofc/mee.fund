import React from "react";
import MetaMainPage from "./meta";
import { Metadata } from "next";
import { SEO } from "~/consts";

export const metadata: Metadata = {
  title: `Beranda | ${SEO.SITE_TITLE}`,
};

const MainPage = () => {
  return (
    <>
      <MetaMainPage />
    </>
  );
};

export default MainPage;
