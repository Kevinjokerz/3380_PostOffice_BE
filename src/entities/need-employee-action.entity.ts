import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn} from 'typeorm';
import {Employees, Packages} from '../entities'

@Entity('need_employee_action')
export class NeedEmployeeAction {
    @PrimaryGeneratedColumn({name: 'action_needed_id'})
    actionNeededId!: number;

    @Column({name: 'employee_id', type: 'int'})
    employeeId!: number;

    @Column({name: 'package_id', type: 'int'})
    packageId!: number;

    @Column({name: 'messages', type: 'varchar', length: 255, nullable: true})
    messages!: string;

    @Column({name: 'is_completed', type: 'timestamp', nullable: true})
    isCompleted!: Date | null;

    @CreateDateColumn({name: 'created_at', type: 'timestamp'})
    createdAt: Date;

    //Relationship
    @ManyToOne(() => Employees, (employee) => employee.needEmployeeActions, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'employee_id'})
    employee!: Employees;

    @ManyToOne(() => Packages, (pkg) => pkg.needEmployeeActions, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'package_id'})
    package!: Packages;

}