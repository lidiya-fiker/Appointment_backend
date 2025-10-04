import { Request } from 'src/requests/request.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity()
export class Approval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Request, (request) => request.approval)
  request: Request;

  @Column({ default: false })
  inspectionRequired: boolean;

  @Column('text', { array: true, nullable: true })
  allowedMaterials?: string[]; // e.g., ['PC', 'Mobile']

  @Column({ nullable: true })
  reason?: string; // for rejection
}
