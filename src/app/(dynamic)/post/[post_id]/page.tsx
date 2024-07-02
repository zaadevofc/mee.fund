'use client';

import { useSession } from 'next-auth/react';
import { notFound, useRouter } from 'next/navigation';
import { useContext } from 'react';
import { SystemContext } from '~/app/providers';
import PostCard from '~/components/Layouts/PostCard';
import RenderComments from '~/components/Renders/RenderComments';
import Wrapper from '~/components/Layouts/Wrapper';
import PostsCard from '~/components/Layouts/PostsCard';
import HeaderButton from '~/components/Layouts/HeaderButton';

const PostDetailPage = ({ params }: any) => {
  const router = useRouter();
  const { FetchDetailPost } = useContext(SystemContext);
  const { data: user }: any = useSession();

  // const fetchDetailPost: any = FetchDetailPost({ ids: params.post_id });
  // console.log(fetchDetailPost.data);

  const textInfo: any = {
    NOT_FOUND: 'Postingan tidak ditemukan.',
    INTERNAL_SERVER_ERROR: 'Terjadi kesalahan sistem.',
    INVALID_QUERY: 'Terjadi kesalahan sistem.',
  };

  // const posted = fetchDetailPost.data && fetchDetailPost.data?.data;

  return (
    <>
      <Wrapper>
        <HeaderButton label="Kembali" />
        <div className="flex flex-col gap-5">
          <PostsCard columnStyle />
          {Array.from({ length: 5 }, (_, i) => (
            <PostsCard cleanStyle showSideOutline showSideDots allowCollapse>
              <div className="flex flex-col gap-5">
                {Array.from({ length: 2 }, (_, i) => (
                  <PostsCard cleanStyle showSideOutline showSideDots allowCollapse>
                    <div className="flex flex-col gap-5">
                      {Array.from({ length: 2 }, (_, i) => (
                        <PostsCard cleanStyle showSideOutline showSideDots allowCollapse>
                          <div className="flex flex-col gap-5">
                            {Array.from({ length: 2 }, (_, i) => (
                              <PostsCard cleanStyle showSideOutline showSideDots allowCollapse />
                            ))}
                          </div>
                        </PostsCard>
                      ))}
                    </div>
                  </PostsCard>
                ))}
              </div>
            </PostsCard>
          ))}
        </div>
      </Wrapper>
    </>
  );
};

export default PostDetailPage;
