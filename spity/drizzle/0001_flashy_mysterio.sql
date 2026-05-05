CREATE TABLE `user_equipment` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`category` enum('chaussons','baudrier','corde','degaine','mousqueton','assureur','casque','crashpad','longe','sac','autre') NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`brand` varchar(80),
	`model` varchar(120) NOT NULL,
	`color` varchar(60),
	`size` varchar(60),
	`length_meters` int,
	`diameter_mm` varchar(20),
	`condition` enum('neuf','bon','use','a_verifier') NOT NULL DEFAULT 'bon',
	`available_for_partner` boolean NOT NULL DEFAULT true,
	`notes` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_equipment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `user_equipment` ADD CONSTRAINT `user_equipment_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;