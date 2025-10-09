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
import { Request } from 'src/requests/request.entity';

@Entity()
export class CheckInOut {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, { eager: true })
  customer: Customer;

  @OneToOne(() => Request, { eager: true })
  @JoinColumn()
  request: Request;

  @Column({ default: false })
  securityPassed: boolean;

  @Column({ default: false })
  checkedIn: boolean;

  @Column({ default: false })
  checkedOut: boolean;

  @Column({ default: false })
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
