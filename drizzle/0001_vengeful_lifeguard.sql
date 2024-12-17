CREATE TABLE IF NOT EXISTS "participant_logins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"login_count" integer DEFAULT 0 NOT NULL
);
