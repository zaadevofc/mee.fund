import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SystemContext } from '~/app/providers';
import ChildLoading from '../Services/ChildLoading';
import InfiniteScroll from '../Services/InfiniteScroll';

const PostsCard = dynamic(() => import('../Layouts/PostsCard'));

type RenderCommentsType = {
  post_id: string;
};

const RenderComments = (props: RenderCommentsType) => {
  const { FetchCommentsPost, makePlaceholder, setMakePlaceholder, setInitTempComments, initTempComments } = useContext(SystemContext);
  const [offset, setOffset] = useState(0);
  const postsRef = useRef<Map<string, any>>(new Map());
  const orderRef = useRef<string[]>([]);

  const { data: user }: any = useSession();
  const { data, isLoading, refetch }: any = FetchCommentsPost({
    offset,
    limit: 5,
    post_id: props.post_id,
    request_id: user?.id ?? '',
  });

  const sortComments = (comments: Array<any>) => {
    const sort = (arr: any) => {
      arr.sort((a: any, b: any) => b.created_at - a.created_at);
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].replies?.length > 0) {
          sort(arr[i].replies);
        }
      }
      return arr;
    };
    return sort([...comments]);
  };

  const updatePosts = useCallback((newPosts: any[]) => {
    newPosts.forEach(post => {
      if (!postsRef.current.has(post?.id)) {
        orderRef.current.push(post?.id);
      }
      postsRef.current.set(post?.id, post);
    });
  }, []);

  useMemo(() => {
    if (data?.data?.comments) {
      updatePosts(data.data.comments);
    }
  }, [data, updatePosts]);

  const items = useMemo(() => orderRef.current.map(id => postsRef.current.get(id)).filter(Boolean), [data]);

  const fetchData = useCallback(async () => {
    setOffset(prev => prev + 5);
    await refetch();
  }, [refetch]);

  useEffect(() => {
    setInitTempComments!(items);
    setMakePlaceholder!([]);
  }, [isLoading, data]);

  if (isLoading && items.length === 0) return <ChildLoading />;

  return (
    <div className='max-[490px]:px-3'>
      <InfiniteScroll items={sortComments(initTempComments.length > 0 ? initTempComments : items)} hasMore={data?.data?.hasMore ?? false} loadMore={fetchData}>
        {(post: any, i: any) => (
          <>
            <PostsCard
              type="comments"
              cleanStyle
              allowCollapse
              hideNotCommentActions
              showSideDots={items?.length != i + 1 || post?.replies?.length > 0}
              showSideOutline={items?.length != i + 1 || post?.replies?.length > 0}
              payload={post}
            >
              {post?.replies?.map((re1: any, i: any) => (
                <div className="flex flex-col gap-3">
                  <PostsCard
                    type="comments"
                    cleanStyle
                    allowCollapse
                    hideNotCommentActions
                    showSideDots={post?.replies?.length != i + 1 || re1?.replies?.length > 0}
                    showSideOutline={post?.replies?.length != i + 1 || re1?.replies?.length > 0}
                    payload={{ ...re1, parent_id: re1?.id }}
                  >
                    {re1?.replies?.map((re2: any, i: any) => (
                      <div className="flex flex-col gap-3">
                        <PostsCard
                          type="comments"
                          cleanStyle
                          allowCollapse
                          hideNotCommentActions
                          showSideDots={re1?.replies?.length != i + 1 || re2?.replies?.length > 0}
                          showSideOutline={re1?.replies?.length != i + 1 || re2?.replies?.length > 0}
                          payload={{ ...re2, parent_id: re1?.id }}
                        />
                      </div>
                    ))}
                  </PostsCard>
                </div>
              ))}
            </PostsCard>
          </>
        )}
      </InfiniteScroll>
    </div>
  );
};

export default RenderComments;
