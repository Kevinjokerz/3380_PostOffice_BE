import { Router } from "express";
import { employeeController} from '../../controllers'
import { asyncHandler, validateBody } from "../../middlewares";
import {employeeAuthenticationMiddleware} from '../../middlewares'
import { packageCreateValidator } from "../../validation-schemas";


const employeeRouter = Router();

employeeRouter.get('/profile', employeeAuthenticationMiddleware, asyncHandler(employeeController.getEmployeeProfile));
employeeRouter.put('/edit-profile', employeeAuthenticationMiddleware, asyncHandler(employeeController.editEmployeeProfile));
employeeRouter.post('/create-new-package',validateBody(packageCreateValidator), employeeAuthenticationMiddleware, asyncHandler(employeeController.createPackage));
employeeRouter.put('/update-package', employeeAuthenticationMiddleware, asyncHandler(employeeController.updatePackage));


export default employeeRouter;
