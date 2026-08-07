CREATE TABLE `dataDeletionRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`requestType` enum('full_deletion','partial_deletion','data_export') NOT NULL,
	`platform` enum('app_android','app_ios','web','other') NOT NULL,
	`dataToDelete` json,
	`reason` text,
	`status` enum('pending','in_progress','completed','rejected') NOT NULL DEFAULT 'pending',
	`emailConfirmed` boolean NOT NULL DEFAULT false,
	`confirmationToken` varchar(64),
	`confirmedAt` timestamp,
	`processedBy` int,
	`processedAt` timestamp,
	`processingNotes` text,
	`dueDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dataDeletionRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `dataDeletionRequests_email_idx` ON `dataDeletionRequests` (`email`);--> statement-breakpoint
CREATE INDEX `dataDeletionRequests_status_idx` ON `dataDeletionRequests` (`status`);--> statement-breakpoint
CREATE INDEX `dataDeletionRequests_token_idx` ON `dataDeletionRequests` (`confirmationToken`);