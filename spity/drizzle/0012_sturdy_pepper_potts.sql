CREATE TABLE `place_change_request_photos` (
	`id` varchar(36) NOT NULL,
	`request_id` varchar(36) NOT NULL,
	`media_id` varchar(36) NOT NULL,
	CONSTRAINT `place_change_request_photos_id` PRIMARY KEY(`id`),
	CONSTRAINT `place_change_request_photo_unique` UNIQUE(`request_id`,`media_id`)
);
--> statement-breakpoint
CREATE TABLE `place_change_requests` (
	`id` varchar(36) NOT NULL,
	`author_id` varchar(36) NOT NULL,
	`kind` enum('salle','falaise') NOT NULL,
	`salle_id` varchar(36),
	`falaise_id` varchar(36),
	`change_request_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`values` json NOT NULL,
	`message` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`reviewed_at` timestamp,
	`reviewed_by` varchar(36),
	`review_reason` varchar(500),
	CONSTRAINT `place_change_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `place_photos` (
	`id` varchar(36) NOT NULL,
	`salle_id` varchar(36),
	`falaise_id` varchar(36),
	`media_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `place_photos_id` PRIMARY KEY(`id`),
	CONSTRAINT `place_photos_media_unique` UNIQUE(`media_id`)
);
--> statement-breakpoint
ALTER TABLE `admin_audit_logs` MODIFY COLUMN `action` enum('admin_granted','user_suspended','user_restored','post_hidden','post_restored','place_approved','place_rejected','place_change_approved','place_change_rejected') NOT NULL;--> statement-breakpoint
ALTER TABLE `falaises` ADD `department` varchar(255);--> statement-breakpoint
ALTER TABLE `falaises` ADD `region` varchar(255);--> statement-breakpoint
ALTER TABLE `falaises` ADD `disciplines` json;--> statement-breakpoint
ALTER TABLE `falaises` ADD `rock_type` enum('calcaire','gres','granite','gneiss','schiste','conglomerat','volcanique','autre');--> statement-breakpoint
ALTER TABLE `falaises` ADD `rain_exposure` enum('abrite','partiellement_abrite','expose');--> statement-breakpoint
ALTER TABLE `falaises` ADD `sunlight` enum('ombrage','mixte','ensoleille');--> statement-breakpoint
ALTER TABLE `falaises` ADD `orientations` json;--> statement-breakpoint
ALTER TABLE `falaises` ADD `restrictions` varchar(500);--> statement-breakpoint
ALTER TABLE `falaises` ADD `source_url` varchar(500);--> statement-breakpoint
ALTER TABLE `falaises` ADD `notes` varchar(1000);--> statement-breakpoint
ALTER TABLE `salles` ADD `department` varchar(255);--> statement-breakpoint
ALTER TABLE `salles` ADD `region` varchar(255);--> statement-breakpoint
ALTER TABLE `salles` ADD `restrictions` varchar(500);--> statement-breakpoint
ALTER TABLE `salles` ADD `source_url` varchar(500);--> statement-breakpoint
ALTER TABLE `salles` ADD `notes` varchar(1000);--> statement-breakpoint
ALTER TABLE `place_change_request_photos` ADD CONSTRAINT `place_change_request_photos_request_id_place_change_requests_id_fk` FOREIGN KEY (`request_id`) REFERENCES `place_change_requests`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `place_change_requests` ADD CONSTRAINT `place_change_requests_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `place_change_requests` ADD CONSTRAINT `place_change_requests_salle_id_salles_id_fk` FOREIGN KEY (`salle_id`) REFERENCES `salles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `place_change_requests` ADD CONSTRAINT `place_change_requests_falaise_id_falaises_id_fk` FOREIGN KEY (`falaise_id`) REFERENCES `falaises`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `place_change_requests` ADD CONSTRAINT `place_change_requests_reviewed_by_users_id_fk` FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `place_photos` ADD CONSTRAINT `place_photos_salle_id_salles_id_fk` FOREIGN KEY (`salle_id`) REFERENCES `salles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `place_photos` ADD CONSTRAINT `place_photos_falaise_id_falaises_id_fk` FOREIGN KEY (`falaise_id`) REFERENCES `falaises`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `place_change_request_photo_media_idx` ON `place_change_request_photos` (`media_id`);--> statement-breakpoint
CREATE INDEX `place_change_requests_author_idx` ON `place_change_requests` (`author_id`);--> statement-breakpoint
CREATE INDEX `place_change_requests_status_created_idx` ON `place_change_requests` (`change_request_status`,`created_at`);--> statement-breakpoint
CREATE INDEX `place_change_requests_salle_idx` ON `place_change_requests` (`salle_id`);--> statement-breakpoint
CREATE INDEX `place_change_requests_falaise_idx` ON `place_change_requests` (`falaise_id`);--> statement-breakpoint
CREATE INDEX `place_photos_salle_idx` ON `place_photos` (`salle_id`);--> statement-breakpoint
CREATE INDEX `place_photos_falaise_idx` ON `place_photos` (`falaise_id`);