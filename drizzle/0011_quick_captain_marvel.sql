CREATE TABLE `storeLayoutCategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(100) NOT NULL,
	`nameEn` varchar(100),
	`x` int NOT NULL,
	`y` int NOT NULL,
	`radius` int NOT NULL DEFAULT 20,
	`color` varchar(7) NOT NULL DEFAULT '#3b82f6',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `storeLayoutCategories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `storeLayoutRoutes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fromCategoryId` int NOT NULL,
	`toCategoryId` int NOT NULL,
	`pathPoints` json NOT NULL,
	`distance` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `storeLayoutRoutes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `storeLayoutCategories_user_idx` ON `storeLayoutCategories` (`userId`);--> statement-breakpoint
CREATE INDEX `storeLayoutCategories_code_idx` ON `storeLayoutCategories` (`code`);--> statement-breakpoint
CREATE INDEX `storeLayoutRoutes_user_idx` ON `storeLayoutRoutes` (`userId`);--> statement-breakpoint
CREATE INDEX `storeLayoutRoutes_from_idx` ON `storeLayoutRoutes` (`fromCategoryId`);--> statement-breakpoint
CREATE INDEX `storeLayoutRoutes_to_idx` ON `storeLayoutRoutes` (`toCategoryId`);