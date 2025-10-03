import { ConvexError, v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
  return ctx.db.get(userId);
};

const populateMember = (ctx: QueryCtx, memberId: Id<"members">) => {
  return ctx.db.get(memberId);
};

const populateReactions = (ctx: QueryCtx, messageId: Id<"messages">) => {
  return ctx.db
    .query("reactions")
    .withIndex("byMessageId", (q) => q.eq("messageId", messageId))
    .collect();
};

const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  const messages = await ctx.db
    .query("messages")
    .withIndex("byParentMessageId", (q) => q.eq("parentMessageId", messageId))
    .collect();

  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
      name: "",
    };
  }

  const lastMessage = messages[messages.length - 1];

  const lastMessageMember = await populateMember(ctx, lastMessage.memberId);
  if (!lastMessageMember) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
      name: "",
    };
  }
  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timestamp: lastMessage._creationTime,
    name: lastMessageUser?.name,
  };
};

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

export const removeOne = mutation({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }
    const message = await ctx.db.get(args.id);
    if (!message) {
      throw new ConvexError("Message not found");
    }
    const member = await getMember(ctx, userId, message.workspaceId);
    if (!member || member._id !== message.memberId) {
      throw new ConvexError("Not authenticated");
    }
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const updateOne = mutation({
  args: {
    id: v.id("messages"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }
    const message = await ctx.db.get(args.id);
    if (!message) {
      throw new ConvexError("Message not found");
    }
    const member = await getMember(ctx, userId, message.workspaceId);
    if (!member || member._id !== message.memberId) {
      throw new ConvexError("Not authenticated");
    }
    await ctx.db.patch(args.id, {
      body: args.body,
      updatedAt: Date.now(),
    });
    return args.id;
  },
});

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }
    const member = await getMember(ctx, userId, args.workspaceId);

    let _conversationId = args.conversationId;
    if (!args.conversationId && !args.channelId) {
      //Only possible to reply in one-one conversation
      const parentMessage = await ctx.db.get(args.parentMessageId!);
      if (!parentMessage?.conversationId) {
        throw new ConvexError("Parent message not found");
      }
      _conversationId = parentMessage.conversationId;
    }

    const messageId = await ctx.db.insert("messages", {
      body: args.body,
      image: args.image,
      memberId: member._id,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      conversationId: _conversationId,
      parentMessageId: args.parentMessageId,
    });

    return messageId;
  },
});

export const getMany = query({
  args: {
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    let _conversationId = args.conversationId;
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      //Only possible to reply in one-one conversation
      const parentMessage = await ctx.db.get(args.parentMessageId);
      if (!parentMessage?.conversationId) {
        throw new ConvexError("Parent message not found");
      }
      _conversationId = parentMessage.conversationId;
    }

    const results = await ctx.db
      .query("messages")
      .withIndex("byChannelIdAndParentMessageIdAndConversationId", (q) =>
        q
          .eq("channelId", args.channelId)
          .eq("parentMessageId", args.parentMessageId)
          .eq("conversationId", _conversationId)
      )

      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...results,
      page: await Promise.all(
        results.page
          .map(async (message) => {
            const member = await populateMember(ctx, message.memberId);
            const user = member ? await populateUser(ctx, member.userId) : null;

            if (!member || !user) {
              throw new ConvexError("Member or user not found");
            }

            const reactions = await populateReactions(ctx, message._id);
            const thread = await populateThread(ctx, message._id);
            const image = message.image
              ? await ctx.storage.getUrl(message.image)
              : undefined;
            const reactionsWithCount = reactions.map((reaction) => ({
              ...reaction,
              count: reactions.filter((r) => r.value === reaction.value).length,
            }));

            const dedupedReactions = reactionsWithCount.reduce(
              (acc, reaction) => {
                const existingReactions = acc.find(
                  (r) => r.value === reaction.value
                );
                if (existingReactions) {
                  existingReactions.memberIds = Array.from(
                    new Set([...existingReactions.memberIds, reaction.memberId])
                  );
                } else {
                  acc.push({ ...reaction, memberIds: [reaction.memberId] });
                }
                return acc;
              },
              [] as (Doc<"reactions"> & {
                count: number;
                memberIds: Id<"members">[];
              })[]
            );

            const reactionsWithoutMemberId = dedupedReactions.map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ({ memberId, ...rest }) => rest
            );

            return {
              ...message,
              image,
              member,
              user,
              reactions: reactionsWithoutMemberId,
              threadCount: thread.count,
              threadImage: thread.image,
              threadName: thread.name,
              threadTimestamp: thread.timestamp,
            };
          })
          .filter(Boolean)
      ),
    };
  },
});

export const getOne = query({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }
    const message = await ctx.db.get(args.id);
    if (!message) {
      return null;
    }
    const currentMember = await getMember(ctx, userId, message.workspaceId);
    if (!currentMember) {
      return null;
    }
    const member = await populateMember(ctx, message.memberId);
    if (!member) {
      return null;
    }
    const user = await populateUser(ctx, member.userId);
    if (!user) {
      return null;
    }
    const reactions = await populateReactions(ctx, message._id);

    const reactionsWithCount = reactions.map((reaction) => ({
      ...reaction,
      count: reactions.filter((r) => r.value === reaction.value).length,
    }));

    const dedupedReactions = reactionsWithCount.reduce(
      (acc, reaction) => {
        const existingReactions = acc.find((r) => r.value === reaction.value);
        if (existingReactions) {
          existingReactions.memberIds = Array.from(
            new Set([...existingReactions.memberIds, reaction.memberId])
          );
        } else {
          acc.push({ ...reaction, memberIds: [reaction.memberId] });
        }
        return acc;
      },
      [] as (Doc<"reactions"> & {
        count: number;
        memberIds: Id<"members">[];
      })[]
    );
    const reactionsWithoutMemberId = dedupedReactions.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ memberId, ...rest }) => rest
    );

    return {
      ...message,
      image: message.image
        ? await ctx.storage.getUrl(message.image)
        : undefined,
      member,
      user,
      reactions: reactionsWithoutMemberId,
    };
  },
});
