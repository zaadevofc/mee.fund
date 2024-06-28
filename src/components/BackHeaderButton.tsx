import { useRouter } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";

const BackHeaderButton = ({ label }: Partial<{ label: string }>) => {
  const router = useRouter();

  return (
    <>
      <div className="mb-2 flex items-center gap-4">
        <h1 onClick={() => router.back()} className="btn btn-xs">
          <LuArrowLeft />
        </h1>
        <h1 className="font-semibold">{label}</h1>
        {/* <div className="btn btn-ghost btn-xs ml-auto">
          <IoEllipsisHorizontal />
        </div> */}
      </div>
    </>
  );
};

export default BackHeaderButton;
