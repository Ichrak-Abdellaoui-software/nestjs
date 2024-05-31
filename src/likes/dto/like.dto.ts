import { IsMongoId, IsOptional } from 'class-validator';

export class LikeDto {
  @IsMongoId()
  @IsOptional()
  answerId?: string;

  @IsMongoId()
  @IsOptional()
  commentId?: string;
}
