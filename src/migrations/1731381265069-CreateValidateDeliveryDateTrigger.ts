import { MigrationInterface, QueryRunner } from "typeorm";
import logger from "../utils/logger";

export class CreateValidateDeliveryDateTrigger1731381265069 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TRIGGER validate_delivery_date
            BEFORE INSERT ON packages
            FOR EACH ROW
            BEGIN
                IF NEW.delivery_date < NEW.shipping_date THEN
                    SIGNAL SQLSTATE '45000' 
                    SET MESSAGE_TEXT = 'Error: Delivery date cannot be earlier than the shipping date.';
                END IF;
            END
            `)

            logger.info(`Trigger created: validate_delivery_date`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS validate_delivery_date`);
        logger.info(`Trigger dropped: validate_delivery_date`)
    }

}
