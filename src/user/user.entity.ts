import { Exclude } from 'class-transformer';
import { Request } from 'src/requests/request.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

export enum UserRole {
  CEO = 'ceo',
  FRONT_DESK = 'front_desk',
  SECRETARY = 'secretary',
  SECURITY = 'security',
}
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  // CEO has profile info; others are created by CEO
  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;

  @Column({ nullable: true })
  photo?: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @OneToMany(() => Request, (request) => request.createdBy)
  createdRequests: Request[];
}
