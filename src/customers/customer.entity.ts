import { Request } from 'src/requests/request.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

export enum IntegrityTier {
  GOLD = 'Gold',
  SILVER = 'Silver',
  BRONZE = 'Bronze',
}

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  gender: string;

  @Column({ nullable: true })
  plateNum: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  organization: string;

  @Column()
  occupation: string;

  @Column({ type: 'enum', enum: IntegrityTier, default: IntegrityTier.BRONZE })
  integrityTier: IntegrityTier;

  @OneToMany(() => Request, (request) => request.customer)
  requests: Request[];
}
