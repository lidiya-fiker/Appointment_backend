import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, RequestStatus } from 'src/requests/request.entity';
import { ApproveRequestDto } from './dto/approve-request.dto';
import { instanceToPlain } from 'class-transformer';
import { Approval } from './approvals.entity';
import { RejectRequestDto } from './dto/reject-request.dto';
import { ReassignRequestDto } from './dto/reassign-request.dto';

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectRepository(Approval)
    private readonly approvalRepo: Repository<Approval>,

    @InjectRepository(Request)
    private readonly requestRepo: Repository<Request>,
  ) {}

  // ✅ Approve a request
  async approve(requestId: string, dto: ApproveRequestDto) {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
      relations: ['approval', 'customer'],
    });
    if (!request) throw new NotFoundException('Request not found');

    if (request.status !== RequestStatus.PENDING)
      throw new BadRequestException('Only pending requests can be approved');

    let approval = request.approval;
    if (!approval) {
      approval = this.approvalRepo.create({
        request,
        allowedMaterials: dto.allowedMaterials,
        inspectionRequired: dto.inspectionRequired,
      });
    } else {
      approval.allowedMaterials = dto.allowedMaterials;
      approval.inspectionRequired = dto.inspectionRequired;
      approval.reason = null;
    }

    request.status = RequestStatus.APPROVED;
    request.approval = await this.approvalRepo.save(approval);

    const saved = await this.requestRepo.save(request);
    return instanceToPlain(saved);
  }

  // 🚫 Reject a request
  async reject(requestId: string, dto: RejectRequestDto) {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
      relations: ['approval'],
    });
    if (!request) throw new NotFoundException('Request not found');

    if (request.status !== RequestStatus.PENDING)
      throw new BadRequestException('Only pending requests can be rejected');

    let approval = request.approval;
    if (!approval) {
      approval = this.approvalRepo.create({ request, reason: dto.reason });
    } else {
      approval.reason = dto.reason;
      approval.allowedMaterials = null;
      approval.inspectionRequired = false;
    }

    request.status = RequestStatus.REJECTED;
    request.approval = await this.approvalRepo.save(approval);

    const saved = await this.requestRepo.save(request);
    return instanceToPlain(saved);
  }

  // 🔁 Reassign a request (change date/time)
  async reassign(requestId: string, dto: ReassignRequestDto) {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
      relations: ['approval'],
    });
    if (!request) throw new NotFoundException('Request not found');

    if (!dto.reassignedDate || !dto.reassignedTimeFrom || !dto.reassignedTimeTo)
      throw new BadRequestException('Reassigned date and time are required');

    request.reassignedDate = dto.reassignedDate;
    request.reassignedTimeFrom = dto.reassignedTimeFrom;
    request.reassignedTimeTo = dto.reassignedTimeTo;
    request.status = RequestStatus.REASSIGNED;

    let approval = request.approval;
    if (!approval) {
      approval = this.approvalRepo.create({
        request,
        allowedMaterials: dto.allowedMaterials,
        inspectionRequired: dto.inspectionRequired,
      });
    } else {
      if (dto.allowedMaterials)
        approval.allowedMaterials = dto.allowedMaterials;
      if (dto.inspectionRequired !== undefined)
        approval.inspectionRequired = dto.inspectionRequired;
    }

    request.approval = await this.approvalRepo.save(approval);
    const saved = await this.requestRepo.save(request);
    return instanceToPlain(saved);
  }

  // Optional: list all approvals
  async findAll() {
    const approvals = await this.approvalRepo.find({ relations: ['request'] });
    return instanceToPlain(approvals);
  }
}
