"use client";

import { useState } from "react";
import FormInputCard from "~/components/FormInputCard";
import RenderPosts from "~/components/RenderPosts";
import TabOptions from "~/components/TabOptions";
import Wrapper from "~/components/Wrapper";

const tabs = [
  { label: "Untuk Kamu", value: "default" },
  { label: "Terbaru", value: "newest" },
];

const MetaMainPage = () => {
  const [isType, setType] = useState<any>("default");

  return (
    <>
      <Wrapper>
        <TabOptions tabs={tabs} onTabsClick={(x) => setType(x)} />
        <FormInputCard withCategory />
        {isType == "default" && <RenderPosts category="UMUM" />}
        {isType == "newest" && <RenderPosts category="UMUM" options="newest" />}
      </Wrapper>
    </>
  );
};

export default MetaMainPage;
