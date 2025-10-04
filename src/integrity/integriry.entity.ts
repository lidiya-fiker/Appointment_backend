import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum IntegrityPeriod {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Entity()
export class IntegritySetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: IntegrityPeriod })
  period: IntegrityPeriod; // monthly or yearly

  @Column()
  goldVisits: number;

  @Column()
  silverVisits: number;

  @Column()
  platinumVisits: number;
}
