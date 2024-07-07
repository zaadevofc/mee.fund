'use client';

import { notFound } from 'next/navigation';
import Container from '~/components/Layouts/Container';
import RenderPosts from '~/components/Renders/RenderPosts';
import { POST_CATEGORY } from '~/consts';
import UserDetailPage from './UserDetailPage';

const PostsPage = (props: any) => {
  const page_id = decodeURIComponent(props.params.page_id) as string;
  if (page_id.startsWith('@')) return <UserDetailPage user_id={page_id} />;

  let categories = POST_CATEGORY.slice(1).map(x => x.href.substring(1));
  let category = page_id.replaceAll('-', '_').toUpperCase() as any;
  if (!categories.includes(page_id.toLowerCase())) return notFound();

  return (
    <>
      <Container showHeaderButton>
        <RenderPosts category={category} />
      </Container>
    </>
  );
};

export default PostsPage;
