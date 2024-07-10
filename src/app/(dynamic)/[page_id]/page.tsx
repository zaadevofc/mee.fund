'use client';

import { notFound } from 'next/navigation';
import Container from '~/components/Layouts/Container';
import RenderPosts from '~/components/Renders/RenderPosts';
import { POST_CATEGORY } from '~/consts';
import UserDetailPage from './UserDetailPage';

const PostsPage = (props: any) => {
  const page_id = decodeURIComponent(props.params.page_id) as string;
  if (page_id.startsWith('@')) return <UserDetailPage user_id={page_id} />;

  let more = [{ href: '/populer' }, { href: '/trending' }] as any;
  let categories = POST_CATEGORY.concat(more).map(x => x.href.substring(1));
  let category = page_id.replaceAll('-', '_').toUpperCase() as any;
  if (!categories.includes(page_id.toLowerCase())) return notFound();

  return (
    <>
      <Container showHeaderButton headerButtonLabel={category.replace('_', ' ')}>
        <RenderPosts
          category={(POST_CATEGORY.some(x => x.label.replaceAll(' ', '_').toUpperCase() == category) && category) || undefined}
          type={category.toLowerCase()}
          random
        />
      </Container>
    </>
  );
};

export default PostsPage;
