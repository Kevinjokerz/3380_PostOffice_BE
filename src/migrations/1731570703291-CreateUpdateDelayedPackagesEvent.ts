import { MigrationInterface, QueryRunner } from "typeorm";
import logger from "../utils/logger";

export class CreateUpdateDelayedPackagesEvent1731570703291 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
                CREATE EVENT IF NOT EXISTS update_delayed_packages
                ON SCHEDULE EVERY 1 DAY
                DO
                BEGIN
                    UPDATE packages
                    SET status = 'delayed'
                    WHERE delivery_date < CURDATE()
                    AND status NOT IN ('delivered', 'delayed', 'on hold');
                END;
            `)
        
            logger.info(`Event scheduler created: update_delayed_packages`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP EVENT IF EXISTS update_delayed_packages;
        `);
    }

}
