import { Toaster as ToasterWrapper } from 'react-hot-toast';

const Toaster = () => {
  return (
    <>
      <ToasterWrapper
        position="top-center"
        containerClassName="flex mx-auto w-full max-w-screen-xl"
        toastOptions={{
          className: 'border border-neutral-content !py-1',
          error: { className: 'border border-red-500 !py-1' },
          success: { className: 'border border-green-500 !py-1' },
          loading: { className: 'border border-blue-500 !py-1' },
          duration: 3000,
        }}
      />
    </>
  );
};

export default Toaster;
