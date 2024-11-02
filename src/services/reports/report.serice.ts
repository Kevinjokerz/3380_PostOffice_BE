import { AppDataSource } from "../../data-source";
import { Employees, Address, Packages, TrackingHistory, PostOffice } from "../../entities";
import {NotFoundError, ForbiddenError } from '../../types/http-error.type'
import { Not, Repository } from 'typeorm';
import { format } from 'date-fns'

class DataReportService {
    private addressRepository: Repository<Address>;
    private postOfficeRepository: Repository<PostOffice>;
    private employeeRepository: Repository<Employees>;
    private packageRepository: Repository<Packages>

    constructor() {
    this.addressRepository = AppDataSource.getRepository(Address);
    this.postOfficeRepository = AppDataSource.getRepository(PostOffice);
    this.employeeRepository = AppDataSource.getRepository(Employees);
    this.packageRepository = AppDataSource.getRepository(Packages);
    


}

async getPackageInfoAndTrackingHistoriesByBranchId (branchId: number) {
    const postOffice = await this.postOfficeRepository.findOne({where: {branchId}, relations: ["address"]});
    if (!postOffice) {
        throw new NotFoundError("Post Office does not exist")
    }

    const packages = await this.packageRepository.find({where: {branchId}, relations: ["trackingHistories", "branch"]});
    if (packages.length === 0) {
        throw new NotFoundError("No packages exist")
    }

    return{ 
        postOfficeInfo: {
            branchId : postOffice.branchId,
            branchName: postOffice.branchName,
            address: postOffice.address ?{
                street: postOffice.address.street,
                city: postOffice.address.city,
                state: postOffice.address.state,
                zipcode: postOffice.address.zipCode,
            } : null
        },
        packages: packages.map(pkg => ({
        packageInfo: {
            packageId: pkg.packageId,
            weight: pkg.weight,
            dimensions: pkg.dimensions,
            amount: pkg.amount,
            shippingMethod: pkg.shippingMethod,
            shippingDate: pkg.shippingDate,
            deliveryDate: pkg.deliveryDate,
            createAt: pkg.createdAt,
            updatedAt: pkg.updatedAt,
        },
        trackingHistory: pkg.trackingHistories.map(history => ({
            status: history.status,
            date: history.updateDate,
            location: history.location,
        }))
        
    }))}
}

async getEmployeeInfoAndEmployeeRecentLoginByBranchId (branchId: number) {
    const postOffice = await this.postOfficeRepository.findOne({
        where: {branchId},
        relations: ['address']
    });
    if(!postOffice) {
        throw new NotFoundError("This post office's branch does not exist")
    }

    const employees = await this.employeeRepository.find({
        where: {branchId},
       relations: ['recentLogins']
    })
    console.log(employees)
    if(employees.length === 0){
        throw new NotFoundError('No employees found in this branch')
    }

    return {
        postOfficeInfo: {
            branchId : postOffice.branchId,
            branchName: postOffice.branchName,
            address: postOffice.address ?{
                street: postOffice.address.street,
                city: postOffice.address.city,
                state: postOffice.address.state,
                zipcode: postOffice.address.zipCode,
            } : null
        },
        employees: employees.map(employee => ({
            employeeInfo: {
                employeeId: employee.employeeId,
                firstName: employee.firstName,
                lastName: employee.lastName,
                phoneNumber: employee.phoneNumber,
                position: employee.position,
                createdAt: format(new Date(employee.createdAt), 'yyyy-MM-dd HH:mm:ss'),

            },
            recentLogins: employee.recentLogins.map(logins => ({
                ...logins,
                loginTime: format(new Date(logins.loginTime), 'yyyy-MM-dd HH:mm:ss')
            })) || null
        }))
    }


}

}

const dataReportService = new DataReportService();
export {dataReportService};