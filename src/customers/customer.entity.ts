import { Request } from 'src/requests/request.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  gender: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  organization: string;

  @Column()
  occupation: string;

  @OneToMany(() => Request, (request) => request.customer)
  requests: Request[];
}
