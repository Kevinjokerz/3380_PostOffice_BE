import { AppDataSource } from '../../data-source'
import { BadRequestError, ConflictError, NotFoundError } from '../../types/http-error.type'
import { CatchAsyncDecorator } from '../../decorators/catch-async.decorator'
import { Repository } from 'typeorm';
import { PostOffice, Employees, Packages, Customers, Address, Dependent } from "../../entities";
import { UpdateEmployeeDTO, createPackageDTO, updatePackageDTO, CreateDependentDto } from '../../dtos';
import { error } from 'console';


// @CatchAsyncDecorator(EmployeesServices.name)
class EmployeesServices {
    private employeeRepository: Repository<Employees>;
    private postOfficeRepository: Repository<PostOffice>;
    private packageRepository: Repository<Packages>
    private customerRepository: Repository<Customers>;
    private addressRepository: Repository<Address>;
    private dependentRepository: Repository<Dependent>;

constructor() {
    this.postOfficeRepository = AppDataSource.getRepository(PostOffice);
    this.employeeRepository = AppDataSource.getRepository(Employees);
    this.packageRepository = AppDataSource.getRepository(Packages);
    this.customerRepository = AppDataSource.getRepository(Customers);
    this.addressRepository = AppDataSource.getRepository(Address);
    this.dependentRepository = AppDataSource.getRepository(Dependent);

    this.getEmployeeProfile = this.getEmployeeProfile.bind(this);
    this.editEmployeeProfile = this.editEmployeeProfile.bind(this);
    this.createPackage = this.createPackage.bind(this);
    this.addDependent = this.addDependent.bind(this);

}

private calculateWeightFee (weight: number) {
    if (weight <= 3) {
        return 1;
    } else if (weight > 3 && weight <= 8) {
        return 4;
    } else if (weight > 8 && weight <= 15) {
        return 8;
    } else if (weight > 15 && weight <= 23) {
        return 13;
    } else if (weight > 23 && weight <= 30) {
        return 18;
    } else {
        return 18 + (weight - 30) * 0.5;
    }
}

private calculateSizeFee(dimensions: string): number {

    switch (dimensions) {
        case "10x5x1":
            return 1;
        case "10x5x5":
            return 4;
        case "15x15x5":
            return 8;
        case "15x15x10":
            return 12;
        case "25x25x5":
            return 15;
        case "25x25x10":
            return 18;
        default:
            throw new Error("Invalid package size");
    }
}

private calculateShippingMethodFee (shippingMethod: string) : number {
    switch (shippingMethod) {
        case "standard" :
            return 0;
        case "express" :
            return 2;
        case "overnight" :
            return 5;
        case "priority" :
            return 1;
        default:
            throw new BadRequestError("Invalid shipping method");
    }
}

 private calculateTotalFee(dimensions: string, weight: number, shippingMethod: string): number {
    const sizeFee = this.calculateSizeFee(dimensions);
    const weightFee = this.calculateWeightFee(weight);
    const shippingMethodFee = this.calculateShippingMethodFee(shippingMethod);
    return sizeFee + weightFee + shippingMethodFee;
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
    existedEmployee.lastName = dto.lastName;
    existedEmployee.DOB = dto.DOB;
    existedEmployee.phoneNumber = dto.phoneNumber;
    await this.employeeRepository.save(existedEmployee);
    return existedEmployee;
}

async createPackage(employeeId: number, dto: createPackageDTO) {
        const existedEmployee = await this.employeeRepository.findOne({where: {employeeId}})
        if(!existedEmployee) {
            throw new NotFoundError('Employee is not existed');
        }
    
        const existedCustomer = await this.customerRepository.findOne({where: {email: dto.senderEmail}})
        if (!existedCustomer) {
            throw new BadRequestError("No customer found with the provided info, please register as a new customer to proceed")
        }
    
        const recipientAddress = await this.addressRepository.findOne({where: {street: dto.recipientStreet, city: dto.recipientCity, state: dto.recipientState, zipCode: dto.recipientZipcode}})
        if (!recipientAddress) {
            const newAddress = await this.addressRepository.create({
                street: dto.recipientStreet,
                city: dto.recipientCity,
                state: dto.recipientState,
                zipCode: dto.recipientZipcode
            })
    
            const recipientAddress = await this.addressRepository.save(newAddress);
    
            const newPackage = await this.packageRepository.create({
                customerId: existedCustomer.customerId,
                branchId: existedEmployee.branchId,
                senderAddressId: existedCustomer.addressID,
                recipientAddressId: recipientAddress.addressId,
                weight: dto.weight,
                dimensions: dto.dimensions,
                amount: this.calculateTotalFee(dto.dimensions, dto.weight, dto.shippingMethod),
                shippingMethod: dto.shippingMethod,
                status: "received",
                shippingDate: dto.shippingDate || null,
                deliveryDate: dto.deliveryDate || null,
            })
    
            await this.packageRepository.save(newPackage);
    
            return newPackage;
        }
    
        const newPackage = await this.packageRepository.create({
            customerId: existedCustomer.customerId,
            branchId: existedEmployee.branchId,
            senderAddressId: existedCustomer.addressID,
            recipientAddressId: recipientAddress.addressId,
            weight: dto.weight,
            dimensions: dto.dimensions,
            amount: this.calculateTotalFee(dto.dimensions, dto.weight, dto.shippingMethod),
            shippingMethod: dto.shippingMethod,
            status : "received",
            shippingDate: dto.shippingDate || null,
            deliveryDate: dto.deliveryDate || null,
        })
    
        await this.packageRepository.save(newPackage);
    
        return newPackage;

}

async updatePackage (dto: updatePackageDTO) {
    const existedPackage = await this.packageRepository.findOne({where: {packageId: dto.packageId}})
    if(!existedPackage) {
        throw new NotFoundError("Package does not exist");
    }

    existedPackage.status = dto.status,
    existedPackage.shippingDate = dto.shippingDate,
    existedPackage.deliveryDate = dto.deliveryDate,
    existedPackage.branchId = dto.currentBranchId,

    await this.packageRepository.save(existedPackage);
    return existedPackage;

}

async addDependent (employeeId: number, dto: CreateDependentDto) {
    const employee = await this.employeeRepository.findOne({where: {employeeId}});
    if(!employee) {
        throw new NotFoundError('Employee not found');
    }

    const existedDependent = await this.dependentRepository.findOne({where: {employeeId, firstName: dto.firstName, lastName: dto.lastName, DOB: dto.DOB, sex: dto.sex}})
    if(existedDependent) {
        throw new ConflictError('Dependent already existed');
    }

    const newDependent = this.dependentRepository.create({
        ...dto,
        employeeId: employee.employeeId
    })

    await this.dependentRepository.save(newDependent);
    return newDependent;
}

}

const employeesServices = new EmployeesServices();

export {employeesServices}