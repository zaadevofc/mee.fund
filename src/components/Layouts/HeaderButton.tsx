import { useRouter } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";

type HeaderButtonType = {
  label?:string;
}

const HeaderButton = (props: HeaderButtonType) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center gap-4 p-2 max-[460px]:px-3 min-[460px]:rounded-xl min-[460px]:border w-fit">
        <button className="border-none p-0" onClick={() => router.back()}>
          <LuArrowLeft />
        </button>
        {props.label && <h1 className="font-semibold">{props.label}</h1>}
      </div>
    </>
  );
};

export default HeaderButton;
