ALTER TABLE `adCampaigns` MODIFY COLUMN `status` enum('pending_approval','approved','rejected','payment_pending','active','completed','cancelled','refunded') NOT NULL DEFAULT 'pending_approval';--> statement-breakpoint
ALTER TABLE `adCampaigns` ADD `stripeSessionId` varchar(255);--> statement-breakpoint
ALTER TABLE `adCampaigns` ADD `stripePaymentIntentId` varchar(255);