CREATE TABLE `salesCategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`storeId` int,
	`categoryName` varchar(255) NOT NULL,
	`mainCategory` enum('Alimentar','Não-Alimentar') NOT NULL,
	`totalUnitsPerPeriod` int NOT NULL,
	`totalRevenuePerPeriod` decimal(12,2) NOT NULL,
	`totalCostPerPeriod` decimal(12,2) NOT NULL,
	`totalMarginPerPeriod` decimal(12,2) NOT NULL,
	`averageMarginPercentage` decimal(5,2) NOT NULL,
	`averageTurnover` decimal(10,2) NOT NULL,
	`lowMarginThreshold` decimal(5,2) NOT NULL,
	`highMarginThreshold` decimal(5,2) NOT NULL,
	`lowTurnoverThreshold` decimal(10,2) NOT NULL,
	`highTurnoverThreshold` decimal(10,2) NOT NULL,
	`periodStartDate` timestamp NOT NULL,
	`periodEndDate` timestamp NOT NULL,
	`periodDays` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `salesCategories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `salesProducts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`salesCategoryId` int NOT NULL,
	`productName` varchar(255) NOT NULL,
	`productEAN` varchar(13),
	`unitsPerPeriod` int NOT NULL,
	`revenuePerPeriod` decimal(12,2) NOT NULL,
	`costPerUnit` decimal(10,2) NOT NULL,
	`costPerPeriod` decimal(12,2) NOT NULL,
	`marginPerPeriod` decimal(12,2) NOT NULL,
	`marginPercentage` decimal(5,2) NOT NULL,
	`turnover` decimal(10,2) NOT NULL,
	`marginToTurnoverRatio` decimal(10,4) NOT NULL,
	`marginClassification` enum('Baixa','Média','Alta') NOT NULL,
	`turnoverClassification` enum('Baixo','Médio','Alto') NOT NULL,
	`zone` enum('Altura dos olhos','Altura das mãos','Parte de Baixo') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `salesProducts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `salesCategories_user_idx` ON `salesCategories` (`userId`);--> statement-breakpoint
CREATE INDEX `salesCategories_store_idx` ON `salesCategories` (`storeId`);--> statement-breakpoint
CREATE INDEX `salesCategories_category_idx` ON `salesCategories` (`categoryName`);--> statement-breakpoint
CREATE INDEX `salesProducts_user_idx` ON `salesProducts` (`userId`);--> statement-breakpoint
CREATE INDEX `salesProducts_category_idx` ON `salesProducts` (`salesCategoryId`);--> statement-breakpoint
CREATE INDEX `salesProducts_product_idx` ON `salesProducts` (`productEAN`);