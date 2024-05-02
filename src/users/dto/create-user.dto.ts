import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { UserRoles } from 'src/enums/user-roles.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  password: string;

  @IsNotEmpty()
  pole: string;

  //@IsEnum(UserRoles)
  @IsOptional()
  role: UserRoles;

  @IsOptional()
  @IsString()
  avatar: string;
}
