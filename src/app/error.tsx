'use client';

import { useEffect } from 'react';
import Cauntion from '~/components/Layouts/Cauntion';

 const Error = ({ error, reset }: any) =>{

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Cauntion
      label={`Terjadi ${error.name} Sistem!`}
      message={error.message}
      buttonLabel="Coba Reset Halaman"
      buttonClick={reset}
    />
  );
}

export default Error;