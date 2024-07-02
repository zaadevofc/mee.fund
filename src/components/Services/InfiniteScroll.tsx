import { Suspense, useMemo } from 'react';
import { default as InfiniteScrollWrapper } from 'react-infinite-scroll-component';
import ChildLoading from './ChildLoading';

type InfiniteScrollType = {
  children: any;
  hasMore: boolean;
  items: Array<any>;
  loadMore: () => void;
};

const InfiniteScroll = (props: InfiniteScrollType) => {
  const RenderData = useMemo(
    () =>
      props.items?.map((x: any, i: any) => (
        <Suspense
          key={'meta-' + i + x?.ids}
          fallback={
            <div className="flex p-4">
              <div className="loading m-auto"></div>
            </div>
          }
        >
          {props.children(x, i)}
        </Suspense>
      )),
    [props.items]
  );

  return (
    <>
      <InfiniteScrollWrapper
        dataLength={props.items?.length}
        next={props.loadMore}
        hasMore={props.hasMore}
        endMessage={
          <div className="flex p-4">
            <div className="m-auto">Konten sudah habis.</div>
          </div>
        }
        loader={<ChildLoading />}
        className="flex flex-col gap-3 divide-y"
      >
        {RenderData}
      </InfiniteScrollWrapper>
    </>
  );
};

export default InfiniteScroll;
