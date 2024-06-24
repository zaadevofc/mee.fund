import { useRouter } from "next/navigation";
import React from "react";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { LuArrowLeft } from "react-icons/lu";

const BackHeaderButton = ({ label }: any) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center gap-4 mb-2">
        <h1 onClick={() => router.back()} className="btn btn-xs">
          <LuArrowLeft />
        </h1>
        <h1 className="font-semibold">{label}</h1>
        <div className="btn btn-ghost btn-xs ml-auto">
          <IoEllipsisHorizontal />
        </div>
      </div>
    </>
  );
};

export default BackHeaderButton;
