import { Router } from "express";
import { customerController} from '../../controllers'
import { asyncHandler } from "../../middlewares";
import {customerAuthenticationMiddleware} from '../../middlewares'


const customerRouter = Router();

customerRouter.get('/profile', asyncHandler(customerAuthenticationMiddleware) , asyncHandler(customerController.getCustomerProfile));
customerRouter.put('/edit-profile', asyncHandler(customerAuthenticationMiddleware) , asyncHandler(customerController.editCustomerProfile))
customerRouter.get('/tracking-history', asyncHandler(customerAuthenticationMiddleware) , asyncHandler(customerController.getTrackingHistory));
customerRouter.patch('/cancel-package', asyncHandler(customerAuthenticationMiddleware), asyncHandler(customerController.cancelPackageByCustomerIdAndPackageId));
customerRouter.patch('/make-payment', asyncHandler(customerAuthenticationMiddleware), asyncHandler(customerController.makePayment));
customerRouter.get('/notifications', asyncHandler(customerAuthenticationMiddleware), asyncHandler(customerController.getNotificationByCustomerId))

export default customerRouter;
