import { useRouter } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";

const HeaderButton = ({ label }: Partial<{ label: string }>) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center gap-4 !p-3">
        <h1 onClick={() => router.back()} className="btn !btn-xs">
          <LuArrowLeft />
        </h1>
        <h1 className="font-semibold">{label}</h1>
      </div>
    </>
  );
};

export default HeaderButton;
