'use client';

import Container from '~/components/Layouts/Container';
import Markdown from '~/components/Services/Markdown';

const PrivacyPage = () => {
  return (
    <>
      <Container>
        <Markdown
          className="text-[15px] p-3"
          text={`**Kebijakan Privasi MeeFund**

Terakhir diperbarui: 6 Juli 2024

**MeeFund** ("kami") berkomitmen untuk melindungi privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan membagikan informasi Anda saat Anda menggunakan situs web kami, https://mee.fund ("Situs").

**1. Informasi yang Kami Kumpulkan**

Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami saat Anda membuat akun, seperti nama, alamat email, dan informasi profil lainnya. Kami juga dapat mengumpulkan informasi tentang bagaimana Anda menggunakan Situs, termasuk data penggunaan dan analitik.


**2. Bagaimana Kami Menggunakan Informasi Anda**

Kami menggunakan informasi yang kami kumpulkan untuk tujuan berikut:
- Otentikasi, Identifikasi, dan Verifikasi: Untuk membuat dan mengelola akun Anda, serta untuk memverifikasi identitas Anda.
- Personalisasi: Untuk mempersonalisasi pengalaman Anda di Situs, seperti menampilkan konten yang relevan dengan minat Anda.
- Analisis: Untuk menganalisis bagaimana Situs digunakan dan untuk meningkatkan layanan kami.

**3. Bagaimana Kami Membagikan Informasi Anda**

Kami dapat membagikan informasi Anda dengan pihak ketiga dalam situasi berikut:
- Penyedia Layanan: Kami dapat membagikan informasi Anda dengan penyedia layanan pihak ketiga yang membantu kami mengoperasikan Situs dan menyediakan layanan kami.
- Login Sosial: Kami dapat membagikan informasi Anda dengan platform media sosial jika Anda memilih untuk masuk ke Situs menggunakan akun media sosial Anda (Google, GitHub, Discord).
- Kepatuhan Hukum: Kami dapat membagikan informasi Anda jika diwajibkan oleh hukum atau untuk melindungi hak, properti, atau keamanan kami atau orang lain.

**4. Keamanan Informasi Anda**

Kami mengambil langkah-langkah yang wajar untuk melindungi informasi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Namun, tidak ada metode transmisi atau penyimpanan elektronik yang 100% aman.

Kami tidak menyimpan kata sandi Anda.

**5. Penyimpanan Data**

Kami menyimpan informasi Anda di database kami selama akun Anda aktif. Jika Anda menghapus akun Anda, kami akan menghapus informasi Anda dari database kami.

**6. Perubahan pada Kebijakan Privasi Ini**

Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan apa pun dengan memposting Kebijakan Privasi baru di Situs.

**7. Hubungi Kami**

Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami **zaadevofc@gmail.com**.

**Informasi Tambahan**

- Kami menggunakan Google Analytics, Vercel, dan Splitbee untuk mengumpulkan data penggunaan dan analitik. Kebijakan privasi mereka dapat ditemukan di situs web masing-masing.
- Kebijakan Privasi ini diatur oleh hukum Indonesia.

Dengan menggunakan Situs, Anda menyetujui pengumpulan, penggunaan, dan pembagian informasi Anda sesuai dengan Kebijakan Privasi ini.`}
        />
      </Container>
    </>
  );
};

export default PrivacyPage;
