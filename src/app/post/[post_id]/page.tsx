"use client";

import { notFound, useRouter } from "next/navigation";
import { useContext } from "react";
import { SystemContext } from "~/app/providers";
import PostCard from "~/components/PostCard";
import Wrapper from "~/components/Wrapper";

const PostDetailPage = ({ params }: any) => {
  const router = useRouter();
  const { FetchDetailPost } = useContext(SystemContext);

  const fetchDetailPost: any = FetchDetailPost({ ids: params.post_id });
  console.log(fetchDetailPost.data);
  if (
    ["NOT_FOUND", "INTERNAL_SERVER_ERROR", "INVALID_QUERY"].includes(
      fetchDetailPost.data?.error,
    )
  )
    return notFound();

  const posted = fetchDetailPost.data && fetchDetailPost.data?.data;

  return (
    <>
      <Wrapper loading={fetchDetailPost.isLoading} headerBackButton>
        <PostCard
          clean
          commentForm
          payload={{
            post_id: posted?.ids,
            name: posted?.user.name,
            username: posted?.user.username,
            picture: posted?.user.picture,
            is_verified: posted?.user.is_verified,
            category: posted?.category,
            content: posted?.content,
            media: posted?.media.map((x: any) => x?.url),
            likes: posted?._count.likes,
            comments: posted?._count.comments,
            reposts: posted?._count.reposts,
            bookmarks: posted?._count.bookmarks,
            created_at: posted?.created_at,
          }}
        />
      </Wrapper>
    </>
  );
};

export default PostDetailPage;
