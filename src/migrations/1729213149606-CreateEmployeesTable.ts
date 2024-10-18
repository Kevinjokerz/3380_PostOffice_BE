import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateEmployeesTable1729213149606 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "employees",
                columns: [
                    {
                        name: "employee_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "first_name",
                        type: "varchar",
                        length: "50",
                        isNullable: false,
                    },
                    {
                        name: "last_name",
                        type: "varchar",
                        length: "50",
                        isNullable: false
                    },
                    {
                        name: "dob",
                        type: "Date",
                        isNullable: false,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "50",
                        isNullable: false
                    },
                    {
                        name:"phone_number",
                        type: "varchar",
                        length: "15",
                        isNullable: false
                    },
                    {
                        name: "position",
                        type: "varchar",
                        length: "50",
                        isNullable: false,
                    },
                    {
                        name: "branch_id",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "manager_id",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false,
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false
                    },
                ],
            }),
            true
        );


        await queryRunner.createForeignKey(
            "employees",
            new TableForeignKey({
                columnNames: ["branch_id"],
                referencedTableName: "post_office",
                referencedColumnNames: ["branch_id"],
                onDelete: "SET NULL",
            })
        );

        await queryRunner.createForeignKey(
            "employees",
            new TableForeignKey({
                columnNames: ["manager_id"],
                referencedTableName: "employees",
                referencedColumnNames: ["employee_id"],
                onDelete: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("employees", "FK_employee_branch_id");
        await queryRunner.dropForeignKey("employees", "FK_employee_manager_id");
        await queryRunner.dropTable("employees");
    }

}
