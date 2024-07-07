import { LuLoader2 } from 'react-icons/lu';
import { cn } from '~/libs/tools';

type ChildAlertsType = {
  label?: string;
  className?: string;
  loading?: boolean;
};

const ChildAlerts = (props: ChildAlertsType) => {
  return (
    <>
      <div className={cn('flex p-4 min-[460px]:rounded-xl min-[460px]:border', props.className)}>
        <div className={cn('m-auto flex items-center gap-3')}>
          {props.loading && <LuLoader2 className="flex-shrink-0 animate-spin text-xl" />}
          <h1>{props.label}</h1>
        </div>
      </div>
    </>
  );
};

export default ChildAlerts;
