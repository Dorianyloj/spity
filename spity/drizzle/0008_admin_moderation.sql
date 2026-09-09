CREATE TABLE `admin_audit_logs` (
	`id` varchar(36) NOT NULL,
	`actor_id` varchar(36),
	`action` enum('admin_granted','user_suspended','user_restored','post_hidden','post_restored') NOT NULL,
	`target_id` varchar(36) NOT NULL,
	`reason` varchar(500) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `likes` ADD `created_at` timestamp;--> statement-breakpoint
ALTER TABLE `posts` ADD `is_hidden` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `is_admin` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `is_suspended` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `session_version` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `admin_audit_logs` ADD CONSTRAINT `admin_audit_logs_actor_id_users_id_fk` FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `admin_audit_created_idx` ON `admin_audit_logs` (`created_at`);