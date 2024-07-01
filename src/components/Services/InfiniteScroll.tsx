import { Suspense, useEffect, useMemo, useState } from "react";
import { default as InfiniteScrollWrapper } from "react-infinite-scroll-component";

type InfiniteScrollType = {
  children: any;
  incomingData: Array<any>;
  loadMore: () => void;
};

const InfiniteScroll = (props: InfiniteScrollType) => {
  const [isItemData, setItemData] = useState<any>([]);

  function removeDuplicates(array: any) {
    const seen = new Set();
    return array.filter((obj: any) => {
      const id = obj.ids;
      if (!seen.has(id)) {
        seen.add(id);
        return true;
      }
      return false;
    });
  }

  useEffect(() => {
    setItemData((x: Array<any>) =>
      removeDuplicates([...x, ...(props?.incomingData || [])]),
    );
  }, [props?.incomingData]);

  const RenderData = useMemo(
    () =>
      isItemData.map((x: any, i: any) => (
        <Suspense
          key={"meta-" + i + x?.ids}
          fallback={
            <div className="flex p-4">
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
        hasMore={(props.incomingData?.length || 0) >= 5}
        endMessage={
          <div className="flex p-4">
            <div className="m-auto">Konten sudah habis.</div>
          </div>
        }
        loader={
          <div className="flex p-4">
            <div className="loading m-auto"></div>
          </div>
        }
        className="flex flex-col gap-3 divide-y"
      >
        {RenderData}
      </InfiniteScrollWrapper>
    </>
  );
};

export default InfiniteScroll;
