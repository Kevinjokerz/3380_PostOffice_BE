import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Address } from "./address.entity";

@Entity('Customer')
export class Customer {
    @PrimaryGeneratedColumn({name: 'customer_id'})
    customerId!: number;

    @Column({name: 'first_name', type: 'varchar', length:50})
    firstName!: string;

    @Column({name: 'last_Name', type: 'varchar', length:50})
    lastName!: string;

    @Column({name: 'email', type: 'varchar', length:50})
    email!: string;

    @Column({name: 'phone_Number', type: 'varchar', length:50})
    phoneNumber: string;

    @ManyToOne(() => Address, (address) => address.customer)
    @JoinColumn({name: 'address_id'})
    address!: Address;

    @Column({name: 'is_active', type: 'bool', width: 1, default: 1})
    isActive: boolean;
}