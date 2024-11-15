import { Repository } from 'typeorm'
import {CreateTrackingHistoryDTO} from '../../dtos'
import { PostOffice, TrackingHistory, Customers, Packages } from '../../entities'
import { AppDataSource } from '../../data-source'
import { NotFoundError } from '../../types/http-error.type'
import { format } from 'date-fns'



class TrackingHistoryService {
    private trackingHistoryRepository: Repository<TrackingHistory>
    private postOfficeRepository: Repository<PostOffice>;
    private customerRepository: Repository<Customers>;
    private packageRepository: Repository<Packages>
    

    constructor() {
        this.trackingHistoryRepository = AppDataSource.getRepository(TrackingHistory);
        this.postOfficeRepository = AppDataSource.getRepository(PostOffice);
        this.customerRepository = AppDataSource.getRepository(Customers);
        this.packageRepository = AppDataSource.getRepository(Packages);

        this.createTrackingHistory = this.createTrackingHistory.bind(this)
        this.viewTrackingHistoryWithCustomerId = this.viewTrackingHistoryWithCustomerId.bind(this)
    }

    async createTrackingHistory (branchId: number, dto: CreateTrackingHistoryDTO) {

        const location = await this.postOfficeRepository.findOne({where: {branchId}, relations: ['address']})
        if(!location) {
            throw new NotFoundError("Post Office is not found")
        }
        const newTrackingHistory = await this.trackingHistoryRepository.create({
            packageId: dto.packageId,
            status: dto.status,
            location: location.address.city + ', ' + location.address.state,
        });

        await this.trackingHistoryRepository.save(newTrackingHistory);
        return newTrackingHistory;
    }

    async viewTrackingHistoryWithCustomerId (customerId: number) {
        const existingCustomer = await this.customerRepository.findOne({where: {customerId}});
        if (!existingCustomer) {
            throw new NotFoundError("Customer is not existed")
        }

        const packages  = await this.packageRepository.find({where: {customerId}, relations: ['senderAddress', 'recipientAddress', 'trackingHistories', 'transactions']});
        if (!packages ) {
            throw new NotFoundError("You don't have any package infile")
        }

        return packages.map(pkg => ({
            packageInfo: {
                packageId: pkg.packageId,
                weight: pkg.weight,
                dimensions: pkg.dimensions,
                amount: pkg.amount,
                shippingMethod: pkg.shippingMethod,
                shippingDate: pkg.shippingDate,
                deliveryDate: pkg.deliveryDate,
                createAt: pkg.createdAt,
                updatedAt: format(new Date(pkg.updatedAt), 'yyyy-MM-dd'),
            },
            senderAddress: {
                street: pkg.senderAddress.street,
                city: pkg.senderAddress.city,
                state: pkg.senderAddress.state,
                zipcode: pkg.senderAddress.zipCode,
            },
            recepientAddress: {
                street: pkg.recipientAddress.street,
                city: pkg.recipientAddress.city,
                state: pkg.recipientAddress.state,
                zipcode: pkg.recipientAddress.zipCode,
            },
            trackingHistory: pkg.trackingHistories.map(history => ({
                status: history.status,
                date: format(new Date(history.updateDate), 'yyyy-MM-dd') ,
                location: history.location,
            })),
            transactionStatus: pkg.transactions.map(transaction => ({
                transactionId: transaction.transactionId,
                date: format(new Date(transaction.transactionDate), 'yyyy-MM-dd'),
                amount: transaction.amount,
                status: transaction.transactionStatus
            }))
        }));


    }



}

const trackingHistoryService = new TrackingHistoryService();

export { trackingHistoryService }