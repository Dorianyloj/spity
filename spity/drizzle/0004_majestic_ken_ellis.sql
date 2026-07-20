CREATE TABLE `event_registrations` (
	`id` varchar(36) NOT NULL,
	`event_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`registration_status` enum('active','cancelled') NOT NULL DEFAULT 'active',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `event_registrations_id` PRIMARY KEY(`id`),
	CONSTRAINT `event_registrations_event_user_unique` UNIQUE(`event_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `partnership_requests` (
	`id` varchar(36) NOT NULL,
	`pair_key` varchar(73) NOT NULL,
	`sender_id` varchar(36) NOT NULL,
	`recipient_id` varchar(36) NOT NULL,
	`partnership_status` enum('pending','accepted','declined') NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`responded_at` timestamp,
	CONSTRAINT `partnership_requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `partnership_requests_pair_key_unique` UNIQUE(`pair_key`)
);
--> statement-breakpoint
ALTER TABLE `events` ADD `event_type` enum('outing','contest','coaching','initiation') DEFAULT 'outing' NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `description` varchar(1000);--> statement-breakpoint
ALTER TABLE `events` ADD `location` varchar(255);--> statement-breakpoint
ALTER TABLE `events` ADD `fin` timestamp;--> statement-breakpoint
ALTER TABLE `events` ADD `event_status` enum('scheduled','cancelled') DEFAULT 'scheduled' NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `updated_at` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `club_profiles` ADD CONSTRAINT `club_profiles_user_id_unique` UNIQUE(`user_id`);--> statement-breakpoint
ALTER TABLE `grimpeur_profiles` ADD CONSTRAINT `grimpeur_profiles_user_id_unique` UNIQUE(`user_id`);--> statement-breakpoint
ALTER TABLE `event_registrations` ADD CONSTRAINT `event_registrations_event_id_events_id_fk` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `event_registrations` ADD CONSTRAINT `event_registrations_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `partnership_requests` ADD CONSTRAINT `partnership_requests_sender_id_users_id_fk` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `partnership_requests` ADD CONSTRAINT `partnership_requests_recipient_id_users_id_fk` FOREIGN KEY (`recipient_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `event_registrations_event_status_idx` ON `event_registrations` (`event_id`,`registration_status`);--> statement-breakpoint
CREATE INDEX `partnership_requests_sender_idx` ON `partnership_requests` (`sender_id`);--> statement-breakpoint
CREATE INDEX `partnership_requests_recipient_idx` ON `partnership_requests` (`recipient_id`);--> statement-breakpoint
CREATE INDEX `partnership_requests_status_idx` ON `partnership_requests` (`partnership_status`);--> statement-breakpoint
CREATE INDEX `events_club_idx` ON `events` (`club_id`);--> statement-breakpoint
CREATE INDEX `events_start_idx` ON `events` (`debut`);