import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { GetMessagesReturnType } from "./useGetMessages";

export type GetMessageReturnType = GetMessagesReturnType[number];

export const useGetMessage = ({ id }: { id: Id<"messages"> }) => {
  const data = useQuery(api.messages.getOne, {
    id,
  });
  const isLoading = data === undefined;

  return { data, isLoading };
};

export default useGetMessage;
