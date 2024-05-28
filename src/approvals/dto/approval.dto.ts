import { IsMongoId, IsOptional } from 'class-validator';

export class ApprovalDto {
  @IsMongoId()
  questionId: string;

  @IsOptional()
  @IsMongoId()
  answerId?: string;

  @IsOptional()
  @IsMongoId()
  commentId?: string;
}
