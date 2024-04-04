import { IsNotEmpty, IsOptional } from 'class-validator';

export class TechDto {
  @IsNotEmpty()
  name: string;
  @IsOptional()
  image?: string;
}
