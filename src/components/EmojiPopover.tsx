import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Props = {
  children: React.ReactNode;
  hint?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEmojiSelect: (emoji: any) => void;
};

const EmojiPopover = ({ children, hint = "Emoji", onEmojiSelect }: Props) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSelect = (emoji: any) => {
    onEmojiSelect(emoji);
    setIsPopoverOpen(false);

    setTimeout(() => {
      setIsTooltipOpen(false);
    }, 300);
  };

  return (
    <TooltipProvider>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <Tooltip
          open={isTooltipOpen}
          onOpenChange={setIsTooltipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-background text-foreground border border-foreground/10">
            <p className="font-medium text-xs">{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="p-0 w-full shadow-none border-none">
          <Picker data={data} onEmojiSelect={onSelect} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default EmojiPopover;
