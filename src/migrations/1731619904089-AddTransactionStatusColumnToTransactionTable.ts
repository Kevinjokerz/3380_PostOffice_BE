import { Column, MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import logger from "../utils/logger";

export class AddTransactionStatusColumnToTransactionTable1731619904089 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("transactions", new TableColumn({
            name: "transaction_status",
            type: "varchar",
            isNullable: false
        }));

        logger.info(`Column Added to transactions table: transaction_status`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("transactions", "transaction_status");
        logger.info(`Column dropped from transaction Table: transaction_status`)
    }

}
