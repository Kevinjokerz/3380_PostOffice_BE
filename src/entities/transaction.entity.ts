import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { PostOffice, Customers, Packages } from "./index";

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn({ name: 'transaction_id' })
    transactionId!: number;
    
    @Column({name: 'package_id', type: 'int', nullable: false})
    packageId!: number

    @ManyToOne(() => Packages, (pkg) => pkg.transactions, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'package_id' })
    pkg!: Packages;

    @Column({name: 'customer_id', type: 'int', nullable: false})
    customerId!: number;

    @ManyToOne(() => Customers, (customer) => customer.transactions, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'customer_id' })
    customer!: Customers;

    @Column({name: 'branch_id', type: 'int', nullable: false})
    branchId: number;

    @ManyToOne(() => PostOffice, (employee) => employee.transactions, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'branch_id' })
    branch!: PostOffice;

    @CreateDateColumn({ name: 'transaction_date' })
    transactionDate!: Date;

    @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 0, nullable: false })
    amount!: number;

    @Column({ name: 'transaction_status', type: 'varchar', nullable: false })
    transactionStatus!: string;
}
