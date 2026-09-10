CREATE TABLE `place_creation_requests` (
	`id` varchar(36) NOT NULL,
	`author_id` varchar(36) NOT NULL,
	`kind` enum('salle','falaise') NOT NULL,
	`request_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`name` varchar(255) NOT NULL,
	`disciplines` json NOT NULL,
	`latitude` double NOT NULL,
	`longitude` double NOT NULL,
	`city` varchar(255) NOT NULL,
	`department` varchar(255) NOT NULL,
	`region` varchar(255) NOT NULL,
	`address` varchar(500),
	`rock_type` enum('calcaire','gres','granite','gneiss','schiste','conglomerat','volcanique','autre'),
	`rain_exposure` enum('abrite','partiellement_abrite','expose'),
	`sunlight` enum('ombrage','mixte','ensoleille'),
	`seasons` json,
	`orientations` json,
	`services` json,
	`website` varchar(500),
	`access` varchar(500),
	`approach` varchar(255),
	`parking` varchar(255),
	`restrictions` varchar(500),
	`source_url` varchar(500),
	`notes` varchar(1000),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`reviewed_at` timestamp,
	CONSTRAINT `place_creation_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `place_creation_requests` ADD CONSTRAINT `place_creation_requests_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `place_creation_requests_author_idx` ON `place_creation_requests` (`author_id`);--> statement-breakpoint
CREATE INDEX `place_creation_requests_status_created_idx` ON `place_creation_requests` (`request_status`,`created_at`);