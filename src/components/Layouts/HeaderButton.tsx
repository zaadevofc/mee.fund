import { useRouter } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";

type HeaderButtonType = {
  label?:string;
}

const HeaderButton = (props: HeaderButtonType) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center gap-4 mb-3 max-[460px]:px-3">
        <button className="px-2 py-1 max-[460px]:border-none" onClick={() => router.back()}>
          <LuArrowLeft />
        </button>
        {props.label && <h1 className="font-bold">{props.label}</h1>}
      </div>
    </>
  );
};

export default HeaderButton;
