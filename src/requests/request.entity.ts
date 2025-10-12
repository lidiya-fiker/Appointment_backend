import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from 'src/customers/customer.entity';
import { Approval } from 'src/approvals/approvals.entity';
import { User } from 'src/user/user.entity';
import { CheckInOut } from 'src/checkinout/checkinout.entity';

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REASSIGNED = 'reassigned',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity()
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, (c) => c.requests, { cascade: true, eager: true })
  customer: Customer;

  @ManyToOne(() => User, (user) => user.createdRequests, { eager: true })
  createdBy: User;

  @Column({ type: 'date' })
  appointmentDate: Date;

  @Column()
  timeFrom: string;

  @Column()
  timeTo: string;

  @Column({ nullable: true })
  purpose: string;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;

  @Column({ nullable: true })
  reassignedDate?: string;

  @Column({ nullable: true })
  reassignedTimeFrom?: string;

  @Column({ nullable: true })
  reassignedTimeTo?: string;

  @OneToOne(() => Approval, (a) => a.request, { cascade: true, eager: true })
  @JoinColumn()
  approval: Approval;

  @OneToOne(() => CheckInOut, (c) => c.request, { cascade: true })
  checkInOut: CheckInOut;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
