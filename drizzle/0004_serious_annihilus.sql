CREATE TABLE `capacityReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storeId` int NOT NULL,
	`moduleId` int,
	`totalCapacity` int NOT NULL,
	`totalOccupied` int NOT NULL,
	`occupancyPercentage` decimal(5,2) NOT NULL,
	`reportData` json NOT NULL,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `capacityReports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `corridors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storeId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`positionX` int NOT NULL,
	`positionY` int NOT NULL,
	`width` int NOT NULL,
	`length` int NOT NULL,
	`order` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `corridors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `moduleTemplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('gondola','freezer_horizontal','freezer_vertical','island','produce_stand','hanging_display') NOT NULL,
	`description` text,
	`defaultWidth` int NOT NULL,
	`defaultDepth` int NOT NULL,
	`defaultHeight` int NOT NULL,
	`defaultShelves` int NOT NULL,
	`isCustomizable` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `moduleTemplates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storeId` int NOT NULL,
	`corridorId` int,
	`templateId` int,
	`name` varchar(255) NOT NULL,
	`type` enum('gondola','freezer_horizontal','freezer_vertical','island','produce_stand','hanging_display') NOT NULL,
	`positionX` int NOT NULL,
	`positionY` int NOT NULL,
	`width` int NOT NULL,
	`depth` int NOT NULL,
	`height` int NOT NULL,
	`shelfHeight` int,
	`numberOfShelves` int NOT NULL,
	`totalCapacity` int NOT NULL,
	`totalOccupied` int NOT NULL DEFAULT 0,
	`occupancyPercentage` decimal(5,2) NOT NULL DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `modules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productPlacements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storeId` int NOT NULL,
	`moduleId` int NOT NULL,
	`shelfId` int NOT NULL,
	`productId` varchar(255) NOT NULL,
	`productName` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`productWidth` int NOT NULL,
	`productDepth` int NOT NULL,
	`productHeight` int NOT NULL,
	`giro` enum('A','B','C') NOT NULL,
	`margem` enum('A','B','C') NOT NULL,
	`zone` enum('Altura dos olhos','Altura das mãos','Parte de Baixo') NOT NULL,
	`quantity` int NOT NULL,
	`volume` int NOT NULL,
	`positionOrder` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productPlacements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shelves` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`order` int NOT NULL,
	`width` int NOT NULL,
	`depth` int NOT NULL,
	`height` int NOT NULL,
	`zone` enum('Altura dos olhos','Altura das mãos','Parte de Baixo') NOT NULL,
	`capacity` int NOT NULL,
	`occupiedSpace` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shelves_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`layoutType` enum('linear','grid','custom') NOT NULL DEFAULT 'linear',
	`width` int NOT NULL,
	`length` int NOT NULL,
	`height` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `capacityReports_store_idx` ON `capacityReports` (`storeId`);--> statement-breakpoint
CREATE INDEX `capacityReports_module_idx` ON `capacityReports` (`moduleId`);--> statement-breakpoint
CREATE INDEX `corridors_store_idx` ON `corridors` (`storeId`);--> statement-breakpoint
CREATE INDEX `moduleTemplates_user_idx` ON `moduleTemplates` (`userId`);--> statement-breakpoint
CREATE INDEX `moduleTemplates_type_idx` ON `moduleTemplates` (`type`);--> statement-breakpoint
CREATE INDEX `modules_store_idx` ON `modules` (`storeId`);--> statement-breakpoint
CREATE INDEX `modules_corridor_idx` ON `modules` (`corridorId`);--> statement-breakpoint
CREATE INDEX `modules_type_idx` ON `modules` (`type`);--> statement-breakpoint
CREATE INDEX `productPlacements_store_idx` ON `productPlacements` (`storeId`);--> statement-breakpoint
CREATE INDEX `productPlacements_module_idx` ON `productPlacements` (`moduleId`);--> statement-breakpoint
CREATE INDEX `productPlacements_shelf_idx` ON `productPlacements` (`shelfId`);--> statement-breakpoint
CREATE INDEX `productPlacements_product_idx` ON `productPlacements` (`productId`);--> statement-breakpoint
CREATE INDEX `shelves_module_idx` ON `shelves` (`moduleId`);--> statement-breakpoint
CREATE INDEX `shelves_zone_idx` ON `shelves` (`zone`);--> statement-breakpoint
CREATE INDEX `stores_user_idx` ON `stores` (`userId`);