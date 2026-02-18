CREATE TABLE `adAnalytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`advertisementId` int NOT NULL,
	`date` timestamp NOT NULL DEFAULT (now()),
	`impressions` int NOT NULL DEFAULT 0,
	`clicks` int NOT NULL DEFAULT 0,
	`conversions` int NOT NULL DEFAULT 0,
	`conversionValue` decimal(10,2) DEFAULT '0.00',
	`ctr` decimal(5,2),
	`conversionRate` decimal(5,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `adAnalytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `adPayments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`advertisementId` int NOT NULL,
	`stripePaymentIntentId` varchar(255) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'BRL',
	`status` enum('pending','succeeded','failed','refunded') NOT NULL,
	`invoiceNumber` varchar(50),
	`invoiceUrl` varchar(500),
	`paidAt` timestamp,
	`refundedAt` timestamp,
	`refundReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adPayments_id` PRIMARY KEY(`id`),
	CONSTRAINT `adPayments_stripePaymentIntentId_unique` UNIQUE(`stripePaymentIntentId`),
	CONSTRAINT `adPayments_invoiceNumber_unique` UNIQUE(`invoiceNumber`)
);
--> statement-breakpoint
CREATE TABLE `advertisements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`advertiserId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` varchar(500) NOT NULL,
	`productName` varchar(255),
	`productCategory` varchar(100) NOT NULL,
	`targetCategories` json NOT NULL,
	`adType` enum('product','promotion','store') NOT NULL,
	`duration` enum('1day','3days','7days','14days') NOT NULL,
	`numberOfStores` int NOT NULL,
	`selectedStores` json,
	`region` varchar(100),
	`status` enum('draft','pending_payment','active','paused','expired','cancelled') NOT NULL DEFAULT 'draft',
	`priorityPosition` int NOT NULL,
	`startDate` timestamp,
	`endDate` timestamp,
	`pauseRequestedAt` timestamp,
	`pauseEffectiveAt` timestamp,
	`totalCost` decimal(10,2) NOT NULL,
	`paymentIntentId` varchar(255),
	`invoiceUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `advertisements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `advertisers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`companyDocument` varchar(20) NOT NULL,
	`contactEmail` varchar(320) NOT NULL,
	`contactPhone` varchar(20),
	`website` varchar(255),
	`status` enum('pending','approved','rejected','suspended') NOT NULL DEFAULT 'pending',
	`approvedBy` int NOT NULL DEFAULT 0,
	`approvalDate` timestamp,
	`rejectionReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `advertisers_id` PRIMARY KEY(`id`),
	CONSTRAINT `advertisers_companyDocument_unique` UNIQUE(`companyDocument`)
);
--> statement-breakpoint
CREATE TABLE `correlatedCategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`primaryCategory` varchar(100) NOT NULL,
	`relatedCategory` varchar(100) NOT NULL,
	`correlationScore` decimal(3,2) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `correlatedCategories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pricingPlans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`duration` enum('1day','3days','7days','14days') NOT NULL,
	`minStores` int NOT NULL,
	`maxStores` int NOT NULL,
	`pricePerStore` decimal(10,2) NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pricingPlans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `adAnalytics_ad_idx` ON `adAnalytics` (`advertisementId`);--> statement-breakpoint
CREATE INDEX `adAnalytics_date_idx` ON `adAnalytics` (`date`);--> statement-breakpoint
CREATE INDEX `adPayments_ad_idx` ON `adPayments` (`advertisementId`);--> statement-breakpoint
CREATE INDEX `adPayments_status_idx` ON `adPayments` (`status`);--> statement-breakpoint
CREATE INDEX `advertisements_advertiser_idx` ON `advertisements` (`advertiserId`);--> statement-breakpoint
CREATE INDEX `advertisements_status_idx` ON `advertisements` (`status`);--> statement-breakpoint
CREATE INDEX `advertisements_category_idx` ON `advertisements` (`productCategory`);--> statement-breakpoint
CREATE INDEX `advertisers_userId_idx` ON `advertisers` (`userId`);--> statement-breakpoint
CREATE INDEX `advertisers_status_idx` ON `advertisers` (`status`);--> statement-breakpoint
CREATE INDEX `correlatedCategories_primary_idx` ON `correlatedCategories` (`primaryCategory`);--> statement-breakpoint
CREATE INDEX `correlatedCategories_related_idx` ON `correlatedCategories` (`relatedCategory`);--> statement-breakpoint
CREATE INDEX `pricingPlans_duration_idx` ON `pricingPlans` (`duration`);