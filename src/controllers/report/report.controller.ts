import {Request, Response} from 'express';
import {RequestWithEmployeeInfo, EmployeeInfo} from '../../types/custom-request.type'
import {dataReportService} from '../../services'



class DataReportController {
    async getPackageInfoAndTrackingHistoryByBranchId (req: RequestWithEmployeeInfo, res: Response){
        const { branchId } = req.employeeInfo as EmployeeInfo;
        const packageAndTrackingHistoriesReport = await dataReportService.getPackageInfoAndTrackingHistoriesByBranchId(branchId);
        res.send(packageAndTrackingHistoriesReport)
    }

    async getEmployeeInfoAndRecentLoginsByBranchId (req: RequestWithEmployeeInfo, res: Response) {
        const { branchId } = req.employeeInfo as EmployeeInfo;
        const employeeInfoAndRecentLoginsReport = await dataReportService.getEmployeeInfoAndEmployeeRecentLoginByBranchId(branchId);
        res.send(employeeInfoAndRecentLoginsReport)
    }

}

const dataReportController = new DataReportController();

export {dataReportController}