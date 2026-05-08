-- Location Maps table
CREATE TABLE IF NOT EXISTS `locationMaps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`venueType` varchar(50) NOT NULL,
	`floorPlanUrl` text,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locationMaps_id` PRIMARY KEY(`id`),
	INDEX `locationMaps_user_idx` (`userId`),
	INDEX `locationMaps_venueType_idx` (`venueType`)
);

-- Location Map Nodes table
CREATE TABLE IF NOT EXISTS `locationMapNodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mapId` int NOT NULL,
	`nodeId` varchar(50) NOT NULL,
	`x` int NOT NULL,
	`y` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locationMapNodes_id` PRIMARY KEY(`id`),
	INDEX `locationMapNodes_map_idx` (`mapId`),
	INDEX `locationMapNodes_nodeId_idx` (`nodeId`)
);

-- Location Map Edges table
CREATE TABLE IF NOT EXISTS `locationMapEdges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mapId` int NOT NULL,
	`fromNodeId` varchar(50) NOT NULL,
	`toNodeId` varchar(50) NOT NULL,
	`distance` decimal(10, 2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locationMapEdges_id` PRIMARY KEY(`id`),
	INDEX `locationMapEdges_map_idx` (`mapId`),
	INDEX `locationMapEdges_from_idx` (`fromNodeId`),
	INDEX `locationMapEdges_to_idx` (`toNodeId`)
);

-- Location Map Locations table
CREATE TABLE IF NOT EXISTS `locationMapLocations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mapId` int NOT NULL,
	`nodeId` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`subcategory` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locationMapLocations_id` PRIMARY KEY(`id`),
	INDEX `locationMapLocations_map_idx` (`mapId`),
	INDEX `locationMapLocations_node_idx` (`nodeId`)
);

-- Location Map Routes table
CREATE TABLE IF NOT EXISTS `locationMapRoutes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mapId` int NOT NULL,
	`routeId` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`fromLocationId` int NOT NULL,
	`toLocationId` int NOT NULL,
	`waypoints` json,
	`totalDistance` decimal(10, 2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locationMapRoutes_id` PRIMARY KEY(`id`),
	INDEX `locationMapRoutes_map_idx` (`mapId`),
	INDEX `locationMapRoutes_routeId_idx` (`routeId`)
);
