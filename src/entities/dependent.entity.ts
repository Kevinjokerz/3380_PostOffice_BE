import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Employees } from "./employees.entity";

@Entity('dependent')
export class Dependent {
    @PrimaryGeneratedColumn({name: 'dependent_id'})
    dependentID!: number;

    @Column({name: 'first_name', type: 'varchar', length:50})
    firstName!: string;

    @Column({name: 'last_Name', type: 'varchar', length:50})
    lastName!: string;

    @Column({name: 'date_of_birth', type: 'date'})
    DOB!: Date

    @ManyToOne(() => Employees, (employee) => employee.dependents)
    employee!: Employees;
}