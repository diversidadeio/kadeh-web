CREATE TABLE `gondolas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`gondolaNumber` int NOT NULL,
	`name` varchar(100),
	`categoryId` int,
	`totalPositions` int NOT NULL DEFAULT 6,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gondolas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productCode` varchar(50) NOT NULL,
	`gondolaNumber` int NOT NULL,
	`position` varchar(20) NOT NULL,
	`category` varchar(100) NOT NULL,
	`subcategory` varchar(100) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `gondolas_user_idx` ON `gondolas` (`userId`);--> statement-breakpoint
CREATE INDEX `gondolas_number_idx` ON `gondolas` (`gondolaNumber`);--> statement-breakpoint
CREATE INDEX `gondolas_category_idx` ON `gondolas` (`categoryId`);--> statement-breakpoint
CREATE INDEX `products_user_idx` ON `products` (`userId`);--> statement-breakpoint
CREATE INDEX `products_code_idx` ON `products` (`productCode`);--> statement-breakpoint
CREATE INDEX `products_gondola_idx` ON `products` (`gondolaNumber`);--> statement-breakpoint
CREATE INDEX `products_category_idx` ON `products` (`category`);--> statement-breakpoint
CREATE INDEX `products_subcategory_idx` ON `products` (`subcategory`);