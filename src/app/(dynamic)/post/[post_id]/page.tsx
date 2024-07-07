'use client';

import { useSession } from 'next-auth/react';
import { useContext } from 'react';
import { SystemContext } from '~/app/providers';
import Container from '~/components/Layouts/Container';
import SubmitCard from '~/components/Layouts/SubmitCard';
import PostCard from '~/components/Services/PostCard';
import { useComments, usePosts } from '~/libs/hooks';

const PostDetailPage = ({ params }: any) => {
  const { data: user }: any = useSession();

  const { data: posts, isLoading: postsLoading } = usePosts({
    request_id: user?.id ?? '',
    ids: params.post_id,
  });

  const { data: comments, isLoading: commentsLoading } = useComments({
    limit: 10,
    offset: 0,
    request_id: user?.id ?? '',
    post_id: params.post_id,
  });

  return (
    <>
      <Container  showAlertBefore={postsLoading || commentsLoading || posts?.error} setAlertLoading={!posts?.error} hideChild={postsLoading || commentsLoading || posts?.error} setAlertLabel={posts?.cause} showHeaderButton>
        <div className="flex flex-col min-[460px]:gap-3">
          <PostCard payload={posts?.data} />
          <SubmitCard type="comments" />
          <h1 className="px-3 py-2 text-[15px] font-bold max-[460px]:border-b">Komentar</h1>
          <div className="flex flex-col max-[460px]:divide-y min-[460px]:gap-3">
            {comments?.data?.comments.map((x: any, i: any) => <PostCard payload={x} asComment />)}
          </div>
        </div>
      </Container>
    </>
  );
};

export default PostDetailPage;
