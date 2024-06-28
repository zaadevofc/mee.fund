"use client";

import { notFound } from "next/navigation";
import { useState } from "react";
import FormInputCard from "~/components/FormInputCard";
import RenderPosts from "~/components/RenderPosts";
import TabOptions from "~/components/TabOptions";
import Wrapper from "~/components/Wrapper";
import UserDetailPage from "./UserDetailPage";
import { POST_CATEGORY } from "~/consts";

const tabs = [
  { label: "Untuk Kamu", value: "default" },
  { label: "Terbaru", value: "newest" },
];

const PostsPage = (props: any) => {
  const [isType, setType] = useState<any>("default");

  const page_id = decodeURIComponent(props.params.page_id) as string;
  if (page_id.startsWith("@")) return <UserDetailPage user_id={page_id} />;

  let categories = POST_CATEGORY.slice(1).map((x) => x.href.substring(1));
  if (!categories.includes(page_id.toLowerCase())) return notFound();

  return (
    <>
      <Wrapper>
        <TabOptions tabs={tabs} onTabsClick={setType} />
        <FormInputCard withCategory />
        {isType == "default" && <RenderPosts category={page_id.replaceAll('-', '_').toUpperCase() as any} />}
        {isType == "newest" && <RenderPosts category={page_id.replaceAll('-', '_').toUpperCase() as any} options="newest" />}
      </Wrapper>
    </>
  );
};

export default PostsPage;
