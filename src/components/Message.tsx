import { GetMessagesReturnType } from "@/features/messages/api/useGetMessages";
import { Id } from "../../convex/_generated/dataModel";

import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";
import Hint from "./Hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Thumbnail from "./Thumbnail";
import Toolbar from "./Toolbar";
import useUpdateMessage from "@/features/messages/api/useUpdateMessage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { EditorValue } from "./Editor";
import useDeleteMessage from "@/features/messages/api/useDeleteMessage";
import useConfirmDialog from "@/hooks/useConfirmDialog";
import useToggleReaction from "@/features/reactions/api/useToggleReaction";
import Reactions from "./Reactions";
import usePanel from "@/hooks/usePanel";
import { GetMessageReturnType } from "@/features/messages/api/useGetMessage";
import ThreadBar from "./ThreadBar";

const Editor = dynamic(() => import("./Editor"), { ssr: false });
const MessageRenderer = dynamic(() => import("./MessageRenderer"), {
  ssr: false,
});

type Props = {
  message: GetMessagesReturnType[number] | GetMessageReturnType;
  isAuthor: boolean;
  isEditing: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  isCompact?: boolean;
  hideThreadButton?: boolean;
};

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

const Message = ({
  message: {
    _id,
    image,
    body,
    _creationTime,
    user,
    updatedAt,
    reactions,
    threadCount,
    threadImage,
    threadTimestamp,
    threadName,
    memberId,
  },
  isAuthor,
  isEditing,
  setEditingId,
  isCompact,
  hideThreadButton,
}: Props) => {
  const creationTime = new Date(_creationTime);
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction();
  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();
  const { mutate: deleteMessage, isPending: isDeletingMessage } =
    useDeleteMessage();
  const [ConfirmDialog, confirm] = useConfirmDialog(
    "Are you sure?",
    "Deleting a message cannot be undone."
  );
  const { parentMessageId, onOpenMessage, onOpenProfile, onClose } = usePanel();

  const onReactions = (emoji: unknown) => {
    const value =
      typeof emoji === "object" && emoji !== null && "native" in emoji
        ? (emoji.native as string)
        : typeof emoji === "string"
          ? emoji
          : "";
    if (value) {
      toggleReaction(
        { messageId: _id, value },
        {
          onError: () => {
            toast.error("Failed to toggle reaction");
          },
        }
      );
    }
  };

  const onUpdateMessage = ({ body }: EditorValue) => {
    updateMessage(
      { id: _id, body },
      {
        onSuccess: () => {
          toast.success("Message updated");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to update message");
        },
      }
    );
  };

  const onDeleteMessage = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteMessage(
      { id: _id },
      {
        onSuccess: () => {
          toast.success("Message deleted");
          setEditingId(null);
          if (parentMessageId === _id) {
            onClose();
          }
        },
        onError: () => {
          toast.error("Failed to delete message");
        },
      }
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-accent/80 hover:text-accent-foreground group relative",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isDeletingMessage &&
              "bg-rose-500/50 transform transition-all duration-300 scale-y-0 origin-bottom"
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(creationTime)}>
              <button className="text-xs text-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center">
                {format(creationTime, "HH:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className="size-full">
                <Editor
                  onSubmit={onUpdateMessage}
                  disabled={isUpdatingMessage || isDeletingMessage}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <MessageRenderer value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground/80">
                    (edited)
                  </span>
                ) : null}
                <Reactions data={reactions} onChange={onReactions} />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  name={threadName}
                  timestamp={threadTimestamp}
                  onClick={() => onOpenMessage(_id)}
                />
              </div>
            )}
          </div>
          {!isEditing ? (
            <Toolbar
              isAuthor={isAuthor}
              isPending={
                isUpdatingMessage || isDeletingMessage || isTogglingReaction
              }
              onEdit={() => setEditingId(_id)}
              onThread={() => onOpenMessage(_id)}
              onDelete={onDeleteMessage}
              hideThreadButton={hideThreadButton}
              onReactions={onReactions}
            />
          ) : null}
        </div>
      </>
    );
  }
  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-accent/80 hover:text-accent-foreground group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isDeletingMessage &&
            "bg-rose-500/50 transform transition-all duration-300 scale-y-0 origin-bottom"
        )}
      >
        <div className="flex items-start gap-2">
          <button onClick={() => onOpenProfile(memberId)}>
            <Avatar className="rounded-md size-10 transition hover:opacity-75">
              <AvatarImage
                className="rounded-md"
                src={user.image}
                alt={user.name}
              />
              <AvatarFallback className="bg-sky-600 text-white rounded-md">
                {user.name!.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={onUpdateMessage}
                disabled={
                  isUpdatingMessage || isDeletingMessage || isTogglingReaction
                }
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button
                  className="font-bold text-foreground hover:underline"
                  onClick={() => onOpenProfile(memberId)}
                >
                  {user.name}
                </button>
                <span className="">{"  "}</span>
                <Hint label={formatFullTime(creationTime)}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(creationTime, "h:mm a")}
                  </button>
                </Hint>
              </div>
              <MessageRenderer value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className="text-xs text-muted-foreground/80">
                  (edited)
                </span>
              ) : null}
              <Reactions data={reactions} onChange={onReactions} />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                timestamp={threadTimestamp}
                name={threadName}
                onClick={() => onOpenMessage(_id)}
              />
            </div>
          )}
        </div>
        {!isEditing ? (
          <Toolbar
            isAuthor={isAuthor}
            isPending={
              isUpdatingMessage || isDeletingMessage || isTogglingReaction
            }
            onEdit={() => setEditingId(_id)}
            onThread={() => onOpenMessage(_id)}
            onDelete={onDeleteMessage}
            hideThreadButton={hideThreadButton}
            onReactions={onReactions}
          />
        ) : null}
      </div>
    </>
  );
};
export default Message;
