import { IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';

export class DislikeDto {
  @IsMongoId()
  @IsNotEmpty()
  createdBy: string;

  @IsMongoId()
  @IsOptional()
  answerId?: string;

  @IsMongoId()
  @IsOptional()
  commentId?: string;
}
