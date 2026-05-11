ALTER TABLE "concepts" ADD COLUMN "order_index" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "onboarding_completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "concept_order_idx" ON "concepts" USING btree ("order_index");