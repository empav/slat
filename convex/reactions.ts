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

export const toggle = mutation({
  args: {
    messageId: v.id("messages"),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new ConvexError("Message not found");
    }
    const member = await getMember(ctx, userId, message.workspaceId);
    if (!member) {
      throw new ConvexError("Not authenticated");
    }
    const existingReaction = await ctx.db
      .query("reactions")
      .filter((r) => {
        return r.and(
          r.eq(r.field("messageId"), args.messageId),
          r.eq(r.field("memberId"), member._id),
          r.eq(r.field("value"), args.value)
        );
      })
      .first();
    if (existingReaction) {
      await ctx.db.delete(existingReaction._id);
      return existingReaction._id;
    } else {
      const newReactionId = await ctx.db.insert("reactions", {
        messageId: message._id,
        memberId: member._id,
        workspaceId: message.workspaceId,
        value: args.value,
      });
      return newReactionId;
    }
  },
});
