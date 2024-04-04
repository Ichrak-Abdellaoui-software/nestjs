import { IsNotEmpty, IsOptional } from 'class-validator';

export class PoleDto {
  @IsNotEmpty()
  name: string;
  @IsOptional()
  image?: string;

  //   members:
  //   teamManager:
}
