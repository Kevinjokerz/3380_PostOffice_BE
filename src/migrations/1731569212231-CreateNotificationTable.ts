import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import logger from "../utils/logger";

export class CreateNotificationTable1731569212231 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "notifications",
                columns: [
                    {
                        name: "notification_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "customer_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "package_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "message",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        isNullable: false,
                        default: "CURRENT_TIMESTAMP",
                    }
                ]
            }),
            true
        );
        logger.info(`Table created: notifications`);

        await queryRunner.createForeignKey(
            "notifications",
            new TableForeignKey({
                columnNames: ["customer_id"],
                referencedTableName: "customers",
                referencedColumnNames: ["customer_id"],
                onDelete: "CASCADE",
                name: "FK_notifications_customer_id"
            })
        );

        logger.info(`Foreign key created: FK_notifications_customer_id`);

        await queryRunner.createForeignKey(
            "notifications",
            new TableForeignKey({
                columnNames: ["package_id"],
                referencedTableName: "packages",
                referencedColumnNames: ["package_id"],
                onDelete: "CASCADE",
                name: "FK_notifications_package_id"
            })
        );

        logger.info(`Foreign key created: FK_notifications_package_id`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("notifications", "FK_notifications_customer_id");
        logger.info(`Foreign key dropped: FK_notifications_customer_id`);

        await queryRunner.dropForeignKey("notifications", "FK_notifications_package_id");
        logger.info(`Foreign key dropped: FK_notifications_package_id`);

        await queryRunner.dropTable("notifications")
        logger.info(`Table dropped: notifications`)
    }

}
