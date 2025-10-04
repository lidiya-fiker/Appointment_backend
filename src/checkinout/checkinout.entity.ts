import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Customer } from 'src/customers/customer.entity';

@Entity()
export class CheckInOut {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer)
  customer: Customer;

  @ManyToOne(() => User)
  checkedInBy: User; // secretary

  @ManyToOne(() => User)
  checkedOutBy: User; // security

  @Column({ type: 'timestamp', nullable: true })
  checkInTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkOutTime?: Date;

  @Column({ default: false })
  securityPassed: boolean;

  @Column({ default: false })
  completed: boolean; // when both checkin & checkout done
}
