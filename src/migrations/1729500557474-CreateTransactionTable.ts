import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import logger from "../utils/logger";


export class CreateTransactionTable1729500557474 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "transactions",
                columns: [
                    {
                        name: "transaction_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "package_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "customer_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "branch_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "transaction_date",
                        type: "timestamp",
                        isNullable: false,
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "amount",
                        type: "decimal",
                        precision: 10,
                        scale: 0,
                        isNullable: false,
                    },
                ],
            }),
            true
        );
        logger.info(`Table created: transaction`);

        // Foreign Key for package_id
        await queryRunner.createForeignKey(
            "transactions",
            new TableForeignKey({
                columnNames: ["package_id"],
                referencedTableName: "packages",
                referencedColumnNames: ["package_id"],
                onDelete: "CASCADE",
                name: "FK_transaction_package_id",
            })
        );
        logger.info(`Foreign key created: FK_transaction_package_id`);

        // Foreign Key for customer_id
        await queryRunner.createForeignKey(
            "transactions",
            new TableForeignKey({
                columnNames: ["customer_id"],
                referencedTableName: "customers",
                referencedColumnNames: ["customer_id"],
                onDelete: "CASCADE",
                name: "FK_transaction_customer_id",
            })
        );
        logger.info(`Foreign key created: FK_transaction_customer_id`);

        // Foreign Key for employee_id
        await queryRunner.createForeignKey(
            "transactions",
            new TableForeignKey({
                columnNames: ["branch_id"],
                referencedTableName: "post_office",
                referencedColumnNames: ["branch_id"],
                onDelete: "RESTRICT",
                name: "FK_transaction_branch_id"
            })
        );
        logger.info(`Foreign key created: FK_transaction_branch_id`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("transactions", "FK_transaction_package_id");
        logger.info(`Foreign key dropped: FK_transaction_package_id`);

        await queryRunner.dropForeignKey("transactions", "FK_transaction_customer_id");
        logger.info(`Foreign key dropped: FK_transaction_customer_id`);

        await queryRunner.dropForeignKey("transactions", "FK_transaction_branch_id");
        logger.info(`Foreign key dropped: FK_transaction_branch_id`);

        await queryRunner.dropTable("transactions");
        logger.info(`Table dropped: transaction`);
    }

}
