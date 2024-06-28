import { Suspense, useEffect, useMemo, useState } from "react";
import { default as InfiniteScrollWrapper } from "react-infinite-scroll-component";

type InfiniteScrollType = {
  children: any;
  incomingData: Array<any>;
  loadMore: () => void;
};

const InfiniteScroll = (props: InfiniteScrollType) => {
  const [isItemData, setItemData] = useState<any>([]);

  useEffect(() => {
    setItemData((x: Array<any>) => x.concat(props.incomingData));
  }, [props.incomingData]);

  const RenderData = useMemo(
    () =>
      isItemData.map((x: any, i: any) => (
        <Suspense
          key={"meta-" + i + x?.ids}
          fallback={
            <div className="flex rounded-lg border p-4">
              <div className="loading m-auto"></div>
            </div>
          }
        >
          {props.children(x, i)}
        </Suspense>
      )),
    [isItemData],
  );

  return (
    <>
      <InfiniteScrollWrapper
        dataLength={isItemData.length}
        next={props.loadMore}
        hasMore={(props.incomingData?.length || 0) > 0}
        endMessage={
          <div className="flex rounded-lg border p-4">
            <div className="m-auto">Konten sudah habis.</div>
          </div>
        }
        loader={
          <div className="flex rounded-lg border p-4">
            <div className="loading m-auto"></div>
          </div>
        }
        className="flex flex-col gap-3"
      >
        {RenderData}
      </InfiniteScrollWrapper>
    </>
  );
};

export default InfiniteScroll;
