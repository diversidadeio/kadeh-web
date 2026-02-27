CREATE TABLE `campaignProducts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`productName` varchar(255) NOT NULL,
	`productImageUrl` varchar(500) NOT NULL,
	`productEAN13` varchar(13) NOT NULL,
	`position` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaignProducts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `campaignProducts_campaign_idx` ON `campaignProducts` (`campaignId`);