import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Period {
  MONTH = 'month',
  YEAR = 'year',
}

@Entity()
export class IntegritySetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  tiers: { name: string; visits: number; period: Period }[];
}
