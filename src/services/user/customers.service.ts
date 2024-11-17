import { AppDataSource } from "../../data-source";
import {Customers, Address, Packages, TrackingHistory} from '../../entities'
import { BadRequestError, NotFoundError } from '../../types/http-error.type'
import { UpdateCustomerDTO } from '../../dtos'
import { Repository } from 'typeorm';


class CustomersService {
    private addressRepository: Repository<Address>;
    private customerRepository: Repository<Customers>;
    private packageRepository: Repository<Packages>;
    private trackingHistoryRepository: Repository<TrackingHistory>;

constructor() {
    this.addressRepository = AppDataSource.getRepository(Address);
    this.customerRepository = AppDataSource.getRepository(Customers);
    this.packageRepository = AppDataSource.getRepository(Packages);
    this.trackingHistoryRepository = AppDataSource.getRepository(TrackingHistory);

    this.getCustomerProfile = this.getCustomerProfile.bind(this);
    this.editCustomerProfile = this.editCustomerProfile.bind(this);
    this.cancelPackageByCustomerIdAndPackageId = this.cancelPackageByCustomerIdAndPackageId.bind(this);
}

async getCustomerProfile(customerId: number) {
    const existedCustomer = await this.customerRepository.findOne({where: {customerId}});
    if (!existedCustomer) {

        throw new NotFoundError("Customer is not existed")
    }

    const address = await this.addressRepository.findOne({where: {addressId: existedCustomer.addressID}})
    if(!address) {
        throw new NotFoundError("Customer is currently not having any address infile")
    }

    const {password, ...customerProfile} = existedCustomer;
    return {
        ...customerProfile,
        address,
    }
}

async editCustomerProfile(customerId: number, dto: UpdateCustomerDTO) {
    const existedCustomer = await this.customerRepository.findOne({where: {customerId}});
    if (!existedCustomer) {

        throw new NotFoundError("Customer is not existed")
    }

    const address = await this.addressRepository.findOne({where: {street: dto.street, city: dto.city, state: dto.state, zipCode: dto.zipcode}})
    if(address) {
        existedCustomer.firstName = dto.firstName,
        existedCustomer.lastName = dto.lastName,
        existedCustomer.phoneNumber = dto.phoneNumber,
        existedCustomer.addressID = address.addressId,
        await this.customerRepository.save(existedCustomer);
        const {password, ...updatedCustomer} = existedCustomer;
        return {
            ...updatedCustomer,
            address,
        }
    }

    const newAddress = await this.addressRepository.create({
        street: dto.street,
        city: dto.city,
        state: dto.state,
        zipCode: dto.zipcode,
    })

    const customerNewAddresss = await this.addressRepository.save(newAddress);
    existedCustomer.firstName = dto.firstName,
    existedCustomer.lastName = dto.lastName,
    existedCustomer.phoneNumber = dto.phoneNumber,
    existedCustomer.addressID = customerNewAddresss.addressId,
    await this.customerRepository.save(existedCustomer);
    const {password, ...updatedCustomer} = existedCustomer;
    return {
        ...updatedCustomer,
        customerNewAddresss,
    }
}

async cancelPackageByCustomerIdAndPackageId (customerId: number, packageId: number) {

    if (!customerId || !packageId) {
        throw new BadRequestError('Please choose a package');
    }

    const packageToCancel = await this.packageRepository.findOne({where: {packageId, customerId}})

    if(!packageToCancel) {
        throw new NotFoundError('Package not found')
    }

    if(packageToCancel.status === "canceled"){
        throw new BadRequestError('Package has already been canceled');
    }

    if(packageToCancel.status === 'out for delivery' || packageToCancel.status === 'deliverd') {
        throw new BadRequestError(`Package cannot be canceled as it is out for delivery or already delivered`);
    }

    packageToCancel.status = "canceled";
    await this.packageRepository.save(packageToCancel);

    return {message: 'Package cancel successfully'};

    
} 

}


const customersService = new CustomersService();

export {customersService}