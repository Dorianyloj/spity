CREATE TABLE `media_uploads` (
	`id` varchar(36) NOT NULL,
	`owner_id` varchar(36) NOT NULL,
	`byte_size` int unsigned NOT NULL,
	`width` int unsigned NOT NULL,
	`height` int unsigned NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `media_uploads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `media_uploads` ADD CONSTRAINT `media_uploads_owner_id_users_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `media_uploads_owner_idx` ON `media_uploads` (`owner_id`);