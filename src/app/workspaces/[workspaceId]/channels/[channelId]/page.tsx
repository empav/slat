"use client";

import useGetChannel from "@/features/channels/api/useGetChannel";
import useChannelId from "@/hooks/useChannelId";
import { Loader, TriangleAlert } from "lucide-react";
import Header from "./Header";
import ChatInput from "./ChatInput";

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { data: channel, isLoading: isChannelLoading } = useGetChannel({
    channelId,
  });

  if (isChannelLoading) {
    return (
      <div className="h-full flex flex-1 items-center justify-center">
        <Loader className="size-5 animate-spin mr-2" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex flex-col gap-y-2 flex-1 items-center justify-center">
        <TriangleAlert className="size-5 mr-2" />
        <p className="text-sm text-muted-foreground">Channel not found </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />
      <div className="flex-1" />
      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
