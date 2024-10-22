import {Request, Response} from 'express';
import {employeesServices} from '../../services'
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
}

const employeeController = new EmployeeController();
export {employeeController}