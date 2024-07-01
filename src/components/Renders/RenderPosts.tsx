import { Prisma } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { lazy, useContext, useEffect, useState } from 'react';
import { SystemContext } from '~/app/providers';
import { FetchPostsType } from '~/libs/hooks';
import InfiniteScroll from '../Services/InfiniteScroll';

const PostCard = lazy(() => import('../Layouts/PostCard'));

type RenderPostsType = {
  category?: Prisma.NestedEnumPOST_CATEGORYFilter['equals'];
  options?: FetchPostsType['options'];
  username?: string;
};

const RenderPosts = (props: RenderPostsType) => {
  const { FetchPosts, reqRefecth, setReqRefecth } = useContext(SystemContext);
  const [isOffset, setOffset] = useState(0);
  const { data: user }: any = useSession();

  const fetchPosts: any = FetchPosts({
    category: props.category ?? 'UMUM',
    type: 'random',
    limit: 99999999,
    offset: isOffset,
    username: props.username ?? '',
  });

  console.log({ posts: fetchPosts.data?.data });

  useEffect(() => {
    if (reqRefecth == 'post') {
      refetchData();
      setReqRefecth!('-');
    }
    refetchData();
  }, [props.category, props.options, reqRefecth]);

  const refetchData = async () => {
    // await setOffset(x => x + fetchPosts.data?.data.length);
    await fetchPosts.refetch();
  };

  if (fetchPosts.isLoading)
    return (
      <div className="flex p-4">
        <div className="loading m-auto"></div>
      </div>
    );

  return (
    <>
      <InfiniteScroll loadMore={refetchData} incomingData={fetchPosts.data?.data}>
        {(x: any, i: any) => (
          <PostCard
            asComment
            payload={{
              post_id: x?.id,
              ids: x?.ids,
              name: x?.user.name,
              username: x?.user.username,
              picture: x?.user.picture,
              is_verified: x?.user.is_verified,
              category: x?.category,
              content: x?.content,
              media: x?.media.map((x: any) => x?.url),
              hasLike: x?.likes.some((x: any) => x?.user?.id == user?.id),
              hasRepost: x?.reposts.some((x: any) => x?.user?.id == user?.id),
              hasBookMark: x?.bookmarks.some((x: any) => x?.user?.id == user?.id),
              likes: x?._count.likes,
              comments: x?._count.comments,
              reposts: x?._count.reposts,
              bookmarks: x?._count.bookmarks,
              created_at: x?.created_at,
              comment_content: x?.comments[0]?.content,
              comment_name: x?.comments[0]?.user?.name,
              comment_picture: x?.comments[0]?.user?.picture,
              comment_username: x?.comments[0]?.user?.username,
              comment_is_verified: x?.comments[0]?.user?.is_verified,
              comment_created_at: x?.comments[0]?.created_at,
            }}
          />
        )}
      </InfiniteScroll>
    </>
  );
};

export default RenderPosts;
