CREATE TABLE `productLocations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productCode` varchar(50) NOT NULL,
	`productName` varchar(255),
	`gondolaNumber` int NOT NULL,
	`gondolaPosition` varchar(50),
	`excelCategory` varchar(255) NOT NULL,
	`subcategory` varchar(255),
	`departmentName` varchar(100) NOT NULL,
	`mapX` int,
	`mapY` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productLocations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productSubcategoryMappings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`excelCategory` varchar(255) NOT NULL,
	`subcategory` varchar(255) NOT NULL,
	`departmentName` varchar(100) NOT NULL,
	`departmentNameEn` varchar(100),
	`productCount` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productSubcategoryMappings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subcategoryRoutes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fromSubcategory` varchar(255) NOT NULL,
	`toSubcategory` varchar(255) NOT NULL,
	`fromDepartment` varchar(100) NOT NULL,
	`toDepartment` varchar(100) NOT NULL,
	`pathPoints` json NOT NULL,
	`distance` int NOT NULL,
	`estimatedTime` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`usageCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subcategoryRoutes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `productLocations_user_idx` ON `productLocations` (`userId`);--> statement-breakpoint
CREATE INDEX `productLocations_productCode_idx` ON `productLocations` (`productCode`);--> statement-breakpoint
CREATE INDEX `productLocations_gondola_idx` ON `productLocations` (`gondolaNumber`);--> statement-breakpoint
CREATE INDEX `productLocations_department_idx` ON `productLocations` (`departmentName`);--> statement-breakpoint
CREATE INDEX `productLocations_subcategory_idx` ON `productLocations` (`subcategory`);--> statement-breakpoint
CREATE INDEX `productSubcategoryMappings_user_idx` ON `productSubcategoryMappings` (`userId`);--> statement-breakpoint
CREATE INDEX `productSubcategoryMappings_excelCategory_idx` ON `productSubcategoryMappings` (`excelCategory`);--> statement-breakpoint
CREATE INDEX `productSubcategoryMappings_department_idx` ON `productSubcategoryMappings` (`departmentName`);--> statement-breakpoint
CREATE INDEX `productSubcategoryMappings_subcategory_idx` ON `productSubcategoryMappings` (`subcategory`);--> statement-breakpoint
CREATE INDEX `subcategoryRoutes_user_idx` ON `subcategoryRoutes` (`userId`);--> statement-breakpoint
CREATE INDEX `subcategoryRoutes_from_idx` ON `subcategoryRoutes` (`fromSubcategory`);--> statement-breakpoint
CREATE INDEX `subcategoryRoutes_to_idx` ON `subcategoryRoutes` (`toSubcategory`);--> statement-breakpoint
CREATE INDEX `subcategoryRoutes_fromDept_idx` ON `subcategoryRoutes` (`fromDepartment`);--> statement-breakpoint
CREATE INDEX `subcategoryRoutes_toDept_idx` ON `subcategoryRoutes` (`toDepartment`);