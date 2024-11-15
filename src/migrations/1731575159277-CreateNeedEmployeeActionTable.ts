import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import logger from "../utils/logger";
import { log } from "console";

export class CreateNeedEmployeeActionTable1731575159277 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "need_employee_action",
                columns: [
                    {
                        name: "action_needed_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy:  "increment",
                    },
                    {
                        name: "employee_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "package_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "messages",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "is_completed",
                        type: "timestamp",
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
        logger.info(`Table created: need_employee_action`);

        await queryRunner.createForeignKey(
            "need_employee_action",
            new TableForeignKey({
                columnNames: ["employee_id"],
                referencedTableName: "employees",
                referencedColumnNames: ["employee_id"],
                onDelete: "CASCADE",
                name: "FK_need_employee_action_employee_id"
            })
        );
        logger.info(`Foreign key created: FK_need_employee_action_employee_id`);

        await queryRunner.createForeignKey(
            "need_employee_action",
            new TableForeignKey({
                columnNames: ["package_id"],
                referencedTableName: "packages",
                referencedColumnNames: ["package_id"],
                onDelete: "CASCADE",
                name: "FK_need_employee_action_package_id"
            })
        );
        logger.info(`Foreign key created: FK_need_employee_action_package_id`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("need_employee_action", "FK_need_employee_action_employee_id");
        logger.info(`Foreign key dropped: FK_need_employee_action_employee_id`);

        await queryRunner.dropForeignKey("need_employee_action", "FK_need_employee_action_package_id");
        logger.info(`Foreign key dropped: FK_need_employee_action_package_id`);

        await queryRunner.dropTable("need_employee_action")
        logger.info(`Table dropped: need_employee_action`)
    }

}
