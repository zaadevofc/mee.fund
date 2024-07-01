'use client';

import { useRouter } from 'next/navigation';
import Cauntion from '~/components/Layouts/Cauntion';

export default function NotFound() {
  const router = useRouter();

  return (
    <Cauntion
      label="Upss Kamu Salah Alamat!"
      message="halaman ini tidak tersedia, kemungkinan sudah di hapus atau anda terjadi kesalahan saat menuliskan alamat."
      buttonLabel="Kembali"
      buttonClick={() => router.back()}
    />
  );
}
