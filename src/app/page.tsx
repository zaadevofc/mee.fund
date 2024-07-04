'use client';

import dynamic from 'next/dynamic';
import Wrapper from '~/components/Layouts/Wrapper';

const RenderPosts = dynamic(() => import('~/components/Renders/RenderPosts'));

const MainPage = () => {
  return (
    <>
      <Wrapper>
        <RenderPosts />
      </Wrapper>
    </>
  );
};

export default MainPage;
