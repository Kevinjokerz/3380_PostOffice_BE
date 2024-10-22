import { AppDataSource } from "../../data-source";
import { Customers, Address } from '../../entities';
import { hash, compare } from 'bcrypt';
import { CreateCustomerDTO, CustomerLoginDTO } from "../../dtos";
import { sign } from 'jsonwebtoken';
import { ConflictError, BadRequestError, NotFoundError, UnAuthorizedError } from '../../types/http-error.type'
import { Repository } from 'typeorm';
import { CustomerInfo } from "../../types/custom-request.type";





class CustomerAuthService {

private addressRepository: Repository<Address>;
private customerRepository: Repository<Customers>;

constructor() {
    this.addressRepository = AppDataSource.getRepository(Address);
    this.customerRepository = AppDataSource.getRepository(Customers);

    this.customerRegister = this.customerRegister.bind(this);
    this.customerLogin = this.customerLogin.bind(this);
}

    async customerRegister(dto: CreateCustomerDTO) {
            const existingCustomer = await this.customerRepository.findOne({where: {email: dto.email}})
            const existingAddress = await this.addressRepository.findOne({where: {street: dto.street, city: dto.city, state: dto.state, zipCode: dto.zipcode}})
            if(existingCustomer){
                throw new ConflictError('Customer with this email is already existed')
            }

            const hashPassword = await hash(dto.password, 10);
            if(existingAddress){
                const newCustomer = await this.customerRepository.create({
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    phoneNumber: dto.phoneNumber,
                    addressID: existingAddress.addressId,
                    password: hashPassword,
                })
                await this.customerRepository.save(newCustomer);
                return newCustomer;
            }
    
            const newAddress = await this.addressRepository.create({
                street: dto.street,
                city: dto.city,
                state: dto.state,
                zipCode: dto.zipcode,
            })
    
            const customerAddress = await this.addressRepository.save(newAddress)
            const newCustomer = await this.customerRepository.create({
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email,
                phoneNumber: dto.phoneNumber,
                addressID: customerAddress.addressId,
                password: hashPassword,
            })

            await this.customerRepository.save(newCustomer);
            return newCustomer;
    }

    async customerLogin(dto: CustomerLoginDTO) {
        const JWT_SECRET = process.env.JWT_SECRET || '';
        const {email, password} = dto;
        const existingCustomer = await this.customerRepository.findOne({where: {email}});
        if(!existingCustomer) {
            throw new NotFoundError('Customer is not existed')
        }
        const passwordCheck = await compare(password, existingCustomer.password)

        if(!passwordCheck) {
            throw new BadRequestError('Wrong password');
        }
        
        const customerInfo : CustomerInfo = {
            customerId: existingCustomer.customerId,
            addressId: existingCustomer.addressID
        }

        const accessToken = sign(customerInfo, JWT_SECRET, {expiresIn: '2h'});
        return accessToken

    }
}

const customerAuthService = new CustomerAuthService();

export {customerAuthService}