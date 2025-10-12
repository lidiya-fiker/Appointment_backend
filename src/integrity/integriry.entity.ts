import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Period {
  MONTH = 'month',
  YEAR = 'year',
}

@Entity()
export class IntegritySetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Period })
  period: Period;

  @Column({ type: 'int' })
  visits: number;
}
