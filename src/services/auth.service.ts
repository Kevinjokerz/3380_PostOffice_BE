import { AppDataSource } from "../data-source";
import { Employees } from "../entities/employees.entity";
import { hash, compare } from 'bcrypt';
import { CreateEmployeeDTO, EmployeeLoginDTO } from "../dtos";
import { PostOffice } from "../entities/post_office.entity";
import { Employees as Manager } from "../entities/employees.entity";
import { sign } from 'jsonwebtoken';
import { ConflictError, BadRequestError, NotFoundError, UnAuthorizedError } from '../types/http-error.type'
import { CatchAsyncDecorator } from '../decorators'





//@CatchAsyncDecorator(AuthService.name)
class AuthService {
    employeeRepository = AppDataSource.getRepository(Employees);
    postOfficeRepository = AppDataSource.getRepository(PostOffice);

    async employeeRegister(dto: CreateEmployeeDTO) {
        const existingEmployee = await this.employeeRepository.findOne({where: {email: dto.email}});

        if(existingEmployee){
            throw new ConflictError('Employee with this email already exists');
        }

        const postOffice = await this.postOfficeRepository.findOne({where: {branchId: dto.branchId }});
        if(!postOffice){
            throw new NotFoundError('Post Office not found');
        }

        let manager: Manager |  null = null;
        if(dto.managerId) {
            manager = await this.employeeRepository.findOne({ where: { employeeId: dto.managerId}});
            if(!manager) {
                throw new NotFoundError('Manager Not Found')
            }
        }

        const hashPassword = await hash(dto.password, 10);
        const newEmployee = await this.employeeRepository.create({
            ...dto,
            password: hashPassword
        });
        await this.employeeRepository.save(newEmployee);

        return newEmployee;
    }

    async employeeLogin(dto: EmployeeLoginDTO) {
        const JWT_SECRET = process.env.JWT_SECRET || '';
        const {email, password} = dto;
        const existedEmployee = await this.employeeRepository.findOne({where: { email }});
        if(!existedEmployee) {
            throw new NotFoundError('Employee is not existed')
        };
        const passwordCheck = await compare(password, existedEmployee.password)
        if(!passwordCheck) {
            throw new BadRequestError('Wrong password')
        };

        const employeeInfo = {firstName: existedEmployee.firstName, 
            last_name: existedEmployee.lastName,
            email: existedEmployee.email,
            postion: existedEmployee.position,
            branchId: existedEmployee.branchId
        }
        const accessToken = sign(employeeInfo, JWT_SECRET, {expiresIn: '2h'});
        return accessToken;
    }
}


const authService = new AuthService();

export{authService}