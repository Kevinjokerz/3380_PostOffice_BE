import { AppDataSource } from "../../data-source";
import { Customers, Packages, PostOffice, Transaction} from "../../entities"
import { BadRequestError, NotFoundError } from '../../types/http-error.type'
import { Not, Repository } from 'typeorm';



class TransactionsService {
    private packageRepository: Repository<Packages>;
    private customerRepository: Repository<Customers>;
    private postOfficeRepository: Repository<PostOffice>;
    private transactionsRepository: Repository<Transaction>

    constructor () {
        this.postOfficeRepository = AppDataSource.getRepository(PostOffice);
        this.packageRepository = AppDataSource.getRepository(Packages);
        this.customerRepository = AppDataSource.getRepository(Customers);
        this.transactionsRepository = AppDataSource.getRepository(Transaction);

    }

    async createNewTransaction (customerId: number, packageId: number) {
        const existingPackage = await this.packageRepository.findOne ({where: {packageId, customerId}})
        if(!existingPackage) {
            throw new NotFoundError('Package not found')
        }

        const newTransaction = await this.transactionsRepository.create({
            packageId: existingPackage.packageId,
            customerId: existingPackage.customerId,
            branchId: existingPackage.branchId,
            transactionDate: new Date(),
            amount: existingPackage.amount,
            transactionStatus: "unpaid"
        })

        await this.transactionsRepository.save(newTransaction);
        return newTransaction;
    }

    async makePayment (customerId: number, packageId: number) {
        const existingPackage = await this.packageRepository.findOne ({where: {packageId, customerId}})
        if(!existingPackage) {
            throw new NotFoundError('Package not found')
        }

        const existingTransaction = await this.transactionsRepository.findOne({where: {customerId, packageId}})
        if(!existingTransaction) {
            throw new NotFoundError("Transaction Not Found")
        }

        if(existingTransaction.transactionStatus === 'paid') {
            throw new BadRequestError('This transaction is already paid')
        }

        existingTransaction.transactionStatus = 'paid';

        await this.transactionsRepository.save(existingTransaction);
        return { message: "Transaction is successfully paid"}
    }
}


const transactionService = new TransactionsService();

export {transactionService}