import { Toaster as ToasterWrapper } from 'react-hot-toast';

const Toaster = () => {
  return (
    <>
      <ToasterWrapper
        position="top-center"
        toastOptions={{
          className: 'border border-neutral-content !py-1',
          error: { className: 'border border-red-300 !py-1' },
          success: { className: 'border border-green-300 !py-1' },
          loading: { className: 'border border-blue-300 !py-1' },
          duration: 3000,
        }}
      />
    </>
  );
};

export default Toaster;
