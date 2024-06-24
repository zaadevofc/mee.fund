"use client";

import FormInputCard from "~/components/FormInputCard";
import PostCard from "~/components/PostCard";
import Wrapper from "~/components/Wrapper";

const MemePage = () => {
  return (
    <>
      <Wrapper>
        <div
          role="tablist"
          className="tabs-boxed tabs rounded-lg border bg-transparent"
        >
          <h1 role="tab" className="tab">
            Mengikuti
          </h1>
          <h1 role="tab" className="tab font-semibold text-primary">
            Untuk Kamu
          </h1>
          <h1 role="tab" className="tab">
            Sedang Trend
          </h1>
        </div>
        <FormInputCard />
        {Array.from({ length: 10 }).map((x) => (
          <PostCard />
        ))}
      </Wrapper>
    </>
  );
};

export default MemePage;
