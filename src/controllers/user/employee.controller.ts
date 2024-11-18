import {Request, Response} from 'express';
import {employeesServices, trackingHistoryService, transactionService, needEmployeeActionsService} from '../../services'
import {RequestWithEmployeeInfo, EmployeeInfo} from '../../types/custom-request.type'



class EmployeeController {
    async getEmployeeProfile(req: RequestWithEmployeeInfo, res: Response) {
        const { employeeId } = req.employeeInfo as EmployeeInfo;
        const existedEmployee = await employeesServices.getEmployeeProfile(employeeId);
        res.send(existedEmployee);
    }

    async editEmployeeProfile(req: RequestWithEmployeeInfo, res: Response) {
        const { employeeId } = req.employeeInfo as EmployeeInfo;
        const updatedEmployeeInfo = await employeesServices.editEmployeeProfile(employeeId, req.body);
        res.send(updatedEmployeeInfo);
    }    

    async createPackage (req: RequestWithEmployeeInfo, res: Response) {
        const { employeeId, branchId } = req.employeeInfo as EmployeeInfo;
        const { payload } = req.body;
        const newPackage = await employeesServices.createPackage(employeeId, payload);
        await trackingHistoryService.createTrackingHistory(branchId, {packageId: newPackage.packageId, status: 'received'})
        await transactionService.createNewTransaction(newPackage.customerId, newPackage.packageId)
        res.send(newPackage);
    }

    async updatePackage (req: Request, res: Response) {
        const {payload} = req.body;
        const updatedPackage = await employeesServices.updatePackage(payload);
        res.send(updatedPackage);
    }

    async addDependent (req: RequestWithEmployeeInfo, res: Response) {
        const { employeeId } = req.employeeInfo as EmployeeInfo;
        const { payload } = req.body;
        const newDependent = await employeesServices.addDependent(employeeId, payload);
        res.send(newDependent)
    }

    async getNeededActions (req: RequestWithEmployeeInfo, res: Response) {
        const { employeeId } = req.employeeInfo as EmployeeInfo;
        const neededActions = await needEmployeeActionsService.getNeededActionByEmployeeId(employeeId);
        res.send(neededActions);
    }

    async createNewBranch (req: Request, res: Response) {
        const { payload } = req.body;
        const newBranch = await employeesServices.createNewBranch(payload);
        res.send(newBranch)
    }
}

const employeeController = new EmployeeController();
export {employeeController}