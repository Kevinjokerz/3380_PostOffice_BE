import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import logger from "../utils/logger";

export class AddIsDeletedColumnToPackagesTable1731395486218 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("packages", new TableColumn({
            name: "is_deleted",
            type: "timestamp",
            isNullable: true,
        }));
        logger.info(`Column Added to packages Table: is_deleted`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("packages", "is_deleted");
        logger.info(`Column dropped from packages Table: is_deleted`);
    }

}
