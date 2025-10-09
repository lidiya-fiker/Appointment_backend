import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification) private repo: Repository<Notification>,
  ) {}

  async create(data: {
    type: NotificationType | string;
    message: string;
    toUserId?: string;
    requestId?: string;
  }) {
    const n = this.repo.create({
      type: data.type as NotificationType,
      message: data.message,
      read: false,
      // to and request foreign keys can be assigned later by loading user,request - simplified here
      // For now we create minimal record; extend as needed.
    });
    return this.repo.save(n);
  }

  async listForUser(userId: string) {
    return this.repo.find({ where: { to: { id: userId } } });
  }

  async markRead(id: string) {
    const n = await this.repo.findOne({ where: { id } });
    if (!n) throw new Error('Not found');
    n.read = true;
    return this.repo.save(n);
  }
}
