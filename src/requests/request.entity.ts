import { Approval } from 'src/approvals/approvals.entity';
import { Customer } from 'src/customers/customer.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REASSIGNED = 'reassigned',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

@Entity()
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.requests, {
    cascade: true,
    eager: true,
  })
  customer: Customer;

  @ManyToOne(() => User, (user) => user.createdRequests)
  createdBy: User; // front desk or ceo

  @Column({ type: 'date' })
  appointmentDate: string;

  @Column()
  timeFrom: string;

  @Column()
  timeTo: string;

  @Column()
  purpose: string;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;

  @Column({ nullable: true })
  reassignedDate?: string;

  @Column({ nullable: true })
  reassignedTimeFrom?: string;

  @Column({ nullable: true })
  reassignedTimeTo?: string;

  @OneToOne(() => Approval, (approval) => approval.request, { cascade: true })
  @JoinColumn()
  approval: Approval;
}
