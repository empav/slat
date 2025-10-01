import { format } from "date-fns";

const ChannelHero = ({
  name,
  creationTime,
}: {
  name: string;
  creationTime: number;
}) => {
  return (
    <div className="mt-[50px] mx-5">
      <p className="text-2xl font-bold flex items-center mb-2"># {name}</p>
      <p className="font-normal text-slate-800 mb-4">
        This channel was created on {format(creationTime, "MMM do, yyyy")}. This
        is the very beginning of the <strong>#{name}</strong> channel.
      </p>
    </div>
  );
};
export default ChannelHero;
