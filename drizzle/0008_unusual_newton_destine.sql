CREATE TABLE `stripeCheckoutSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`stripeSessionId` varchar(255) NOT NULL,
	`stripeCustomerId` varchar(255),
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'BRL',
	`status` enum('open','complete','expired') NOT NULL DEFAULT 'open',
	`paymentStatus` enum('unpaid','paid','no_payment_required') NOT NULL DEFAULT 'unpaid',
	`checkoutUrl` varchar(500) NOT NULL,
	`successUrl` varchar(500) NOT NULL,
	`cancelUrl` varchar(500) NOT NULL,
	`expiresAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stripeCheckoutSessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `stripeCheckoutSessions_stripeSessionId_unique` UNIQUE(`stripeSessionId`)
);
--> statement-breakpoint
CREATE TABLE `stripeCustomers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`advertiserId` int NOT NULL,
	`stripeCustomerId` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stripeCustomers_id` PRIMARY KEY(`id`),
	CONSTRAINT `stripeCustomers_advertiserId_unique` UNIQUE(`advertiserId`),
	CONSTRAINT `stripeCustomers_stripeCustomerId_unique` UNIQUE(`stripeCustomerId`)
);
--> statement-breakpoint
CREATE TABLE `stripePayments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`stripePaymentIntentId` varchar(255) NOT NULL,
	`stripeCustomerId` varchar(255),
	`stripeChargeId` varchar(255),
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'BRL',
	`status` enum('processing','succeeded','requires_action','canceled','failed') NOT NULL,
	`paymentMethod` varchar(50),
	`receiptUrl` varchar(500),
	`invoiceNumber` varchar(50),
	`invoiceUrl` varchar(500),
	`paidAt` timestamp,
	`refundedAt` timestamp,
	`refundAmount` decimal(10,2),
	`refundReason` text,
	`failureReason` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stripePayments_id` PRIMARY KEY(`id`),
	CONSTRAINT `stripePayments_stripePaymentIntentId_unique` UNIQUE(`stripePaymentIntentId`),
	CONSTRAINT `stripePayments_stripeChargeId_unique` UNIQUE(`stripeChargeId`),
	CONSTRAINT `stripePayments_invoiceNumber_unique` UNIQUE(`invoiceNumber`)
);
--> statement-breakpoint
CREATE INDEX `stripeCheckoutSessions_campaign_idx` ON `stripeCheckoutSessions` (`campaignId`);--> statement-breakpoint
CREATE INDEX `stripeCheckoutSessions_stripe_idx` ON `stripeCheckoutSessions` (`stripeSessionId`);--> statement-breakpoint
CREATE INDEX `stripeCheckoutSessions_status_idx` ON `stripeCheckoutSessions` (`status`);--> statement-breakpoint
CREATE INDEX `stripeCustomers_advertiser_idx` ON `stripeCustomers` (`advertiserId`);--> statement-breakpoint
CREATE INDEX `stripeCustomers_stripe_idx` ON `stripeCustomers` (`stripeCustomerId`);--> statement-breakpoint
CREATE INDEX `stripePayments_campaign_idx` ON `stripePayments` (`campaignId`);--> statement-breakpoint
CREATE INDEX `stripePayments_stripe_idx` ON `stripePayments` (`stripePaymentIntentId`);--> statement-breakpoint
CREATE INDEX `stripePayments_status_idx` ON `stripePayments` (`status`);