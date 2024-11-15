import { Repository } from 'typeorm'
import {Customers, Packages, Notifications} from '../../entities'
import { AppDataSource } from '../../data-source'
import { format } from 'date-fns'
import {NotFoundError} from '../../types/http-error.type'


class CustomerNotificationService {
    private customerRepository: Repository<Customers>;
    private packageRepository: Repository<Packages>;
    private notificationRepository: Repository<Notifications>;

    constructor() {
        this.customerRepository = AppDataSource.getRepository(Customers);
        this.packageRepository = AppDataSource.getRepository(Packages);
        this.notificationRepository = AppDataSource.getRepository(Notifications)
    }

    async getNotificationByCutomerId (customerId: number) {
        const existedCustomer = await this.customerRepository.findOne({where: {customerId}});
        if(!existedCustomer) {
            throw new NotFoundError('Customer not found')
        }

        const notifications = await this.notificationRepository.find({where: {customerId}})
        if(!notifications.length) {
            throw new NotFoundError("No notification available")
        }

        return notifications.map(notification => ({
            notificationId: notification.notificationId,
            packageId: notification.packageId,
            message: notification.message,
            createdAt: format(new Date(notification.createdAt), 'yyyy-MM-dd')
        }));
    }
}

const customerNotificationService = new CustomerNotificationService();
export {customerNotificationService} ;