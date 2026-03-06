CREATE TABLE `categoryPerformanceHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int NOT NULL,
	`date` timestamp NOT NULL DEFAULT (now()),
	`salesVolume` decimal(12,2) NOT NULL,
	`turnoverRate` decimal(5,2) NOT NULL,
	`profitMargin` decimal(5,2) NOT NULL,
	`stockoutRate` decimal(5,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categoryPerformanceHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productCategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`mainCategory` enum('Alimentar','Não-Alimentar') NOT NULL,
	`curvaFaturamento` enum('A','B','C') NOT NULL,
	`curvaLucratividade` enum('A','B','C') NOT NULL,
	`papelEstrategico` varchar(100) NOT NULL,
	`defaultGiro` enum('Baixo','Médio','Alto') NOT NULL,
	`defaultMargem` enum('Baixa','Média','Alta') NOT NULL,
	`defaultLargura` int NOT NULL,
	`defaultComprimento` int NOT NULL,
	`salesVolume` decimal(12,2) NOT NULL DEFAULT '0.00',
	`turnoverRate` decimal(5,2) NOT NULL DEFAULT '0.00',
	`profitMargin` decimal(5,2) NOT NULL DEFAULT '0.00',
	`stockoutRate` decimal(5,2) NOT NULL DEFAULT '0.00',
	`lastUpdatedMetrics` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productCategories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `categoryPerformanceHistory_category_idx` ON `categoryPerformanceHistory` (`categoryId`);--> statement-breakpoint
CREATE INDEX `categoryPerformanceHistory_date_idx` ON `categoryPerformanceHistory` (`date`);--> statement-breakpoint
CREATE INDEX `productCategories_user_idx` ON `productCategories` (`userId`);--> statement-breakpoint
CREATE INDEX `productCategories_mainCategory_idx` ON `productCategories` (`mainCategory`);--> statement-breakpoint
CREATE INDEX `productCategories_name_idx` ON `productCategories` (`name`);