import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Role } from 'src/roles/role.entity';
import { Exclude } from 'class-transformer';
import { Request } from 'src/requests/request.entity';
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;

  @Column({ nullable: true })
  photo?: string;

  @ManyToOne(() => Role, (role) => role.users, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
  })
  role: Role;

  @OneToMany(() => Request, (request) => request.createdBy, { lazy: true })
  createdRequests: Promise<Request[]>;
}
