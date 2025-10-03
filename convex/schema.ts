import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  workspaces: defineTable({
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
  }),

  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    role: v.union(v.literal("admin"), v.literal("member")),
    lastSeen: v.optional(v.number()),
  })
    .index("byUserId", ["userId"])
    .index("byWorkspaceId", ["workspaceId"])
    .index("byUserIdAndWorkspaceId", ["userId", "workspaceId"]),

  channels: defineTable({
    name: v.string(),
    workspaceId: v.id("workspaces"),
  }).index("byWorkspaceId", ["workspaceId"]),

  conversations: defineTable({
    workspaceId: v.id("workspaces"),
    memberOneId: v.id("members"),
    memberTwoId: v.id("members"),
  }).index("byWorkspaceId", ["workspaceId"]),

  messages: defineTable({
    body: v.string(),
    image: v.optional(v.id("_storage")),
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
    updatedAt: v.optional(v.number()),
  })
    .index("byWorkspaceId", ["workspaceId"])
    .index("byMemberId", ["memberId"])
    .index("byChannelId", ["channelId"])
    .index("byConversationId", ["conversationId"])
    .index("byParentMessageId", ["parentMessageId"])
    .index("byChannelIdAndParentMessageIdAndConversationId", [
      "channelId",
      "parentMessageId",
      "conversationId",
    ]),

  reactions: defineTable({
    workspaceId: v.id("workspaces"),
    messageId: v.id("messages"),
    memberId: v.id("members"),
    value: v.string(),
  })
    .index("byWorkspaceId", ["workspaceId"])
    .index("byMessageId", ["messageId"])
    .index("byMemberId", ["memberId"]),
});

export default schema;
