CREATE TABLE `club_profiles` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`nom` varchar(255) NOT NULL,
	`bio` varchar(1000),
	`location` varchar(255),
	`ffme_num` varchar(50),
	CONSTRAINT `club_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` varchar(36) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`author_id` varchar(36) NOT NULL,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` varchar(36) NOT NULL,
	`club_id` varchar(36) NOT NULL,
	`titre` varchar(255) NOT NULL,
	`debut` timestamp NOT NULL,
	`capacite` int NOT NULL,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `falaises` (
	`id` varchar(36) NOT NULL,
	`nom` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`acces` varchar(500),
	`niveaux` json,
	CONSTRAINT `falaises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grimpeur_profiles` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`disciplines` json NOT NULL,
	`niveaux` json NOT NULL,
	`materiel` json NOT NULL,
	`karma` int DEFAULT 0,
	CONSTRAINT `grimpeur_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`id` varchar(36) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `medias` (
	`id` varchar(36) NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`url` varchar(500) NOT NULL,
	CONSTRAINT `medias_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` varchar(36) NOT NULL,
	`author_id` varchar(36) NOT NULL,
	`salle_id` varchar(36),
	`falaise_id` varchar(36),
	`club_id` varchar(36),
	`contenu` varchar(500),
	`cotation` varchar(10),
	`is_story` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `salles` (
	`id` varchar(36) NOT NULL,
	`nom` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`adresse` varchar(500) NOT NULL,
	`disciplines` json NOT NULL,
	CONSTRAINT `salles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`role` enum('grimpeur','club') NOT NULL,
	`avatar_url` varchar(500),
	`email_verified` boolean DEFAULT false,
	`email_verification_token` varchar(255),
	`reset_password_token` varchar(255),
	`reset_password_expires` timestamp,
	`failed_login_attempts` int DEFAULT 0,
	`lockout_until` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `voies` (
	`id` varchar(36) NOT NULL,
	`falaise_id` varchar(36) NOT NULL,
	`nom` varchar(255) NOT NULL,
	`cotation` varchar(10) NOT NULL,
	`etat_votes` json,
	CONSTRAINT `voies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `club_profiles` ADD CONSTRAINT `club_profiles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `events` ADD CONSTRAINT `events_club_id_club_profiles_id_fk` FOREIGN KEY (`club_id`) REFERENCES `club_profiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `grimpeur_profiles` ADD CONSTRAINT `grimpeur_profiles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `likes` ADD CONSTRAINT `likes_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `likes` ADD CONSTRAINT `likes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `medias` ADD CONSTRAINT `medias_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_salle_id_salles_id_fk` FOREIGN KEY (`salle_id`) REFERENCES `salles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_falaise_id_falaises_id_fk` FOREIGN KEY (`falaise_id`) REFERENCES `falaises`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_club_id_club_profiles_id_fk` FOREIGN KEY (`club_id`) REFERENCES `club_profiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `voies` ADD CONSTRAINT `voies_falaise_id_falaises_id_fk` FOREIGN KEY (`falaise_id`) REFERENCES `falaises`(`id`) ON DELETE cascade ON UPDATE no action;