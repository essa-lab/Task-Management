-- DropForeignKey
ALTER TABLE `columns` DROP FOREIGN KEY `columns_board_id_fkey`;

-- DropForeignKey
ALTER TABLE `sub_tasks` DROP FOREIGN KEY `sub_tasks_task_id_fkey`;

-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_status_id_fkey`;

-- DropIndex
DROP INDEX `columns_board_id_fkey` ON `columns`;

-- DropIndex
DROP INDEX `sub_tasks_task_id_fkey` ON `sub_tasks`;

-- DropIndex
DROP INDEX `tasks_status_id_fkey` ON `tasks`;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_status_id_fkey` FOREIGN KEY (`status_id`) REFERENCES `columns`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_tasks` ADD CONSTRAINT `sub_tasks_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `columns` ADD CONSTRAINT `columns_board_id_fkey` FOREIGN KEY (`board_id`) REFERENCES `boards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
