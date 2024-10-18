import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAddressTable1729213045236 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "address",
                columns: [
                    {
                        name: "address_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "street",
                        type: "varchar",
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: "city",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                    },
                    {
                        name: "state",
                        type: "varchar",
                        length: "10",
                        isNullable: false,
                    },
                    {
                        name: "zipcode",
                        type: "varchar",
                        length: "10",
                        isNullable: false
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("address");
    }

}
