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
	`status` enum('pending_approval','approved','rejected','payment_pending','active','completed','cancelled','refunded') NOT NULL DEFAULT 'pending_approval',
	`approvedBy` int,
	`approvalDate` timestamp,
	`rejectionReason` text,
	`stripeSessionId` varchar(255),
	`stripePaymentIntentId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adCampaigns_id` PRIMARY KEY(`id`)
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
	`retailerCode` varchar(50),
	`promotionLink` varchar(500),
	`storeCount` int NOT NULL DEFAULT 1,
	`productCount` int NOT NULL DEFAULT 0,
	`advertisedProductCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `advertisements_id` PRIMARY KEY(`id`),
	CONSTRAINT `advertisements_retailerCode_unique` UNIQUE(`retailerCode`)
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
CREATE TABLE `capacityReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storeId` int NOT NULL,
	`moduleId` int,
	`totalCapacity` int NOT NULL,
	`totalOccupied` int NOT NULL,
	`occupancyPercentage` decimal(5,2) NOT NULL,
	`reportData` json NOT NULL,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `capacityReports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
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
CREATE TABLE `corridors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storeId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`positionX` int NOT NULL,
	`positionY` int NOT NULL,
	`width` int NOT NULL,
	`length` int NOT NULL,
	`order` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `corridors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gondolas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`gondolaNumber` int NOT NULL,
	`name` varchar(100),
	`categoryId` int,
	`totalPositions` int NOT NULL DEFAULT 6,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gondolas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `locationMapEdges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mapId` int NOT NULL,
	`fromNodeId` varchar(50) NOT NULL,
	`toNodeId` varchar(50) NOT NULL,
	`distance` decimal(10,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locationMapEdges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `locationMapLocations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mapId` int NOT NULL,
	`nodeId` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`subcategory` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locationMapLocations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `locationMapNodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mapId` int NOT NULL,
	`nodeId` varchar(50) NOT NULL,
	`x` int NOT NULL,
	`y` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locationMapNodes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `locationMapRoutes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mapId` int NOT NULL,
	`routeId` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`fromLocationId` int NOT NULL,
	`toLocationId` int NOT NULL,
	`waypoints` json,
	`totalDistance` decimal(10,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locationMapRoutes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `locationMaps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`venueType` varchar(50) NOT NULL,
	`floorPlanUrl` text,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locationMaps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `moduleTemplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('gondola','freezer_horizontal','freezer_vertical','island','produce_stand','hanging_display') NOT NULL,
	`description` text,
	`defaultWidth` int NOT NULL,
	`defaultDepth` int NOT NULL,
	`defaultHeight` int NOT NULL,
	`defaultShelves` int NOT NULL,
	`isCustomizable` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `moduleTemplates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storeId` int NOT NULL,
	`corridorId` int,
	`templateId` int,
	`name` varchar(255) NOT NULL,
	`type` enum('gondola','freezer_horizontal','freezer_vertical','island','produce_stand','hanging_display') NOT NULL,
	`positionX` int NOT NULL,
	`positionY` int NOT NULL,
	`width` int NOT NULL,
	`depth` int NOT NULL,
	`height` int NOT NULL,
	`shelfHeight` int,
	`numberOfShelves` int NOT NULL,
	`totalCapacity` int NOT NULL,
	`totalOccupied` int NOT NULL DEFAULT 0,
	`occupancyPercentage` decimal(5,2) NOT NULL DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `modules_id` PRIMARY KEY(`id`)
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
	`defaultAltura` int NOT NULL DEFAULT 20,
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
CREATE TABLE `productPlacements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storeId` int NOT NULL,
	`moduleId` int NOT NULL,
	`shelfId` int NOT NULL,
	`productId` varchar(255) NOT NULL,
	`productName` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`productWidth` int NOT NULL,
	`productDepth` int NOT NULL,
	`productHeight` int NOT NULL,
	`giro` enum('A','B','C') NOT NULL,
	`margem` enum('A','B','C') NOT NULL,
	`zone` enum('Altura dos olhos','Altura das mãos','Parte de Baixo') NOT NULL,
	`quantity` int NOT NULL,
	`volume` int NOT NULL,
	`positionOrder` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productPlacements_id` PRIMARY KEY(`id`)
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
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productCode` varchar(50) NOT NULL,
	`gondolaNumber` int NOT NULL,
	`position` varchar(20) NOT NULL,
	`category` varchar(100) NOT NULL,
	`subcategory` varchar(100) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
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
CREATE TABLE `shelves` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`order` int NOT NULL,
	`width` int NOT NULL,
	`depth` int NOT NULL,
	`height` int NOT NULL,
	`zone` enum('Altura dos olhos','Altura das mãos','Parte de Baixo') NOT NULL,
	`capacity` int NOT NULL,
	`occupiedSpace` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shelves_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `storeLayoutCategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(100) NOT NULL,
	`nameEn` varchar(100),
	`x` int NOT NULL,
	`y` int NOT NULL,
	`radius` int NOT NULL DEFAULT 20,
	`color` varchar(7) NOT NULL DEFAULT '#3b82f6',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `storeLayoutCategories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `storeLayoutRoutes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fromCategoryId` int NOT NULL,
	`toCategoryId` int NOT NULL,
	`pathPoints` json NOT NULL,
	`distance` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `storeLayoutRoutes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`layoutType` enum('linear','grid','custom') NOT NULL DEFAULT 'linear',
	`width` int NOT NULL,
	`length` int NOT NULL,
	`height` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
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
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE INDEX `adAnalytics_ad_idx` ON `adAnalytics` (`advertisementId`);--> statement-breakpoint
CREATE INDEX `adAnalytics_date_idx` ON `adAnalytics` (`date`);--> statement-breakpoint
CREATE INDEX `adBankPayments_campaign_idx` ON `adBankPayments` (`campaignId`);--> statement-breakpoint
CREATE INDEX `adBankPayments_status_idx` ON `adBankPayments` (`status`);--> statement-breakpoint
CREATE INDEX `adCampaigns_advertiser_idx` ON `adCampaigns` (`advertiserId`);--> statement-breakpoint
CREATE INDEX `adCampaigns_status_idx` ON `adCampaigns` (`status`);--> statement-breakpoint
CREATE INDEX `adCampaigns_startDate_idx` ON `adCampaigns` (`startDate`);--> statement-breakpoint
CREATE INDEX `adPayments_ad_idx` ON `adPayments` (`advertisementId`);--> statement-breakpoint
CREATE INDEX `adPayments_status_idx` ON `adPayments` (`status`);--> statement-breakpoint
CREATE INDEX `advertisements_advertiser_idx` ON `advertisements` (`advertiserId`);--> statement-breakpoint
CREATE INDEX `advertisements_status_idx` ON `advertisements` (`status`);--> statement-breakpoint
CREATE INDEX `advertisements_category_idx` ON `advertisements` (`productCategory`);--> statement-breakpoint
CREATE INDEX `advertisements_retailerCode_idx` ON `advertisements` (`retailerCode`);--> statement-breakpoint
CREATE INDEX `advertisers_userId_idx` ON `advertisers` (`userId`);--> statement-breakpoint
CREATE INDEX `advertisers_status_idx` ON `advertisers` (`status`);--> statement-breakpoint
CREATE INDEX `campaignProducts_campaign_idx` ON `campaignProducts` (`campaignId`);--> statement-breakpoint
CREATE INDEX `capacityReports_store_idx` ON `capacityReports` (`storeId`);--> statement-breakpoint
CREATE INDEX `capacityReports_module_idx` ON `capacityReports` (`moduleId`);--> statement-breakpoint
CREATE INDEX `categoryPerformanceHistory_category_idx` ON `categoryPerformanceHistory` (`categoryId`);--> statement-breakpoint
CREATE INDEX `categoryPerformanceHistory_date_idx` ON `categoryPerformanceHistory` (`date`);--> statement-breakpoint
CREATE INDEX `categoryProducts_category_idx` ON `categoryProducts` (`categoryId`);--> statement-breakpoint
CREATE INDEX `categoryProducts_user_idx` ON `categoryProducts` (`userId`);--> statement-breakpoint
CREATE INDEX `categoryProducts_sku_idx` ON `categoryProducts` (`sku`);--> statement-breakpoint
CREATE INDEX `categoryProducts_ean_idx` ON `categoryProducts` (`ean`);--> statement-breakpoint
CREATE INDEX `correlatedCategories_primary_idx` ON `correlatedCategories` (`primaryCategory`);--> statement-breakpoint
CREATE INDEX `correlatedCategories_related_idx` ON `correlatedCategories` (`relatedCategory`);--> statement-breakpoint
CREATE INDEX `corridors_store_idx` ON `corridors` (`storeId`);--> statement-breakpoint
CREATE INDEX `gondolas_user_idx` ON `gondolas` (`userId`);--> statement-breakpoint
CREATE INDEX `gondolas_number_idx` ON `gondolas` (`gondolaNumber`);--> statement-breakpoint
CREATE INDEX `gondolas_category_idx` ON `gondolas` (`categoryId`);--> statement-breakpoint
CREATE INDEX `locationMapEdges_map_idx` ON `locationMapEdges` (`mapId`);--> statement-breakpoint
CREATE INDEX `locationMapEdges_from_idx` ON `locationMapEdges` (`fromNodeId`);--> statement-breakpoint
CREATE INDEX `locationMapEdges_to_idx` ON `locationMapEdges` (`toNodeId`);--> statement-breakpoint
CREATE INDEX `locationMapLocations_map_idx` ON `locationMapLocations` (`mapId`);--> statement-breakpoint
CREATE INDEX `locationMapLocations_node_idx` ON `locationMapLocations` (`nodeId`);--> statement-breakpoint
CREATE INDEX `locationMapNodes_map_idx` ON `locationMapNodes` (`mapId`);--> statement-breakpoint
CREATE INDEX `locationMapNodes_nodeId_idx` ON `locationMapNodes` (`nodeId`);--> statement-breakpoint
CREATE INDEX `locationMapRoutes_map_idx` ON `locationMapRoutes` (`mapId`);--> statement-breakpoint
CREATE INDEX `locationMapRoutes_routeId_idx` ON `locationMapRoutes` (`routeId`);--> statement-breakpoint
CREATE INDEX `locationMaps_user_idx` ON `locationMaps` (`userId`);--> statement-breakpoint
CREATE INDEX `locationMaps_venueType_idx` ON `locationMaps` (`venueType`);--> statement-breakpoint
CREATE INDEX `moduleTemplates_user_idx` ON `moduleTemplates` (`userId`);--> statement-breakpoint
CREATE INDEX `moduleTemplates_type_idx` ON `moduleTemplates` (`type`);--> statement-breakpoint
CREATE INDEX `modules_store_idx` ON `modules` (`storeId`);--> statement-breakpoint
CREATE INDEX `modules_corridor_idx` ON `modules` (`corridorId`);--> statement-breakpoint
CREATE INDEX `modules_type_idx` ON `modules` (`type`);--> statement-breakpoint
CREATE INDEX `pricingPlans_duration_idx` ON `pricingPlans` (`duration`);--> statement-breakpoint
CREATE INDEX `productCategories_user_idx` ON `productCategories` (`userId`);--> statement-breakpoint
CREATE INDEX `productCategories_mainCategory_idx` ON `productCategories` (`mainCategory`);--> statement-breakpoint
CREATE INDEX `productCategories_name_idx` ON `productCategories` (`name`);--> statement-breakpoint
CREATE INDEX `productLocations_user_idx` ON `productLocations` (`userId`);--> statement-breakpoint
CREATE INDEX `productLocations_productCode_idx` ON `productLocations` (`productCode`);--> statement-breakpoint
CREATE INDEX `productLocations_gondola_idx` ON `productLocations` (`gondolaNumber`);--> statement-breakpoint
CREATE INDEX `productLocations_department_idx` ON `productLocations` (`departmentName`);--> statement-breakpoint
CREATE INDEX `productLocations_subcategory_idx` ON `productLocations` (`subcategory`);--> statement-breakpoint
CREATE INDEX `productPerformanceHistory_product_idx` ON `productPerformanceHistory` (`productId`);--> statement-breakpoint
CREATE INDEX `productPerformanceHistory_date_idx` ON `productPerformanceHistory` (`date`);--> statement-breakpoint
CREATE INDEX `productPlacements_store_idx` ON `productPlacements` (`storeId`);--> statement-breakpoint
CREATE INDEX `productPlacements_module_idx` ON `productPlacements` (`moduleId`);--> statement-breakpoint
CREATE INDEX `productPlacements_shelf_idx` ON `productPlacements` (`shelfId`);--> statement-breakpoint
CREATE INDEX `productPlacements_product_idx` ON `productPlacements` (`productId`);--> statement-breakpoint
CREATE INDEX `productSubcategoryMappings_user_idx` ON `productSubcategoryMappings` (`userId`);--> statement-breakpoint
CREATE INDEX `productSubcategoryMappings_excelCategory_idx` ON `productSubcategoryMappings` (`excelCategory`);--> statement-breakpoint
CREATE INDEX `productSubcategoryMappings_department_idx` ON `productSubcategoryMappings` (`departmentName`);--> statement-breakpoint
CREATE INDEX `productSubcategoryMappings_subcategory_idx` ON `productSubcategoryMappings` (`subcategory`);--> statement-breakpoint
CREATE INDEX `products_user_idx` ON `products` (`userId`);--> statement-breakpoint
CREATE INDEX `products_code_idx` ON `products` (`productCode`);--> statement-breakpoint
CREATE INDEX `products_gondola_idx` ON `products` (`gondolaNumber`);--> statement-breakpoint
CREATE INDEX `products_category_idx` ON `products` (`category`);--> statement-breakpoint
CREATE INDEX `products_subcategory_idx` ON `products` (`subcategory`);--> statement-breakpoint
CREATE INDEX `salesCategories_user_idx` ON `salesCategories` (`userId`);--> statement-breakpoint
CREATE INDEX `salesCategories_store_idx` ON `salesCategories` (`storeId`);--> statement-breakpoint
CREATE INDEX `salesCategories_category_idx` ON `salesCategories` (`categoryName`);--> statement-breakpoint
CREATE INDEX `salesProducts_user_idx` ON `salesProducts` (`userId`);--> statement-breakpoint
CREATE INDEX `salesProducts_category_idx` ON `salesProducts` (`salesCategoryId`);--> statement-breakpoint
CREATE INDEX `salesProducts_product_idx` ON `salesProducts` (`productEAN`);--> statement-breakpoint
CREATE INDEX `shelves_module_idx` ON `shelves` (`moduleId`);--> statement-breakpoint
CREATE INDEX `shelves_zone_idx` ON `shelves` (`zone`);--> statement-breakpoint
CREATE INDEX `storeLayoutCategories_user_idx` ON `storeLayoutCategories` (`userId`);--> statement-breakpoint
CREATE INDEX `storeLayoutCategories_code_idx` ON `storeLayoutCategories` (`code`);--> statement-breakpoint
CREATE INDEX `storeLayoutRoutes_user_idx` ON `storeLayoutRoutes` (`userId`);--> statement-breakpoint
CREATE INDEX `storeLayoutRoutes_from_idx` ON `storeLayoutRoutes` (`fromCategoryId`);--> statement-breakpoint
CREATE INDEX `storeLayoutRoutes_to_idx` ON `storeLayoutRoutes` (`toCategoryId`);--> statement-breakpoint
CREATE INDEX `stores_user_idx` ON `stores` (`userId`);--> statement-breakpoint
CREATE INDEX `stripeCheckoutSessions_campaign_idx` ON `stripeCheckoutSessions` (`campaignId`);--> statement-breakpoint
CREATE INDEX `stripeCheckoutSessions_stripe_idx` ON `stripeCheckoutSessions` (`stripeSessionId`);--> statement-breakpoint
CREATE INDEX `stripeCheckoutSessions_status_idx` ON `stripeCheckoutSessions` (`status`);--> statement-breakpoint
CREATE INDEX `stripeCustomers_advertiser_idx` ON `stripeCustomers` (`advertiserId`);--> statement-breakpoint
CREATE INDEX `stripeCustomers_stripe_idx` ON `stripeCustomers` (`stripeCustomerId`);--> statement-breakpoint
CREATE INDEX `stripePayments_campaign_idx` ON `stripePayments` (`campaignId`);--> statement-breakpoint
CREATE INDEX `stripePayments_stripe_idx` ON `stripePayments` (`stripePaymentIntentId`);--> statement-breakpoint
CREATE INDEX `stripePayments_status_idx` ON `stripePayments` (`status`);--> statement-breakpoint
CREATE INDEX `subcategoryRoutes_user_idx` ON `subcategoryRoutes` (`userId`);--> statement-breakpoint
CREATE INDEX `subcategoryRoutes_from_idx` ON `subcategoryRoutes` (`fromSubcategory`);--> statement-breakpoint
CREATE INDEX `subcategoryRoutes_to_idx` ON `subcategoryRoutes` (`toSubcategory`);--> statement-breakpoint
CREATE INDEX `subcategoryRoutes_fromDept_idx` ON `subcategoryRoutes` (`fromDepartment`);--> statement-breakpoint
CREATE INDEX `subcategoryRoutes_toDept_idx` ON `subcategoryRoutes` (`toDepartment`);