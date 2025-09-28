import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = { workspaceId: Id<"workspaces"> };
type ResponseType = Id<"workspaces">;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throw?: boolean;
};

export const useNewJoinCode = () => {
  const mutation = useMutation(api.workspaces.newJoinCode);

  const [status, setStatus] = useState<
    "settled" | "pending" | "success" | "error" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const [data, setData] = useState<ResponseType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");
        const response = await mutation(values);
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setStatus("error");
        options?.onError?.(error as Error);
        if (options?.throw) throw error;
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return { mutate, data, error, isPending, isSuccess, isError, isSettled };
};

export default useNewJoinCode;
