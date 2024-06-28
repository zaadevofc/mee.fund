import { Prisma } from "@prisma/client";
import { lazy, useContext, useEffect, useState } from "react";
import { SystemContext } from "~/app/providers";
import { FetchPostsType } from "~/libs/hooks";
import InfiniteScroll from "./InfiniteScroll";

const PostCard = lazy(() => import("./PostCard"));

type RenderPostsType = {
  category?: Prisma.NestedEnumPOST_CATEGORYFilter["equals"];
  options?: FetchPostsType["options"];
  username?: string;
};

const RenderPosts = (props: RenderPostsType) => {
  const { FetchPosts } = useContext(SystemContext);
  const [isOffset, setOffset] = useState(0);

  const fetchPosts: any = FetchPosts({
    category: props.category ?? "UMUM",
    options: props.options ?? "default",
    limit: 10,
    offset: isOffset,
    username: props.username ?? "",
  });

  console.log(fetchPosts.data);

  useEffect(() => {
    fetchPosts.refetch();
  }, [props.category, props.options]);

  const refetchData = async () => {
    await setOffset((x) => x + 10);
    await fetchPosts.refetch();
  };

  if (fetchPosts.isLoading)
    return (
      <div className="flex rounded-lg border p-4">
        <div className="loading m-auto"></div>
      </div>
    );

  return (
    <>
      <InfiniteScroll
        loadMore={refetchData}
        incomingData={fetchPosts.data?.data}
      >
        {(x: any, i: any) => (
          <PostCard
            payload={{
              post_id: x?.ids,
              name: x?.user.name,
              username: x?.user.username,
              picture: x?.user.picture,
              is_verified: x?.user.is_verified,
              category: x?.category,
              content: x?.content,
              media: x?.media.map((x: any) => x?.url),
              likes: x?._count.likes,
              comments: x?._count.comments,
              reposts: x?._count.reposts,
              bookmarks: x?._count.bookmarks,
              created_at: x?.created_at,
            }}
          />
        )}
      </InfiniteScroll>
    </>
  );
};

export default RenderPosts;
