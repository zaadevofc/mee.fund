import { useMemo } from 'react';
import { default as InfiniteScrollWrapper } from 'react-infinite-scroll-component';
import ChildLoading from './ChildAlerts';

type InfiniteScrollType = {
  children: any;
  hasMore: boolean;
  items: Array<any>;
  loadMore: () => void;
};

const InfiniteScroll = (props: InfiniteScrollType) => {
  const RenderData = useMemo(() => props.items?.map((x: any, i: any) => props.children(x, i)), [props.items, props.children]);

  return (
    <>
      <InfiniteScrollWrapper
        dataLength={props.items?.length || 0}
        next={props.loadMore}
        hasMore={props.hasMore}
        endMessage={
          <div className="flex p-4">
            <div className="m-auto">Sudah paling akhir.</div>
          </div>
        }
        loader={<ChildLoading />}
        className="hide-scroll flex flex-col gap-7 !overflow-hidden"
      >
        {RenderData}
      </InfiniteScrollWrapper>
    </>
  );
};

export default InfiniteScroll;
