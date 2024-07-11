'use client';

import { useSession } from 'next-auth/react';
import { useContext, useEffect } from 'react';
import { SystemContext } from '~/app/providers';
import Container from '~/components/Layouts/Container';
import SubmitCard from '~/components/Layouts/SubmitCard';
import PostCard from '~/components/Services/PostCard';
import { useComments, usePosts } from '~/libs/hooks';

const PostDetailPage = ({ params }: any) => {
  const { data: user }: any = useSession();
  const { isSubmitFinish } = useContext(SystemContext);

  const { data: posts, isLoading: postsLoading } = usePosts({
    request_id: user?.id ?? '',
    ids: params.post_id,
  });

  const {
    data: comments,
    isLoading: commentsLoading,
    mutate: commentsMutate,
  } = useComments({
    limit: 10,
    offset: 0,
    request_id: user?.id ?? '',
    post_id: params.post_id,
  });

  useEffect(() => {
    if (isSubmitFinish) {
      commentsMutate();
    }
  }, [isSubmitFinish]);

  return (
    <>
      <Container
        showAlertBefore={postsLoading || commentsLoading || posts?.error}
        setAlertLoading={!posts?.error}
        hideChild={postsLoading || commentsLoading || posts?.error}
        setAlertLabel={posts?.cause}
        showHeaderButton
      >
        <div className="flex flex-col min-[460px]:gap-3">
          <PostCard type="posts" className="mb-3" payload={posts?.data} />
          <SubmitCard type="comments" open post_id={posts?.data?.ids} />
          <h1 className="p-3 text-[15px] font-bold max-[460px]:border-b">Komentar</h1>
          <div className="flex flex-col max-[460px]:divide-y">
            {comments?.data?.comments.map((x: any, i: any) => (
              <PostCard
                type="comments"
                payload={{ ...x, parent_id: x.id, post_id: posts?.data?.ids }}
                className="mt-2"
                asComment
                showReplyButton={!!x?.replies?.length}
              >
                <div className="flex flex-col gap-3 divide-y">
                  {x?.replies.map((y: any, j: any) => (
                    <div className="flex flex-col gap-3 divide-y">
                      <PostCard type="comments" payload={{ ...y, parent_id: x?.id, post_id: posts?.data?.ids }} className="mt-3" asComment cleanStyle />
                    </div>
                  ))}
                </div>
              </PostCard>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
};

export default PostDetailPage;
