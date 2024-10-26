import { Router } from "express";
import { customerController} from '../../controllers'
import { asyncHandler } from "../../middlewares";
import {customerAuthenticationMiddleware} from '../../middlewares'


const customerRouter = Router();

customerRouter.get('/profile', customerAuthenticationMiddleware, asyncHandler(customerController.getCustomerProfile));
customerRouter.put('/edit-profile', customerAuthenticationMiddleware, asyncHandler(customerController.editCustomerProfile))
customerRouter.get('/tracking-history', customerAuthenticationMiddleware, asyncHandler(customerController.getTrackingHistory));

export default customerRouter;
