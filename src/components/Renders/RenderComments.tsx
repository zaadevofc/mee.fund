import { lazy, useContext, useEffect, useState } from 'react';
import { SystemContext } from '~/app/providers';
import InfiniteScroll from '../Services/InfiniteScroll';
import { useSession } from 'next-auth/react';

const PostCard = lazy(() => import('../Layouts/PostCard'));

type RenderCommentsType = {
  post_id: string;
};

const RenderComments = (props: RenderCommentsType) => {
  const { FetchComments, reqRefecth, setReqRefecth } = useContext(SystemContext);
  const [isOffset, setOffset] = useState(0);

  const { data: user }: any = useSession();

  const fetchComments: any = FetchComments({
    limit: 99999999,
    offset: isOffset,
    post_id: props.post_id ?? '',
  });

  useEffect(() => {
    if (reqRefecth == 'comment') {
      refetchData();
      setReqRefecth!('-');
    }
  }, [reqRefecth]);

  const refetchData = async () => {
    // await setOffset(x => x + fetchComments.data?.data.length);
    await fetchComments.refetch();
  };

  if (fetchComments.isLoading)
    return (
      <div className="flex p-4">
        <div className="loading m-auto"></div>
      </div>
    );

  return (
    <>
      <InfiniteScroll loadMore={refetchData} incomingData={fetchComments.data?.data}>
        {(x: any, i: any) => (
          <PostCard
            // asComment
            payload={{
              post_id: x?.id,
              ids: x?.ids,
              name: x?.user.name,
              username: x?.user.username,
              picture: x?.user.picture,
              is_verified: x?.user.is_verified,
              content: x?.content,
              media: x?.media.map((x: any) => x?.url),
              hasLike: x?.likes.some((x: any) => x?.user?.id == user?.id),
              likes: x?._count.likes,
              comments: x?._count.replies,
              created_at: x?.created_at,
            }}
          />
        )}
      </InfiniteScroll>
    </>
  );
};

export default RenderComments;
