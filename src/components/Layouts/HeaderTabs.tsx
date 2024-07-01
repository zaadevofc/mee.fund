import Link from "next/link";
import React, { useState } from "react";

export type HeaderTabsType = {
  className?: string;
  sticky?: boolean;
  tabs: (
    | {
        label: string;
        value: string;
      }
    | false
  )[];
  onTabsClick?: (value: string) => void;
};

const HeaderTabs = (props: HeaderTabsType) => {
  const [isValue, setValue] = useState(props.tabs[0] && props.tabs[0].value);

  const handleTab = (x: any) => {
    setValue(x.value);
    if (props.onTabsClick) {
      props.onTabsClick(x.value);
    }
  };

  return (
    <>
      <div
        role="tablist"
        className={
          props.className + (!props.sticky ? " sticky top-0 z-50" : "") +
          " tabs-boxed tabs !rounded-none !border-b max-[412px]:!py-1.5 !py-3 bg-white/80 backdrop-blur-lg overflow-x-auto flex-shrink-0"
        }
      >
        {props
          .tabs!.filter((x) => x)
          .map((x: any, i) => (
            <h1
              key={i}
              onClick={() => handleTab(x)}
              role="tab"
              className={`${isValue == x.value && "font-semibold text-primary"} tab`}
            >
              {x.label}
            </h1>
          ))}
      </div>
    </>
  );
};

export default HeaderTabs;
