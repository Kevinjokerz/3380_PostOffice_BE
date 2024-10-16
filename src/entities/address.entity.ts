import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from "typeorm";
import { Customer } from "./customer.entity";
import { PostOffice } from "./post_office.entity";

@Entity('address')
export class Address {
    @PrimaryGeneratedColumn({name: 'address_ID'})
    addressId!: number;

    @Column({name: 'street', type: 'varchar', length:100})
    street!: string;

    @Column({name: 'city', type: 'varchar', length:50})
    city!: string;

    @Column({name: 'state', type: 'varchar', length:50})
    state!: string;

    @Column({name: 'zip_code', type: 'varchar', length:10})
    zipCode!: number;

    @OneToMany(() => Customer, (customer) => customer.address)
    customer!: Customer[];

}