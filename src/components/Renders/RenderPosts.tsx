'use client';

import { useSession } from 'next-auth/react';
import { getManyPostsType } from '~/app/api/v1/posts/posts.service';
import { FetchPostsType, usePosts } from '~/libs/hooks';
import ChildAlerts from '../Services/ChildAlerts';
import PostCard from '../Services/PostCard';

type RenderPostsType = {
  type?: getManyPostsType['type'];
  category?: getManyPostsType['category'];
  options?: FetchPostsType['options'];
  username?: string;
};

const RenderPosts = (props: RenderPostsType) => {
  const { data: user }: any = useSession();
  const { data, isLoading } = usePosts({
    offset: 0,
    limit: 9999,
    request_id: user?.id ?? '',
    username: props.username,
    category: props.category,
    type: props.type,
  });

  if (isLoading) return <ChildAlerts loading />;
  if (!data?.data?.posts?.length) return <ChildAlerts label='Tidak ada postingan' />
  return (
    <>
      <div className="flex flex-col gap-3 max-[460px]:divide-y">{data?.data?.posts?.map((x: any) => (
        <PostCard payload={x} />
      ))}
      </div>
    </>
  );
};

export default RenderPosts;
