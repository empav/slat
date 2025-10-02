import { MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-react";
import { Button } from "./ui/button";
import Hint from "./Hint";
import EmojiPopover from "./EmojiPopover";

type ToolbarProps = {
  isAuthor: boolean;
  isPending: boolean;
  onEdit: () => void;
  onThread: () => void;
  onDelete: () => void;
  hideThreadButton?: boolean;
  onReactions: (emoji: unknown) => void;
};

const Toolbar = ({
  isAuthor,
  isPending,
  onEdit,
  onThread,
  onDelete,
  hideThreadButton = false,
  onReactions,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-foreground rounded-md shadow-sm">
        <EmojiPopover onEmojiSelect={(emoji) => onReactions(emoji)}>
          <Button size="iconSm" disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton ? (
          <Hint label="Reply to thread">
            <Button size="iconSm" disabled={isPending} onClick={onThread}>
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        ) : null}
        {isAuthor ? (
          <>
            <Hint label="Edit message">
              <Button size="iconSm" disabled={isPending} onClick={onEdit}>
                <Pencil className="size-4" />
              </Button>
            </Hint>
            <Hint label="Delete message">
              <Button size="iconSm" disabled={isPending} onClick={onDelete}>
                <Trash className="size-4" />
              </Button>
            </Hint>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Toolbar;
