ALTER TABLE "concept_prerequisites" ALTER COLUMN "concept_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "concept_prerequisites" ALTER COLUMN "prerequisite_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "concepts" ALTER COLUMN "category" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "cp_concept_idx" ON "concept_prerequisites" USING btree ("concept_id");--> statement-breakpoint
CREATE INDEX "cp_prereq_idx" ON "concept_prerequisites" USING btree ("prerequisite_id");--> statement-breakpoint
CREATE INDEX "concept_category_idx" ON "concepts" USING btree ("category");