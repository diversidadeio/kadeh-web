CREATE TABLE `locationMaps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`venueType` enum('store','market','shopping','event_pavilion','parks','hospital','public_agency','other') NOT NULL,
	`description` text,
	`floorPlanUrl` varchar(500),
	`floorPlanWidth` int,
	`floorPlanHeight` int,
	`nodes` json NOT NULL DEFAULT ('[]'),
	`edges` json NOT NULL DEFAULT ('[]'),
	`locations` json NOT NULL DEFAULT ('[]'),
	`routes` json NOT NULL DEFAULT ('[]'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locationMaps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `locationMaps_user_idx` ON `locationMaps` (`userId`);--> statement-breakpoint
CREATE INDEX `locationMaps_venueType_idx` ON `locationMaps` (`venueType`);