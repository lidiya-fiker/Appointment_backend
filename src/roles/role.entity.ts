import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Permission } from './permission.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Permission, { eager: true })
  @JoinTable()
  permissions: Permission[];

  // Lazy to prevent circular loading
  @OneToMany(() => User, (user) => user.role, { lazy: true })
  users: Promise<User[]>;
}
