ALTER TABLE `grimpeur_profiles` ADD `display_name` varchar(80);--> statement-breakpoint
ALTER TABLE `grimpeur_profiles` ADD `bio` varchar(500);--> statement-breakpoint
ALTER TABLE `grimpeur_profiles` ADD `location` varchar(255);--> statement-breakpoint
ALTER TABLE `grimpeur_profiles` ADD `climbing_environment` enum('indoor','outdoor','mixed');--> statement-breakpoint
ALTER TABLE `grimpeur_profiles` ADD `availability` json;--> statement-breakpoint
ALTER TABLE `grimpeur_profiles` ADD `partner_search` json;--> statement-breakpoint
ALTER TABLE `grimpeur_profiles` ADD `goals` json;