import useMemberId from "@/hooks/useMemberId";
import { Id } from "../../../../../../convex/_generated/dataModel";
import useGetMember from "@/features/members/api/useGetMember";
import useGetMessages from "@/features/messages/api/useGetMessages";
import { Loader } from "lucide-react";
import Header from "./Header";
import ChatInput from "./ChatInput";
import MessageList from "@/components/MessageList";

const Conversation = ({ id }: { id: Id<"conversations"> }) => {
  const memberId = useMemberId();
  const { data: member, isLoading: isMemberLoading } = useGetMember({
    memberId,
  });
  const { results, status, loadMore } = useGetMessages({
    conversationId: id,
  });

  if (isMemberLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => {}}
      />
      <MessageList
        data={results}
        loadMore={loadMore}
        variant="conversation"
        memberImage={member?.user.image}
        memberName={member?.user.name}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput
        placeholder={`Message ${member?.user.name}`}
        conversationId={id}
      />
    </div>
  );
};

export default Conversation;
