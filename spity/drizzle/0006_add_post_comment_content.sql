ALTER TABLE `comments` ADD `contenu` varchar(500) DEFAULT 'Commentaire' NOT NULL;--> statement-breakpoint
ALTER TABLE `comments` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `comments` ADD `updated_at` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
CREATE INDEX `comments_post_created_idx` ON `comments` (`post_id`,`created_at`);