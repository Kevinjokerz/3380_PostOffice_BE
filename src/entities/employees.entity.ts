import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Address } from "./address.entity";
import { PostOffice } from "./post_office.entity";


@Entity('Employees')
export class Employees {
    @PrimaryGeneratedColumn({name: 'employee_id'})
    employeeId!: number;

    @Column({name: 'first_name', type: 'varchar', length:50})
    firstName!: string;

    @Column({name: 'last_name', type: 'varchar', length:50})
    lastName!: string;

    @Column({name: 'date_of_birth', type: 'date'})
    DOB!: Date;

    @Column({name: 'email', type: 'varchar', length:50})
    email!: string;

    @Column({name: 'phone_number', type: 'varchar', length:10})
    phoneNumber!: string;

    @Column({name: 'position', type: 'varchar', length:50})
    position!: string

    @ManyToOne(() => PostOffice, (postOffice) => postOffice.employees)
    @JoinColumn({name: 'branch_id'})
    postOffice: PostOffice

    @ManyToOne(() => Employees)
    @JoinColumn({name: 'manager_id'})
    managerID!: Employees;
}