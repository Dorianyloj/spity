ALTER TABLE `admin_audit_logs` MODIFY COLUMN `action` enum('admin_granted','user_suspended','user_restored','post_hidden','post_restored','place_approved','place_rejected') NOT NULL;--> statement-breakpoint
ALTER TABLE `falaises` ADD `parking_latitude` double;--> statement-breakpoint
ALTER TABLE `falaises` ADD `parking_longitude` double;--> statement-breakpoint
ALTER TABLE `place_creation_requests` ADD `parking_latitude` double;--> statement-breakpoint
ALTER TABLE `place_creation_requests` ADD `parking_longitude` double;--> statement-breakpoint
ALTER TABLE `place_creation_requests` ADD `reviewed_by` varchar(36);--> statement-breakpoint
ALTER TABLE `place_creation_requests` ADD `review_reason` varchar(500);--> statement-breakpoint
ALTER TABLE `place_creation_requests` ADD CONSTRAINT `place_creation_requests_reviewed_by_users_id_fk` FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;