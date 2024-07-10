import React from 'react';
import Container from '~/components/Layouts/Container';
import RenderPosts from '~/components/Renders/RenderPosts';

const MainPage = () => {
  return (
    <>
      <Container>
        <RenderPosts random />
      </Container>
    </>
  );
};

export default MainPage;
