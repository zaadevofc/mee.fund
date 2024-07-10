import { useState } from 'react';
import { cn } from '~/libs/utils';

export type HeaderTabsType = {
  className?: string;
  value?: string;
  sticky?: boolean;
  tabs: {
    label: string;
    value: string;
  }[];
  onTabsClick?: (value: string) => void;
};

const HeaderTabs = (props: HeaderTabsType) => {
  const [isValue, setValue] = useState(props.value || props.tabs[0] && props.tabs[0].value);

  const handleTab = (x: any) => {
    setValue(x.value);
    if (props.onTabsClick) {
      props.onTabsClick(x.value);
    }
  };

  return (
    <>
      <div className={cn("flex w-full items-center hide-scroll flex-shrink-0 overflow-x-auto overflow-y-hidden justify-evenly min-[460px]:rounded-lg border p-3", props.className)}>
        {props?.tabs.map(x => (
          <div
            onClick={e => {
              e.stopPropagation();
              handleTab(x);
            }}
            className={cn(
              'group relative w-auto cursor-pointer text-center text-[15px] flex-shrink-0 px-4',
              isValue == x.value && 'font-semibold text-primary-500',
              isValue != x.value && 'group-hover:text-primary-500'
            )}
          >
            <div
              className={cn(
                'absolute inset-x-0 -bottom-2.5 mx-auto h-1 w-1/3 rounded-full',
                isValue == x.value && 'bg-primary-500',
                isValue != x.value && 'group-hover:bg-primary-500'
              )}
            />
            <h1>{x.label}</h1>
          </div>
        ))}
      </div>
    </>
  );
};

export default HeaderTabs;
