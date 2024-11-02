import { Router } from "express";
import { employeeController, dataReportController} from '../../controllers'
import { asyncHandler, validateBody } from "../../middlewares";
import {employeeAuthenticationMiddleware, managerAuthenticationMiddleware} from '../../middlewares'
import { packageCreateValidator } from "../../validation-schemas";


const employeeRouter = Router();

employeeRouter.get('/profile', employeeAuthenticationMiddleware, asyncHandler(employeeController.getEmployeeProfile));
employeeRouter.put('/edit-profile', employeeAuthenticationMiddleware, asyncHandler(employeeController.editEmployeeProfile));
employeeRouter.post('/create-new-package',validateBody(packageCreateValidator), employeeAuthenticationMiddleware, asyncHandler(employeeController.createPackage));
employeeRouter.put('/update-package', employeeAuthenticationMiddleware, asyncHandler(employeeController.updatePackage));
employeeRouter.get('/package-and-tracking-report', managerAuthenticationMiddleware, asyncHandler(dataReportController.getPackageInfoAndTrackingHistoryByBranchId));
employeeRouter.get('/employees-and-logins-report', managerAuthenticationMiddleware, asyncHandler(dataReportController.getEmployeeInfoAndRecentLoginsByBranchId));


export default employeeRouter;
