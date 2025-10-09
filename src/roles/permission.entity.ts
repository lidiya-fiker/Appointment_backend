import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string; // e.g. 'create_appointment'

  @Column()
  description: string;
}
