ALTER TABLE `locationMaps` MODIFY COLUMN `nodes` json NOT NULL;--> statement-breakpoint
ALTER TABLE `locationMaps` MODIFY COLUMN `edges` json NOT NULL;--> statement-breakpoint
ALTER TABLE `locationMaps` MODIFY COLUMN `locations` json NOT NULL;--> statement-breakpoint
ALTER TABLE `locationMaps` MODIFY COLUMN `routes` json NOT NULL;