CREATE TABLE `categoryProducts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`sku` varchar(100) NOT NULL,
	`ean` varchar(13),
	`curvaFaturamento` enum('A','B','C') NOT NULL,
	`curvaLucratividade` enum('A','B','C') NOT NULL,
	`papelEstrategico` varchar(100) NOT NULL,
	`defaultGiro` enum('Baixo','Médio','Alto') NOT NULL,
	`defaultMargem` enum('Baixa','Média','Alta') NOT NULL,
	`defaultLargura` int NOT NULL,
	`defaultComprimento` int NOT NULL,
	`defaultAltura` int NOT NULL,
	`salesVolume` decimal(12,2) NOT NULL DEFAULT '0.00',
	`turnoverRate` decimal(5,2) NOT NULL DEFAULT '0.00',
	`profitMargin` decimal(5,2) NOT NULL DEFAULT '0.00',
	`stockoutRate` decimal(5,2) NOT NULL DEFAULT '0.00',
	`lastUpdatedMetrics` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`description` text,
	`imageUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categoryProducts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productPerformanceHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`date` timestamp NOT NULL DEFAULT (now()),
	`salesVolume` decimal(12,2) NOT NULL,
	`turnoverRate` decimal(5,2) NOT NULL,
	`profitMargin` decimal(5,2) NOT NULL,
	`stockoutRate` decimal(5,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `productPerformanceHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `categoryProducts_category_idx` ON `categoryProducts` (`categoryId`);--> statement-breakpoint
CREATE INDEX `categoryProducts_user_idx` ON `categoryProducts` (`userId`);--> statement-breakpoint
CREATE INDEX `categoryProducts_sku_idx` ON `categoryProducts` (`sku`);--> statement-breakpoint
CREATE INDEX `categoryProducts_ean_idx` ON `categoryProducts` (`ean`);--> statement-breakpoint
CREATE INDEX `productPerformanceHistory_product_idx` ON `productPerformanceHistory` (`productId`);--> statement-breakpoint
CREATE INDEX `productPerformanceHistory_date_idx` ON `productPerformanceHistory` (`date`);