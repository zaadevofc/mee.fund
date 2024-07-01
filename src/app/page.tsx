'use client';

import { useState } from 'react';
import FormInputCard from '~/components/Layouts/SubmitCard';
import RenderPosts from '~/components/Renders/RenderPosts';
import TabOptions from '~/components/Layouts/HeaderTabs';
import Wrapper from '~/components/Layouts/Wrapper';

const tabs = [
  { label: 'Untuk Kamu', value: 'default' },
  { label: 'Terbaru', value: 'newest' },
];

const MainPage = () => {
  const [isType, setType] = useState<any>('default');

  return (
    <>
      <Wrapper>
        <TabOptions tabs={tabs} onTabsClick={x => setType(x)} />
        <FormInputCard inputMode="posts" />
        {/* {isType == 'default' && <RenderPosts category="UMUM" />}
        {isType == 'newest' && <RenderPosts category="UMUM" options="newest" />} */}
      </Wrapper>
    </>
  );
};

export default MainPage;
