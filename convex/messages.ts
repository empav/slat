import { ConvexError, v } from "convex/values";
import { mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

const getMember = async (
  ctx: QueryCtx,
  userId: Id<"users">,
  workspaceId: Id<"workspaces">
) => {
  const member = await ctx.db
    .query("members")
    .withIndex("byUserIdAndWorkspaceId", (q) =>
      q.eq("userId", userId).eq("workspaceId", workspaceId)
    )
    .unique();
  if (!member) {
    throw new ConvexError("Not authenticated");
  }
  return member;
};

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }
    const member = await getMember(ctx, userId, args.workspaceId);

    const messageId = await ctx.db.insert("messages", {
      body: args.body,
      image: args.image,
      memberId: member._id,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      parentMessageId: args.parentMessageId,
      updatedAt: Date.now(),
    });

    return messageId;
  },
});
