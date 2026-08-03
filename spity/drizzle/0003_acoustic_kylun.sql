CREATE TABLE `place_reports` (
	`id` varchar(36) NOT NULL,
	`falaise_id` varchar(36),
	`salle_id` varchar(36),
	`author_id` varchar(36) NOT NULL,
	`report_type` enum('condition','access','safety','info') NOT NULL,
	`report_status` enum('open','resolved') NOT NULL DEFAULT 'open',
	`message` varchar(500) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `place_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `falaises` ADD `photo_url` varchar(500);--> statement-breakpoint
ALTER TABLE `falaises` ADD `latitude` double;--> statement-breakpoint
ALTER TABLE `falaises` ADD `longitude` double;--> statement-breakpoint
ALTER TABLE `falaises` ADD `orientation` enum('nord','sud','est','ouest','multi');--> statement-breakpoint
ALTER TABLE `falaises` ADD `approche` varchar(255);--> statement-breakpoint
ALTER TABLE `falaises` ADD `parking` varchar(255);--> statement-breakpoint
ALTER TABLE `falaises` ADD `saison` json;--> statement-breakpoint
ALTER TABLE `falaises` ADD `status` enum('sec','humide','attention','ferme');--> statement-breakpoint
ALTER TABLE `salles` ADD `photo_url` varchar(500);--> statement-breakpoint
ALTER TABLE `salles` ADD `horaires` json;--> statement-breakpoint
ALTER TABLE `salles` ADD `tarifs` json;--> statement-breakpoint
ALTER TABLE `salles` ADD `services` json;--> statement-breakpoint
ALTER TABLE `salles` ADD `site_web` varchar(500);--> statement-breakpoint
ALTER TABLE `salles` ADD `latitude` double;--> statement-breakpoint
ALTER TABLE `salles` ADD `longitude` double;--> statement-breakpoint
ALTER TABLE `salles` ADD `niveau_min` varchar(10);--> statement-breakpoint
ALTER TABLE `salles` ADD `niveau_max` varchar(10);--> statement-breakpoint
ALTER TABLE `salles` ADD `frequentation` enum('calme','moderee','elevee');--> statement-breakpoint
ALTER TABLE `voies` ADD `hauteur` int;--> statement-breakpoint
ALTER TABLE `voies` ADD `degaines` int;--> statement-breakpoint
ALTER TABLE `voies` ADD `secteur` varchar(120);--> statement-breakpoint
ALTER TABLE `voies` ADD `style` enum('dalle','devers','vertical','fissure','pilier','mixte');--> statement-breakpoint
ALTER TABLE `voies` ADD `route_status` enum('ok','humide','spit_a_verifier','fermee');--> statement-breakpoint
ALTER TABLE `place_reports` ADD CONSTRAINT `place_reports_falaise_id_falaises_id_fk` FOREIGN KEY (`falaise_id`) REFERENCES `falaises`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `place_reports` ADD CONSTRAINT `place_reports_salle_id_salles_id_fk` FOREIGN KEY (`salle_id`) REFERENCES `salles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `place_reports` ADD CONSTRAINT `place_reports_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;