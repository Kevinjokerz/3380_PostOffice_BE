import { MigrationInterface, QueryRunner } from "typeorm";
import logger from "../utils/logger";

export class CreateCustomerNoficationDelayedPackages1731571962639 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TRIGGER notify_package_delay
            AFTER UPDATE ON packages
            FOR EACH ROW
            BEGIN
                IF NEW.status = 'delayed' AND OLD.status != 'delayed' THEN
                    INSERT INTO notifications (customer_id, package_id, message, created_at)
                    VALUES (
                        NEW.customer_id,
                        NEW.package_id,
                        CONCAT('Your package with ID ', NEW.package_id, ' has been delayed.'),
                        NOW()
                    );
                END IF;
            END;
            `);

            logger.info(`Trigger created: notify_package_delay`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS notify_package_delay`);
        logger.info(`Trigger dropped: notify_package_delay`);
    }

}
