import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useContext, useMemo, useState } from 'react';
import { getManyPostsType } from '~/app/api/v1/posts/posts.service';
import { SystemContext } from '~/app/providers';
import { FetchPostsType } from '~/libs/hooks';
import ChildLoading from '../Services/ChildLoading';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useWindowWidth } from '@react-hook/window-size';

const PostsCard = dynamic(() => import('../Layouts/PostsCard'));

type RenderPostsType = {
  type?: getManyPostsType['type'];
  category?: getManyPostsType['category'];
  options?: FetchPostsType['options'];
  username?: string;
};

const RenderPosts = (props: RenderPostsType) => {
  const { FetchPosts, makePlaceholder, setMakePlaceholder, setInitTempPosts, initTempPosts } = useContext(SystemContext);
  const [offset, setOffset] = useState(0);
  const [items, setItems] = useState<Array<any>>([]);
  const windowWidth = useWindowWidth();

  const { data: user }: any = useSession();
  const { data, isLoading, refetch }: any = FetchPosts({
    offset,
    limit: 9999,
    request_id: user?.id ?? '',
    username: props.username,
    category: props.category,
    type: props.type,
  });

  useMemo(() => {
    if (data?.data?.posts) {
      setInitTempPosts!((x: any) => [...(new Set([...(x || []), ...data.data.posts]) as any)]);
    }
  }, [data?.data?.posts]);

  if (isLoading && data?.data?.posts?.length === 0) return <ChildLoading />;
  return <>{initTempPosts?.map((x: any, i: any) => <PostsCard payload={x} type="posts" allowLinked cleanStyle columnStyle={windowWidth < 490} showSideOutline={windowWidth > 490} showHighlight />)}</>;
};

export default RenderPosts;
