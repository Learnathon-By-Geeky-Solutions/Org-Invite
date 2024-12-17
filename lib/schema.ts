import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  varchar,
  integer,
} from "drizzle-orm/pg-core";

export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const techStacks = pgTable("tech_stacks", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  icon: text("icon"),
  discordUrl: text("discord_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jetbrainsLicenses = pgTable("jetbrains_licenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  licenseKey: text("license_key").notNull(),
  usedBy: text("used_by"),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const configurations = pgTable("configurations", {
  id: uuid("id").defaultRandom().primaryKey(),
  githubToken: text("github_token"),
  githubOrgName: text("github_org_name"),
  githubTeamSlug: text("github_team_slug"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const participants = pgTable("participants", {
  id: uuid("id").defaultRandom().primaryKey(),
  githubUsername: text("github_username").notNull(),
  stackId: uuid("stack_id").references(() => techStacks.id),
  orgInviteSent: boolean("org_invite_sent").default(false),
  orgInviteAccepted: boolean("org_invite_accepted").default(false),
  teamAdded: boolean("team_added").default(false),
  licenseAssigned: boolean("license_assigned").default(false),
  licenseId: uuid("license_id").references(() => jetbrainsLicenses.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const participantLogins = pgTable("participant_logins", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  loginCount: integer("login_count").default(0).notNull(),
});
