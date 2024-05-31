/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Patch,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/logint.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'success',
    };
  }
  // @UseGuards(JwtGuard)
  // @Patch('/change-password')
  // async changePassword(
  //   @Req() req: Request,
  //   @Body() changePasswordDto: { oldPassword: string; newPassword: string },
  // ) {
  //   const userId = req.user.sub;
  //   await this.authService.changePassword(
  //     userId,
  //     changePasswordDto.oldPassword,
  //     changePasswordDto.newPassword,
  //   );
  //   return { message: 'Password successfully changed' };
  // }
}
