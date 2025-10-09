import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, RequestStatus } from 'src/requests/request.entity';
import { ApproveRequestDto } from './dto/approve-request.dto';
import { RejectRequestDto } from './dto/reject-request.dto';
import { ReassignRequestDto } from './dto/reassign-request.dto';
import { Approval } from './approvals.entity';
import { NotificationService } from 'src/notifications/notification.service';

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectRepository(Approval) private approvalRepo: Repository<Approval>,
    @InjectRepository(Request) private requestRepo: Repository<Request>,
    private notificationSvc: NotificationService,
  ) {}

  async approve(requestId: string, dto: ApproveRequestDto) {
    const req = await this.requestRepo.findOne({
      where: { id: requestId },
      relations: ['approval', 'customer'],
    });
    if (!req) throw new NotFoundException('Request not found');
    if (req.status !== RequestStatus.PENDING)
      throw new BadRequestException('Only pending can be approved');

    let approval = req.approval;
    if (!approval) approval = this.approvalRepo.create();
    approval.allowedMaterials = dto.allowedMaterials || [];
    approval.inspectionRequired = !!dto.inspectionRequired;
    approval.reason = null;

    approval = await this.approvalRepo.save(approval);
    req.approval = approval;
    req.status = RequestStatus.APPROVED;
    await this.requestRepo.save(req);

    // notify secretary / front desk
    await this.notificationSvc.create({
      type: 'request_approved',
      message: `Request for ${req.customer.firstName} approved`,
      requestId: req.id,
    });
    return req;
  }

  async reject(requestId: string, dto: RejectRequestDto) {
    const req = await this.requestRepo.findOne({
      where: { id: requestId },
      relations: ['approval', 'customer'],
    });
    if (!req) throw new NotFoundException('Request not found');
    if (req.status !== RequestStatus.PENDING)
      throw new BadRequestException('Only pending can be rejected');

    let approval = req.approval;
    if (!approval) approval = this.approvalRepo.create();
    approval.reason = dto.reason;
    approval.allowedMaterials = null;
    approval.inspectionRequired = false;
    approval = await this.approvalRepo.save(approval);

    req.approval = approval;
    req.status = RequestStatus.REJECTED;
    await this.requestRepo.save(req);

    await this.notificationSvc.create({
      type: 'request_rejected',
      message: `Request for ${req.customer.firstName} rejected: ${dto.reason}`,
      requestId: req.id,
    });

    return req;
  }

  async reassign(requestId: string, dto: ReassignRequestDto) {
    const req = await this.requestRepo.findOne({
      where: { id: requestId },
      relations: ['approval', 'customer'],
    });
    if (!req) throw new NotFoundException('Request not found');

    req.reassignedDate = dto.reassignedDate;
    req.reassignedTimeFrom = dto.reassignedTimeFrom;
    req.reassignedTimeTo = dto.reassignedTimeTo;
    req.status = RequestStatus.REASSIGNED;

    // update/create approval details if provided
    let approval = req.approval;
    if (!approval) approval = this.approvalRepo.create();
    if (dto.allowedMaterials) approval.allowedMaterials = dto.allowedMaterials;
    if (dto.inspectionRequired !== undefined)
      approval.inspectionRequired = dto.inspectionRequired;
    approval = await this.approvalRepo.save(approval);
    req.approval = approval;

    await this.requestRepo.save(req);

    await this.notificationSvc.create({
      type: 'request_reassigned',
      message: `Request for ${req.customer.firstName} reassigned to ${dto.reassignedDate} ${dto.reassignedTimeFrom}`,
      requestId: req.id,
    });

    return req;
  }

  async cancel(requestId: string) {
    const req = await this.requestRepo.findOne({
      where: { id: requestId },
      relations: ['customer', 'approval'],
    });

    if (!req) throw new NotFoundException('Request not found');

    // Only pending or approved requests can be cancelled
    if (
      req.status !== RequestStatus.PENDING &&
      req.status !== RequestStatus.APPROVED
    ) {
      throw new BadRequestException(
        'Only pending or approved requests can be cancelled',
      );
    }

    req.status = RequestStatus.CANCELLED;
    await this.requestRepo.save(req);

    // Optional: create notification
    await this.notificationSvc.create({
      type: 'request_cancelled',
      message: `Request for ${req.customer.firstName} has been cancelled`,
      requestId: req.id,
    });

    return req;
  }
}
