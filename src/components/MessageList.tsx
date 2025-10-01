import { GetMessagesReturnType } from "@/features/messages/api/useGetMessages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import Message from "./Message";
import ChannelHero from "./ChannelHero";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import useCurrentMember from "@/features/members/api/useCurrentMember";

type Props = {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
};

const formatDateLabel = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

const TIME_THRESHOLD = 5; // 5 minutes

const MessageList = ({
  channelName,
  channelCreationTime,
  data = [],
  variant = "channel",
}: Props) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const workspaceId = useWorkspaceId();

  const { data: currentMember } = useCurrentMember({ workspaceId });

  const messagesByDate = data.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof data>
  );

  return (
    <>
      {variant === "channel" && channelName && channelCreationTime ? (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      ) : null}
      <div className="flex flex-1 flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        {Object.entries(messagesByDate).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-background text-xs px-4 py-1 rounded-full border border-gray-300 shadow-sm">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((msg, idx) => {
              const prevMessage = messages[idx - 1];
              const isCompact =
                prevMessage &&
                prevMessage.user._id &&
                differenceInMinutes(
                  new Date(msg._creationTime),
                  new Date(prevMessage._creationTime)
                ) < TIME_THRESHOLD;
              return (
                <Message
                  key={msg._id}
                  message={msg}
                  isEditing={editingId === msg._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact}
                  isAuthor={msg.memberId === currentMember?._id}
                  hideThreadButton={variant === "thread"}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};
export default MessageList;
