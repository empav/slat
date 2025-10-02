import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import useCurrentMember from "@/features/members/api/useCurrentMember";
import { GetMessagesReturnType } from "@/features/messages/api/useGetMessages";
import { cn } from "@/lib/utils";
import Hint from "./Hint";
import EmojiPopover from "./EmojiPopover";
import { MdOutlineAddReaction } from "react-icons/md";

const Reactions = ({
  data,
  onChange,
}: {
  data: GetMessagesReturnType[number]["reactions"];
  onChange: (emoji: unknown) => void;
}) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMemberId) return null;

  return (
    <div className="flex items-center gap-1 mt-1 mb-1">
      {data.map(({ _id, memberIds, value, count }) => (
        <Hint
          key={_id}
          label={`${count} ${count === 1 ? "person" : "people"} reacted with ${value}`}
        >
          <button
            key={_id}
            onClick={() => onChange(value)}
            className={cn(
              "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1",
              memberIds.includes(currentMemberId)
                ? "bg-blue-100/80 border-blue-500 text-white"
                : "hover:bg-slate-300"
            )}
          >
            {value}
            <span
              className={cn(
                "text-xs text-muted-foreground",
                memberIds.includes(currentMemberId) && "text-blue-500"
              )}
            >
              {count}
            </span>
          </button>
        </Hint>
      ))}
      <EmojiPopover onEmojiSelect={onChange}>
        <button className="h-7 px-3 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1 hover:border-slate-500">
          <MdOutlineAddReaction />
        </button>
      </EmojiPopover>
    </div>
  );
};

export default Reactions;
