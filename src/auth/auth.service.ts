/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/logint.dto';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/models/users.models';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

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
    let user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    user = user._doc;
    return {
      access_token: this.jwtService.sign(user),
      userData: user,
    };
  }
  async changePassword(userId: string, oldPassword: string, newPass: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    user.password = await bcrypt.hash(newPass, 10);
    await user.save();
    return { message: 'Password successfully changed' };
  }
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ email }).lean();
    if (!user) {
      throw new NotFoundException('Email does not exist');
    }

    const resetToken = uuidv4();
    const resetTokenExpiration = new Date();
    resetTokenExpiration.setHours(resetTokenExpiration.getHours() + 1); // Token expires after 1 hour

    await this.userModel.updateOne(
      { _id: user._id },
      { resetToken, resetTokenExpires: resetTokenExpiration },
    );

    const mailOptions = {
      from: '"Mobistock Support" <support@mobistack.com>',
      to: email,
      subject: 'Your Password Reset Request',
      html: `
          <html>
          <head>
              <style>
                  body {
                      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                      color: #333333;
                      background-color: #F4F4F7;
                      margin: 0;
                      padding: 0;
                  }
                  .email-container {
                      width: 600px;
                      margin: auto;
                      background: #FFFFFF;
                      border: 1px solid #DDDDDD;
                      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                      padding: 40px;
                      text-align: center; /* Center aligns everything in the container */
                  }
                  .header {
                      color: #0056b3;
                      font-size: 24px;
                      font-weight: 300;
                      margin-top: 20px; /* Add space between the logo and the header text */
                  }
                  .content-block {
                      background-color: #E8F0FE;
                      color: #333333;
                      padding: 20px;
                      border-left: 5px solid #0056b3;
                      margin: 30px 0;
                      font-size: 16px;
                      text-align: left; /* Keep text alignment to left for the content */
                  }
                  .footer {
                      font-size: 14px;
                      color: #888888;
                      margin-top: 20px;
                  }
              </style>
          </head>
          <body>
              <div class="email-container">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSll2--lZ6O0lFdUKyYylHcUK5_megC4hXEgQ&s" alt="Mobistack Logo" style="width: 100px; height: auto; margin-top: 20px;">
                  <h1 class="header">Mobistack Password Reset</h1>
                  <p>Hello,</p>
                  <p>You have initiated a request to reset your password. Please enter the token below to proceed:</p>
                  <div class="content-block">
                      <strong>Token:</strong> ${resetToken}
                  </div>
                  <p>Please note, this token is valid for 60 minutes. For your security, do not share this token with anyone.</p>
                  <p class="footer">Thank you.<br/>Mobistack Support Team</p>
              </div>
          </body>
          </html>
      `, // HTML body content
    };

    await this.transporter.sendMail(mailOptions);

    return {
      message:
        'Instructions to reset your password have been sent to your email address.',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findByResetToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    await user.save();

    return { message: 'Password has been successfully reset' };
  }
}
