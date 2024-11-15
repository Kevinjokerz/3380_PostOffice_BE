import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm"
import {Customers, Packages} from './index'

@Entity('notifications')
export class Notifications {
    @PrimaryGeneratedColumn({name: 'notification_id'})
    notificationId!: number;

    @Column({name: 'customer_id', type: 'int', nullable: false})
    customerId!: number;

    @ManyToOne(() => Customers, (customer) => customer.notifications)
    @JoinColumn({name: 'customer_id'})
    customer!: Customers;

    @Column({name: 'package_id', type: 'int', nullable: false})
    packageId!: number;

    @ManyToOne(() => Packages, (pkg) => pkg.notifications)
    @JoinColumn({name: 'package_id'})
    pkg!: Packages;

    @Column({name: 'message', type: 'varchar', nullable: true})
    message: string;

    @Column({name: 'created_at', type: 'date', default: ()=> 'CURRENT_TIMESTAMP'})
    createdAt: Date;

}