import { AppDataSource } from '../../data-source'
import { Employees } from '../../entities/employees.entity'
import { NotFoundError } from '../../types/http-error.type'
import { CatchAsyncDecorator } from '../../decorators/catch-async.decorator'
import { Repository } from 'typeorm';
import { PostOffice } from "../../entities/post_office.entity";
import { UpdateEmployeeDTO } from '../../dtos';


// @CatchAsyncDecorator(EmployeesServices.name)
class EmployeesServices {
    private employeeRepository: Repository<Employees>;
    private postOfficeRepository: Repository<PostOffice>;

constructor() {
    this.postOfficeRepository = AppDataSource.getRepository(PostOffice);
    this.employeeRepository = AppDataSource.getRepository(Employees);

    this.getEmployeeProfile = this.getEmployeeProfile.bind(this);
}

async getEmployeeProfile(employeeId : number) {
    const existedEmployee = await this.employeeRepository.findOne({where: {employeeId}});
    if (!existedEmployee) {
        throw new NotFoundError("Employee is not existed")
    }

    const postOffice = await this.postOfficeRepository.findOne({where: {branchId: existedEmployee.branchId}});
    if(!postOffice) {
        throw new NotFoundError("Employee is currently not assign to any branch")
    }

    const {password, ...employeeProfile} = existedEmployee;
    return {
        ...employeeProfile,
        postOffice,
    };
}

async editEmployeeProfile(employeeId: number, dto: UpdateEmployeeDTO) {
    const existedEmployee = await this.employeeRepository.findOne({where: {employeeId}})
    if(!existedEmployee) {
        throw new NotFoundError('Employee is not existed');
    }
    existedEmployee.firstName = dto.firstName;
    console.log(dto)
    console.log(existedEmployee.firstName)
    existedEmployee.lastName = dto.lastName;
    existedEmployee.DOB = dto.DOB;
    existedEmployee.phoneNumber = dto.phoneNumber;
    await this.employeeRepository.save(existedEmployee);
    return existedEmployee;
}
}

const employeesServices = new EmployeesServices();

export {employeesServices}