import {Request, Response} from 'express';
import {RequestWithEmployeeInfo, EmployeeInfo} from '../../types/custom-request.type'
import {dataReportService} from '../../services'



class DataReportController {
    async getPackageInfoAndTrackingHistoryByBranchId (req: RequestWithEmployeeInfo, res: Response){
        const { branchId } = req.employeeInfo as EmployeeInfo;
        const packageAndTrackingHistoriesReport = await dataReportService.getPackageInfoAndTrackingHistoriesByBranchId(branchId);
        res.send(packageAndTrackingHistoriesReport)
    }


}

const dataReportController = new DataReportController();

export {dataReportController}