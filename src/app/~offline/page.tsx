'use client'

import { useRouter } from 'next/navigation';
import React from 'react';
import Cauntion from '~/components/Layouts/Cauntion';

const OfflinePages = () => {
  const router = useRouter();

  return (
    <>
      <Cauntion
        label="Kamu Sedang Offline 😞"
        message="Coba cek jaringan internet kamu. Pastikan WiFi atau data seluler menyala dengan benar. Jangan bersedih coba refresh halamanan."
        buttonLabel="Coba Refresh"
        buttonClick={() => router.refresh()}
      />
    </>
  );
};

export default OfflinePages;
