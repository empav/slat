"use client";

import Image from "next/image";
import VerificationInput from "react-verification-input";
import { Id } from "../../../../convex/_generated/dataModel";
import { Loader } from "lucide-react";
import { use, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useGetWorkspaceInfo from "@/features/workspaces/api/useGetWorkspaceInfo";
import useJoin from "@/features/workspaces/api/useJoin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const JoinPage = ({
  params,
}: {
  params: Promise<{ workspaceId: Id<"workspaces"> }>;
}) => {
  const router = useRouter();
  const { mutate, isPending: isJoining } = useJoin();

  const { workspaceId } = use(params);

  const { data: workspace, isLoading } = useGetWorkspaceInfo({
    id: workspaceId,
  });

  const isMember = useMemo(() => {
    return workspace?.isMember;
  }, [workspace?.isMember]);

  const onComplete = (joinCode: string) => {
    mutate(
      { workspaceId, joinCode },
      {
        onSuccess: () => {
          toast.success("Successfully joined the workspace!");
          router.replace(`/workspaces/${workspaceId}`);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  useEffect(() => {
    if (isMember) {
      router.push(`/workspaces/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace) {
    router.push("/404");
    return null;
  }

  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center bg-background p-8 rounded-lg shadow-md">
      <Image src={"/next.svg"} alt="Logo slat" width={100} height={100} />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {workspace.name}</h1>
          <p className="text-sm text-muted-foreground">
            Enter the code to join that workspace
          </p>
        </div>
        <VerificationInput
          classNames={{
            container: cn(
              "flex gap-x-2",
              isJoining && "pointer-events-none opacity-50"
            ),
            character:
              "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-background text-foreground",
            characterFilled: "bg-background text-foreground",
          }}
          autoFocus
          length={6}
          onComplete={onComplete}
        />
      </div>
      <div className="flex gap-x-4">
        <Button size={"lg"} variant={"outline"} asChild>
          <Link href={"/"}>Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
