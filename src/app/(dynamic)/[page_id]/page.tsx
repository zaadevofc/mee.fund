'use client';

import { notFound } from 'next/navigation';
import Wrapper from '~/components/Layouts/Wrapper';
import { POST_CATEGORY } from '~/consts';
import UserDetailPage from './UserDetailPage';
import dynamic from 'next/dynamic';

const RenderPosts = dynamic(() => import('~/components/Renders/RenderPosts'));

const PostsPage = (props: any) => {
  const page_id = decodeURIComponent(props.params.page_id) as string;
  if (page_id.startsWith('@')) return <UserDetailPage user_id={page_id} />;

  let categories = POST_CATEGORY.slice(1).map(x => x.href.substring(1));
  let category = page_id.replaceAll('-', '_').toUpperCase() as any;
  if (!categories.includes(page_id.toLowerCase())) return notFound();

  return (
    <>
      <Wrapper>
        <RenderPosts category={category} />
      </Wrapper>
    </>
  );
};

export default PostsPage;
