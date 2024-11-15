import { MigrationInterface, QueryRunner } from "typeorm";
import logger from "../utils/logger";

export class CreateValidateInventoryCapacityTrigger1731391780792 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TRIGGER check_inventory_capacity
            BEFORE INSERT ON packages
            FOR EACH ROW
            BEGIN
                DECLARE current_count INT;
                DECLARE next_branch_id INT;

                SELECT COUNT(*) INTO current_count
                FROM packages
                WHERE branch_id = NEW.branch_id
                AND status NOT IN ('delivered', 'in transit', 'out for delivery');

                IF current_count >= 100 THEN
                    SELECT MIN(branch_id) INTO next_branch_id
                    FROM post_office
                    WHERE branch_id > NEW.branch_id;

                    IF next_branch_id IS NOT NULL THEN
                        SET NEW.branch_id = next_branch_id;
                        SET NEW.status = CONCAT('transferring to branch ', next_branch_id);                        
                    ELSE
                        SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'No available branch with capacity. Cannot add new package.';
                    END IF;
                END IF;
            END;

            `)
            logger.info('Trigger created: check_inventory_capacity')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS check_inventory_capacity`);
        logger.info(`Trigger dropped: check_inventory_capacity`)
    }

}
