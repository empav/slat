import { GetMessagesReturnType } from "@/features/messages/api/useGetMessages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import Message from "./Message";

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
  loadMore,
  data = [],
  isLoadingMore,
  canLoadMore,
  memberName,
  memberImage,
  variant = "channel",
}: Props) => {
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
                isEditing={false}
                setEditingId={() => {}}
                isCompact={isCompact}
                isAuthor={false}
                hideThreadButton={false}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
export default MessageList;
