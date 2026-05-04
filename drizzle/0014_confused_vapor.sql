ALTER TABLE `advertisements` ADD `retailerCode` varchar(50);--> statement-breakpoint
ALTER TABLE `advertisements` ADD `promotionLink` varchar(500);--> statement-breakpoint
ALTER TABLE `advertisements` ADD `storeCount` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `advertisements` ADD `productCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `advertisements` ADD `advertisedProductCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `advertisements` ADD CONSTRAINT `advertisements_retailerCode_unique` UNIQUE(`retailerCode`);--> statement-breakpoint
CREATE INDEX `advertisements_retailerCode_idx` ON `advertisements` (`retailerCode`);