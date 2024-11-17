import { Repository, IsNull } from 'typeorm'
import { AppDataSource } from '../../data-source'
import { format } from 'date-fns'
import {NotFoundError} from '../../types/http-error.type'
import {Employees, Packages, NeedEmployeeAction} from '../../entities'
import { isNull } from 'lodash'


class NeedEmployeeActionsService {
    private needEmployeeActionRepository: Repository<NeedEmployeeAction>
    private employeeRepository: Repository<Employees>;


    constructor() {
        this.needEmployeeActionRepository = AppDataSource.getRepository(NeedEmployeeAction);
        this.employeeRepository = AppDataSource.getRepository(Employees);

    }

    async getNeededActionByEmployeeId (employeeId: number) {
        const existingEmployee = await this.employeeRepository.findOne({where: {employeeId}});
        if(!existingEmployee) {
            throw new NotFoundError('Employee not found')
        }


        const needEmployeeActions = await this.needEmployeeActionRepository.find({where: {employeeId: employeeId, isCompleted: IsNull()} })
        if (needEmployeeActions.length === 0) {
            throw new NotFoundError('No Action Needed at the moment');
        }

        return needEmployeeActions;
        
    }

}

const needEmployeeActionsService = new NeedEmployeeActionsService();
export {needEmployeeActionsService};