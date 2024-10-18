import { AppDataSource } from "../data-source";
import { Employees } from "../entities/employees.entity";
import bcrypt from 'bcrypt';
import { CreateEmployeeDTO } from "../dtos";
import { PostOffice } from "../entities/post_office.entity";
import { Employees as Manager } from "../entities/employees.entity";
import { sign } from 'jsonwebtoken';


class AuthService {
    employeeRepository = AppDataSource.getRepository(Employees);
    postOfficeRepository = AppDataSource.getRepository(PostOffice);

    async employeeRegister(dto: CreateEmployeeDTO) {
  
        const existingEmployee = await this.employeeRepository.findOne({where: {email: dto.email}});
        if(existingEmployee){
            throw new Error('Employee with this email already exists');
        }

        const postOffice = await this.postOfficeRepository.findOne({where: {branchId: dto.branchId }});
        if(!postOffice){
            throw new Error('Post Office not found');
        }

        let manager: Manager |  null = null;
        if(dto.managerId) {
            manager = await this.employeeRepository.findOne({ where: { employeeId: dto.managerId}});
            if(!manager) {
                throw new Error('Manager Not Found')
            }
        }

        const hashPassword = await bcrypt.hash(dto.password, 10);
        const newEmployee = await this.employeeRepository.create(dto);
        await this.employeeRepository.save(newEmployee);

        return newEmployee;
    }
}

const authService = new AuthService();

export{authService}