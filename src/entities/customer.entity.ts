import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Address } from "./address.entity";
import {Packages} from './packages.entity'

@Entity('Customers')
export class Customers {
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

    @Column({name: 'address_id', type: 'int'})
    addressID: number;

    @Column({ name: 'password', type: 'varchar', length: 255 })
    password!: string;

    @ManyToOne(() => Address, (address) => address.customers)
    @JoinColumn({name: 'address_id'})
    address!: Address;


    @OneToMany(() => Packages, (packages) => packages.customer)
    packages: Packages[]
}