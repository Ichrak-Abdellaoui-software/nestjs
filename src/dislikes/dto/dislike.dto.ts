import { IsMongoId, IsOptional } from 'class-validator';

export class DislikeDto {
  @IsMongoId()
  @IsOptional()
  answerId?: string;

  @IsMongoId()
  @IsOptional()
  commentId?: string;
}
