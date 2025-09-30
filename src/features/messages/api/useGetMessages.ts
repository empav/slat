import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const BATCH_SIZE = 20;

type Props = {
  channelId?: Id<"channels">;
  conversationId?: Id<"conversations">;
  parentMessageId?: Id<"messages">;
};

export type GetMessagesReturnType =
  (typeof api.messages.getMany._returnType)["page"];

const useGetMessages = ({
  channelId,
  conversationId,
  parentMessageId,
}: Props) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getMany,
    {
      channelId,
      conversationId,
      parentMessageId,
    },
    {
      initialNumItems: BATCH_SIZE,
    }
  );
  return {
    results,
    status,
    loadMore: () => loadMore(BATCH_SIZE),
  };
};
export default useGetMessages;
