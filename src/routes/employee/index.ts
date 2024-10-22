import { Router } from "express";
import { employeeController} from '../../controllers'
import { asyncHandler } from "../../middlewares";
import {employeeAuthenticationMiddleware} from '../../middlewares'


const employeeRouter = Router();

employeeRouter.get('/profile', employeeAuthenticationMiddleware, asyncHandler(employeeController.getEmployeeProfile));
employeeRouter.put('/edit-profile', employeeAuthenticationMiddleware, asyncHandler(employeeController.editEmployeeProfile))


export default employeeRouter;
