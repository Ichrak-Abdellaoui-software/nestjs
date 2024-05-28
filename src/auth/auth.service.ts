/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/logint.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      // console.log('Plain password:', password);
      // console.log('Hashed password:', user.password);
      const isPasswordMatching = await bcrypt.compare(password, user.password);
      if (isPasswordMatching) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = {
      email: user.email,
      sub: user._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  // async changePassword(
  //   userId: string,
  //   oldPassword: string,
  //   newPassword: string,
  // ): Promise<void> {
  //   const user = await this.usersService.findOne(userId);
  //   if (!user) {
  //     throw new UnauthorizedException('User not found');
  //   }

  //   const isMatch = await bcrypt.compare(oldPassword, user.password);
  //   if (!isMatch) {
  //     throw new UnauthorizedException('Old password is incorrect');
  //   }

  //   const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  //   user.password = hashedNewPassword;
  //   await user.save();
  // }
}
