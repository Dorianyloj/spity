CREATE TABLE `crag_topos` (
	`id` varchar(36) NOT NULL,
	`falaise_id` varchar(36) NOT NULL,
	`author_id` varchar(36) NOT NULL,
	`crag_topo_kind` enum('link','pdf') NOT NULL,
	`title` varchar(255) NOT NULL,
	`external_url` varchar(500),
	`byte_size` int unsigned,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `crag_topos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `crag_topos` ADD CONSTRAINT `crag_topos_falaise_id_falaises_id_fk` FOREIGN KEY (`falaise_id`) REFERENCES `falaises`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `crag_topos` ADD CONSTRAINT `crag_topos_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `crag_topos_falaise_created_idx` ON `crag_topos` (`falaise_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `crag_topos_author_idx` ON `crag_topos` (`author_id`);