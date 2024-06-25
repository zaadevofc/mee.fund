import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const EmojiCard = (props: any) => {
  return (
    <>
    <div className={`${props.open && '!block'} hidden border rounded-[12px] w-fit`}>
      <Picker data={data} {...props} />
    </div>
    </>
  );
};

export default EmojiCard;
