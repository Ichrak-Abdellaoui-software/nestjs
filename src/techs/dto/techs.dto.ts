import { IsNotEmpty } from 'class-validator';

export class TechDto {
  @IsNotEmpty()
  name: string;
}
