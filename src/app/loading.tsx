import dayjs from "dayjs";
import Link from "next/link";
import Brands from "~/components/Brands";

const Loading = () => {
  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-dvh">
        <Brands className="!text-3xl animate-pulse m-auto" />
        <div className="fixed bottom-4 inset-x-0 flex flex-col mx-auto justify-center items-center">
          <h1 className="whitespace-nowrap text-[13px] opacity-60 mt-5">
            &copy; {dayjs().format("YYYY")} MeeFund by{" "}
            <strong>
              <Link href={"https://instagram.com/zaadevofc"} target="_blank">
                zaadevofc
              </Link>
            </strong>
          </h1>
        </div>
      </main>
    </>
  );
};

export default Loading;
