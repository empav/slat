import useWorkspaceId from "@/app/hooks/useWorkspaceId";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useRemoveChannel from "@/features/channels/api/useRemoveChannel";
import useUpdateChannel from "@/features/channels/api/useUpdateChannel";
import useCurrentMember from "@/features/members/api/useCurrentMember";
import useChannelId from "@/hooks/useChannelId";
import useConfirmDialog from "@/hooks/useConfirmDialog";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";

const Header = ({
  memberName = "Member",
  memberImage,
  onClick,
}: {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}) => {
  const avatarFallback = memberName.charAt(0).toUpperCase();
  return (
    <div className="bg-background flex items-center px-4 border-b overflow-hidden">
      <Button
        variant={"ghost"}
        className="text-lg font-semibold px-2 overflow-hidden w-auto"
        onClick={onClick}
      >
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage
            src={memberImage}
            alt={memberName}
            className="rounded-md"
          />
          <AvatarFallback className="rounded-md bg-sky-600 text-white text-xs">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <FaChevronDown className="ml-2 size-3" />
      </Button>
    </div>
  );
};
export default Header;
