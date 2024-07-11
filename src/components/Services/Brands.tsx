import React from 'react';
import { LuFastForward } from 'react-icons/lu';

const Brands = ({ className }: { className?: string }) => {
  return (
    <>
      <div className={className + ` flex items-center gap-2 text-xl`}>
        <LuFastForward className={className + " stroke-primary-500 flex-shrink-0 stroke-[2.6] text-2xl"} />
        <h1 className="font-bold">MeeFund</h1>
      </div>
    </>
  );
};

export default Brands;
