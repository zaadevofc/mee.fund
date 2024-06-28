import Link from "next/link";
import React, { useState } from "react";

export type TabOptionsType = {
  tabs: (
    | {
        label: string;
        value: string;
      }
    | false
  )[];
  onTabsClick?: (value: string) => void;
};

const TabOptions = (props: TabOptionsType) => {
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
        className="tabs-boxed tabs rounded-lg border bg-transparent"
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

export default TabOptions;
