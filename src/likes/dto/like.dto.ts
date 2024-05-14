import { IsNotEmpty, IsEnum, IsMongoId } from 'class-validator';
import { LikableTypes } from 'src/enums/likable-types.enum';

export class LikeDto {
  @IsMongoId()
  @IsNotEmpty()
  createdBy: string;

  @IsMongoId()
  @IsNotEmpty()
  targetId: string;

  @IsEnum(LikableTypes)
  @IsNotEmpty()
  contentType: LikableTypes;
}
