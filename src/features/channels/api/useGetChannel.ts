import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetChannel = ({ channelId }: { channelId: Id<"channels"> }) => {
  const data = useQuery(api.channels.getOne, {
    channelId,
  });
  const isLoading = data === undefined;

  return { data, isLoading };
};

export default useGetChannel;
