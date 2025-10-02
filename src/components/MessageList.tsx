import { GetMessagesReturnType } from "@/features/messages/api/useGetMessages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import Message from "./Message";
import ChannelHero from "./ChannelHero";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import useCurrentMember from "@/features/members/api/useCurrentMember";
import { Loader } from "lucide-react";

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
  loadMore,
  isLoadingMore,
  canLoadMore,
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

  const onInfiniteScroll = (el: HTMLDivElement | null) => {
    if (el) {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && canLoadMore) {
            loadMore();
          }
        },
        { threshold: 1.0 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }
  };

  return (
    <>
      {variant === "channel" && channelName && channelCreationTime ? (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      ) : null}
      <div className="flex flex-1 flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        {Object.entries(messagesByDate).map(([dateKey, messages]) => (
          <div key={dateKey} className="space-y-2">
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-background text-xs px-4 py-1 rounded-full border border-gray-300 shadow-sm">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((msg, idx) => (
              <Message
                key={msg._id}
                message={msg}
                isEditing={editingId === msg._id}
                setEditingId={setEditingId}
                isCompact={
                  messages[idx - 1] &&
                  messages[idx - 1].user._id &&
                  msg.user._id === messages[idx - 1].user._id &&
                  differenceInMinutes(
                    new Date(msg._creationTime),
                    new Date(messages[idx - 1]._creationTime)
                  ) < TIME_THRESHOLD
                }
                isAuthor={msg.memberId === currentMember?._id}
                hideThreadButton={variant === "thread"}
              />
            ))}
          </div>
        ))}
      </div>
      {isLoadingMore ? (
        <div className="text-center my-2 relative">
          <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
          <span className="relative inline-block bg-background text-xs px-4 py-1 rounded-full border border-gray-300 shadow-sm">
            <Loader className="animate-spin h-4 w-4" />
          </span>
        </div>
      ) : null}
      <div className="h-1" ref={onInfiniteScroll} />
    </>
  );
};
export default MessageList;
