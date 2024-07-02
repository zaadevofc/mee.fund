import { Prisma } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { lazy, useContext, useCallback, useMemo, useState, useRef } from 'react';
import { SystemContext } from '~/app/providers';
import { FetchPostsType } from '~/libs/hooks';
import InfiniteScroll from '../Services/InfiniteScroll';

const PostCard = lazy(() => import('../Layouts/PostCard'));

type RenderPostsType = {
  category?: Prisma.NestedEnumPOST_CATEGORYFilter['equals'];
  options?: FetchPostsType['options'];
  username?: string;
};

const RenderPosts: React.FC<RenderPostsType> = ({ username = '' }) => {
  const { FetchPosts } = useContext(SystemContext);
  const [offset, setOffset] = useState(0);
  const postsRef = useRef<Map<string, any>>(new Map());
  const orderRef = useRef<string[]>([]);

  const { data: user }: any = useSession();
  const { data, isLoading, refetch }: any = FetchPosts({
    type: 'random',
    limit: 10,
    offset,
    request_id: user?.id,
    username,
  });

  const updatePosts = useCallback((newPosts: any[]) => {
    newPosts.forEach(post => {
      if (!postsRef.current.has(post?.id)) {
        orderRef.current.push(post?.id);
      }
      postsRef.current.set(post?.id, post);
    });
  }, []);

  useMemo(() => {
    if (data?.data?.posts) {
      updatePosts(data.data.posts);
    }
  }, [data, updatePosts]);

  const items = useMemo(() => orderRef.current.map(id => postsRef.current.get(id)).filter(Boolean), [data]);

  const fetchData = useCallback(async () => {
    setOffset(prev => prev + 10);
    await refetch();
  }, [refetch]);

  if (isLoading && items.length === 0) {
    return <div className="loading m-auto" />;
  }

  return (
    <InfiniteScroll items={items} hasMore={data?.data?.hasMore ?? false} loadMore={fetchData}>
      {(post: any) => (
        <PostCard
          key={post?.id}
          asComment
          payload={{
            post_id: post?.id,
            ids: post?.ids,
            name: post?.user.name,
            username: post?.user.username,
            picture: post?.user.picture,
            is_verified: post?.user.is_verified,
            category: post?.category,
            content: post?.content,
            media: post?.media.map(({ url, mimetype }: any) => ({ src: url, type: mimetype })),
            hasLike: post?.likes.length > 0,
            hasRepost: post?.reposts.length > 0,
            hasBookMark: post?.bookmarks.length > 0,
            likes: post?._count.likes,
            comments: post?._count.comments,
            reposts: post?._count.reposts,
            bookmarks: post?._count.bookmarks,
            created_at: post?.created_at,
            comment_content: post?.comments[0]?.content,
            comment_name: post?.comments[0]?.user?.name,
            comment_picture: post?.comments[0]?.user?.picture,
            comment_username: post?.comments[0]?.user?.username,
            comment_is_verified: post?.comments[0]?.user?.is_verified,
            comment_created_at: post?.comments[0]?.created_at,
          }}
        />
      )}
    </InfiniteScroll>
  );
};

export default RenderPosts;
