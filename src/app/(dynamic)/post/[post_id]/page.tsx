'use client';

import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useContext, useEffect } from 'react';
import { SystemContext } from '~/app/providers';
import SubmitCard from '~/components/Layouts/SubmitCard';
import Wrapper from '~/components/Layouts/Wrapper';

const PostsCard = dynamic(() => import('~/components/Layouts/PostsCard'));
const RenderComments = dynamic(() => import('~/components/Renders/RenderComments'));

const PostDetailPage = ({ params }: any) => {
  const { FetchDetailPost, initTempPosts, setInitTempPosts } = useContext(SystemContext);
  const { data: user }: any = useSession();

  const { data }: any = FetchDetailPost({
    request_id: user?.id,
    ids: params.post_id,
  });

  useEffect(() => {
    setInitTempPosts!((x: any) => [...(x || []), data?.data]);
  }, [data]);

  const temp = initTempPosts?.find((post: any) => post?.ids == params.post_id);

  return (
    <>
      <Wrapper>
        <div className="flex flex-col">
          <PostsCard payload={temp ?? data?.data} type="posts" columnStyle cleanStyle />
          <div className="flex flex-col gap-6">
            <SubmitCard type="comments" post_id={params.post_id} />
            <RenderComments post_id={params.post_id} />
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default PostDetailPage;
