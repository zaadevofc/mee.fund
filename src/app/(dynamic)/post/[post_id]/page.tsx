'use client';

import { useSession } from 'next-auth/react';
import { notFound, useRouter } from 'next/navigation';
import { useContext } from 'react';
import { SystemContext } from '~/app/providers';
import PostCard from '~/components/PostCard';
import RenderComments from '~/components/RenderComments';
import Wrapper from '~/components/Layouts/Wrapper';

const PostDetailPage = ({ params }: any) => {
  const router = useRouter();
  const { FetchDetailPost } = useContext(SystemContext);
  const { data: user }: any = useSession();

  const fetchDetailPost: any = FetchDetailPost({ ids: params.post_id });
  console.log(fetchDetailPost.data);

  const textInfo: any = {
    NOT_FOUND: 'Postingan tidak ditemukan.',
    INTERNAL_SERVER_ERROR: 'Terjadi kesalahan sistem.',
    INVALID_QUERY: 'Terjadi kesalahan sistem.',
  };

  const posted = fetchDetailPost.data && fetchDetailPost.data?.data;

  return (
    <>
      <Wrapper
        loading={fetchDetailPost.isLoading}
        headerBackButton
        childAlert={textInfo?.[fetchDetailPost.data?.error]}
        hideChild={fetchDetailPost.data?.error}
      >
        <PostCard
          clean
          commentForm
          payload={{
            post_id: posted?.id,
            ids: posted?.ids,
            name: posted?.user.name,
            username: posted?.user.username,
            picture: posted?.user.picture,
            is_verified: posted?.user.is_verified,
            category: posted?.category,
            content: posted?.content,
            media: posted?.media.map((x: any) => x?.url),
            hasLike: posted?.likes.some((x: any) => x?.user?.id == user?.id),
            hasRepost: posted?.reposts.some((x: any) => x?.user?.id == user?.id),
            hasBookMark: posted?.bookmarks.some((x: any) => x?.user?.id == user?.id),
            likes: posted?._count.likes,
            comments: posted?._count.comments,
            reposts: posted?._count.reposts,
            bookmarks: posted?._count.bookmarks,
            created_at: posted?.created_at,
          }}
        />
        <RenderComments post_id={params.post_id} />
      </Wrapper>
    </>
  );
};

export default PostDetailPage;
