import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createOrGetOne = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }
    const currentMember = await ctx.db
      .query("members")
      .withIndex("byUserIdAndWorkspaceId", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.workspaceId)
      )
      .unique();
    const otherMember = await ctx.db.get(args.memberId);
    if (!currentMember || !otherMember) {
      throw new ConvexError("Member not found");
    }
    const existingConversation = await ctx.db
      .query("conversations")
      .filter((c) => {
        return c.and(c.eq(c.field("workspaceId"), args.workspaceId));
      })
      .filter((c) => {
        return c.or(
          c.and(
            c.eq(c.field("memberOneId"), currentMember._id),
            c.eq(c.field("memberTwoId"), otherMember._id)
          ),
          c.and(
            c.eq(c.field("memberOneId"), otherMember._id),
            c.eq(c.field("memberTwoId"), currentMember._id)
          )
        );
      })
      .unique();
    if (existingConversation) {
      return existingConversation._id;
    }
    const newConversationId = await ctx.db.insert("conversations", {
      workspaceId: args.workspaceId,
      memberOneId: currentMember._id,
      memberTwoId: otherMember._id,
    });
    const newConversation = await ctx.db.get(newConversationId);
    if (!newConversation) {
      throw new ConvexError("Failed to create conversation");
    }
    return newConversation._id;
  },
});
