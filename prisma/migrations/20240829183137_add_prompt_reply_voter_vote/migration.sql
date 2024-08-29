-- CreateTable
CREATE TABLE `Prompt` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `prompterId` INTEGER UNSIGNED NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `locked` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Prompt_content_key`(`content`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reply` (
    `replierId` INTEGER UNSIGNED NOT NULL,
    `promptId` INTEGER UNSIGNED NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`replierId`, `promptId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Voter` (
    `userId` INTEGER UNSIGNED NOT NULL,
    `promptId` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`userId`, `promptId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vote` (
    `userId` INTEGER UNSIGNED NOT NULL,
    `promptId` INTEGER UNSIGNED NOT NULL,
    `replierId` INTEGER UNSIGNED NOT NULL,
    `vote` BOOLEAN NOT NULL,

    PRIMARY KEY (`userId`, `promptId`, `replierId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Prompt` ADD CONSTRAINT `Prompt_prompterId_fkey` FOREIGN KEY (`prompterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reply` ADD CONSTRAINT `Reply_replierId_fkey` FOREIGN KEY (`replierId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reply` ADD CONSTRAINT `Reply_promptId_fkey` FOREIGN KEY (`promptId`) REFERENCES `Prompt`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Voter` ADD CONSTRAINT `Voter_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Voter` ADD CONSTRAINT `Voter_promptId_fkey` FOREIGN KEY (`promptId`) REFERENCES `Prompt`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_userId_promptId_fkey` FOREIGN KEY (`userId`, `promptId`) REFERENCES `Voter`(`userId`, `promptId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_promptId_replierId_fkey` FOREIGN KEY (`promptId`, `replierId`) REFERENCES `Reply`(`promptId`, `replierId`) ON DELETE RESTRICT ON UPDATE CASCADE;
