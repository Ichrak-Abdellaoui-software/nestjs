import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApprovalDto } from './dto/approval.dto';
import { ApprovalsService } from './approvals.service';

@Controller('aprv')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Post('approve')
  async approve(@Body() approvalDto: ApprovalDto) {
    return this.approvalsService.approve(approvalDto);
  }

  @Post('disapprove')
  async disapprove(@Body() approvalDto: ApprovalDto) {
    return this.approvalsService.disapprove(approvalDto);
  }

  @Get()
  async findAll() {
    return this.approvalsService.findAll();
  }

  @Get(':userId')
  async findByUser(@Param('userId') userId: string) {
    const approvals = await this.approvalsService.findByUsetypescr(userId);
    if (!approvals.length) {
      throw new NotFoundException(
        `Approvals not found for user with ID ${userId}`,
      );
    }
    return approvals;
  }
}
