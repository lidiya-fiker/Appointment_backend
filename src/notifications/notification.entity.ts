import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Request } from 'src/requests/request.entity';
import { User } from 'src/user/user.entity';

export enum NotificationType {
  REQUEST_APPROVED = 'request_approved',
  REQUEST_REJECTED = 'request_rejected',
  REQUEST_REASSIGNED = 'request_reassigned',
  REQUEST_CANCELLED = 'request_cancelled',
  CHECKIN = 'checkin',
  CHECKOUT = 'checkout',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column()
  message: string;

  @ManyToOne(() => User, { nullable: true, eager: true })
  to?: User; // the user to notify (secretary, front desk, CEO, etc)

  @ManyToOne(() => Request, { nullable: true, eager: true })
  request?: Request;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  read: boolean;
}
