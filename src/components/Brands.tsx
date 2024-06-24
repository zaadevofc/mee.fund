import React from "react";
import { LuFastForward } from "react-icons/lu";

const Brands = ({ className }: { className?: string }) => {
  return (
    <>
      <div className={className + ` flex items-center gap-2 text-xl`}>
        <LuFastForward className="stroke-[3] stroke-primary" />
        <h1 className="font-bold">MeeFund</h1>
      </div>
    </>
  );
};

export default Brands;
