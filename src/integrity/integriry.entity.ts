import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Period {
  MONTH = 'month',
  YEAR = 'year',
}

@Entity()
export class IntegritySetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Period })
  period: Period;

  @Column({ type: 'jsonb' })
  tiers: { name: string; visits: number }[]; // e.g. [{name: 'gold', visits:15},...]
}
