import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { UserRoles } from 'src/enums/user-roles.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  pole: string;

  @IsEnum(UserRoles)
  role: UserRoles;

  @IsOptional()
  @IsString()
  avatar: string;
}
