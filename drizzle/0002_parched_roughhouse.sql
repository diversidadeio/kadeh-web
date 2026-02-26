CREATE TABLE `adBankPayments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'BRL',
	`status` enum('pending','confirmed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`invoiceNumber` varchar(50),
	`invoiceUrl` varchar(500),
	`paymentProofUrl` varchar(500),
	`paidAt` timestamp,
	`confirmedAt` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adBankPayments_id` PRIMARY KEY(`id`),
	CONSTRAINT `adBankPayments_invoiceNumber_unique` UNIQUE(`invoiceNumber`)
);
--> statement-breakpoint
CREATE TABLE `adCampaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`advertiserId` int NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`companyDocument` varchar(20) NOT NULL,
	`contactEmail` varchar(320) NOT NULL,
	`contactPhone` varchar(20) NOT NULL,
	`duration` enum('1day','3days','7days','14days') NOT NULL,
	`numberOfStores` int NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`productName` varchar(255) NOT NULL,
	`productImageUrl` varchar(500) NOT NULL,
	`productEAN13` varchar(13) NOT NULL,
	`basePrice` decimal(10,2) NOT NULL,
	`multiplier` decimal(5,2) NOT NULL,
	`totalCost` decimal(10,2) NOT NULL,
	`status` enum('pending_approval','approved','rejected','payment_pending','active','completed','cancelled') NOT NULL DEFAULT 'pending_approval',
	`approvedBy` int,
	`approvalDate` timestamp,
	`rejectionReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adCampaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `adBankPayments_campaign_idx` ON `adBankPayments` (`campaignId`);--> statement-breakpoint
CREATE INDEX `adBankPayments_status_idx` ON `adBankPayments` (`status`);--> statement-breakpoint
CREATE INDEX `adCampaigns_advertiser_idx` ON `adCampaigns` (`advertiserId`);--> statement-breakpoint
CREATE INDEX `adCampaigns_status_idx` ON `adCampaigns` (`status`);--> statement-breakpoint
CREATE INDEX `adCampaigns_startDate_idx` ON `adCampaigns` (`startDate`);