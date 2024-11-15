import {Response} from 'express';
import {customersService, trackingHistoryService, transactionService, customerNotificationService} from '../../services'
import {RequestWithCustomerInfo, CustomerInfo} from '../../types/custom-request.type'


class CustomerController {
    async getCustomerProfile (req: RequestWithCustomerInfo, res: Response) {
        const { customerId } = req.customerInfo as CustomerInfo;
        const existedCustomer = await customersService.getCustomerProfile(customerId);
        res.send(existedCustomer);
    }

    async editCustomerProfile (req: RequestWithCustomerInfo, res: Response) {
        const { customerId } = req.customerInfo as CustomerInfo;
        const updatedCustomer = await customersService.editCustomerProfile(customerId, req.body);
        res.send(updatedCustomer);
    }

    async getTrackingHistory (req: RequestWithCustomerInfo, res: Response) {
        const { customerId } = req.customerInfo as CustomerInfo;
        const trackinghistoryWithPackageInfo = await trackingHistoryService.viewTrackingHistoryWithCustomerId(customerId);
        res.send(trackinghistoryWithPackageInfo)
    }

    async cancelPackageByCustomerIdAndPackageId(req: RequestWithCustomerInfo, res: Response) {
        const { customerId } = req.customerInfo as CustomerInfo;
        const { packageId } = req.body;
        const packageToCancel = await customersService.cancelPackageByCustomerIdAndPackageId(customerId, packageId);
        res.send(packageToCancel);
    }

    async makePayment (req: RequestWithCustomerInfo, res: Response) {
        const { customerId } = req.customerInfo as CustomerInfo;
        const { packageId } = req.body;
        const packagePayment = await transactionService.makePayment(customerId, packageId);
        res.send(packagePayment);
    }

    async getNotificationByCustomerId (req: RequestWithCustomerInfo, res: Response) {
        const { customerId } = req.customerInfo as CustomerInfo;
        const notifications = await customerNotificationService.getNotificationByCutomerId(customerId);
        res.send(notifications);
    }
}

const customerController = new CustomerController();
export {customerController}