import { MigrationInterface, QueryRunner } from "typeorm";
import logger from '../utils/logger'

export class CreateNotifyEmployeePackageCancelTrigger1731578422436 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
                CREATE TRIGGER notify_refund_on_cancel
                AFTER UPDATE ON packages
                FOR EACH ROW
                BEGIN
                    DECLARE refund_message VARCHAR(255);
                    DECLARE is_paid BOOLEAN DEFAULT FALSE;

                    SELECT COUNT(*) > 0 INTO is_paid
                    FROM transactions
                    WHERE package_id = NEW.package_id AND transaction_status = 'paid';

                    IF OLD.status != 'canceled' AND NEW.status = 'canceled' THEN
                        IF is_paid THEN
                            SET refund_message = CONCAT('Refund 80% fee for canceled package ID ', NEW.package_id);
                        ELSE
                            SET refund_message = CONCAT('Package ID ', NEW.package_id, ' is canceled');
                        END IF;

                        INSERT INTO need_employee_action (employee_id, package_id, messages, is_completed, created_at)
                        SELECT employee_id, NEW.package_id, refund_message, NULL, CURRENT_TIMESTAMP
                        FROM employees
                        WHERE position = 'accountant' AND branch_id = NEW.branch_id;
                    END IF;
                END;


            `)

            logger.info(`Trigger created: notify_refund_on_cancel`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS notify_refund_on_cancel`);
        logger.info(`Trigger dropped: notify_refund_on_cancel`);
    }


}
