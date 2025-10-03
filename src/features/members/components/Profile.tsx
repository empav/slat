import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import useGetMember from "../api/useGetMember";
import { AlertTriangle, Loader, MailIcon, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const Profile = ({
  memberId,
  onClose,
}: {
  memberId: Id<"members">;
  onClose: () => void;
}) => {
  const { data: member, isLoading: isLoadingMember } = useGetMember({
    memberId,
  });

  return (
    <div className="h-full flex flex-col">
      <div className="h-[50px] flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">Profile</p>
        <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      {isLoadingMember ? (
        <div className="h-full flex items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : !member ? (
        <div className="h-full flex flex-col items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-muted-foreground">Profile not found</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center p-4">
            <Avatar className="rounded-md transition hover:opacity-75 max-w-[256px] max-h-[256px] size-full">
              <AvatarImage
                className="rounded-md"
                src={member.user.image}
                alt={member.user.name}
              />
              <AvatarFallback className="bg-sky-600 text-white rounded-md aspect-square text-6xl">
                {member.user.name?.charAt(0).toUpperCase() || "M"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col p-4">
            <p className="text-xl font-bold">{member.user.name} </p>
          </div>
          <Separator className="my-2" />
          <div className="flex flex-col p-4">
            <p className="text-sm font-bold mb-4">Contact information</p>
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-md bg-muted flex items-center justify-center">
                <MailIcon className="size-4" />
              </div>
              <div className="flex flex-col">
                <p className="text-[13px] font-semibold text-muted-foreground">
                  Email address
                </p>
                <Link
                  href={`mailto:${member.user.email}`}
                  className="text-sm hover:underline text-[#1264a3]"
                >
                  {member.user.email}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
