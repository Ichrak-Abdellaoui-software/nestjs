import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Types } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from 'src/decorators/user.decorator';
//import { Notification } from './models/notifications.models';

@Controller('notif')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}
  @Post()
  async createNotification(
    @Body() dto: CreateNotificationDto,
    @User() user: any,
  ): Promise<any> {
    try {
      const userId = user._id;
      const newNotification = await this.service.createNotification(
        dto,
        userId,
      );
      return { success: true, notification: newNotification };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  @Get('/:userId')
  async getNotifications(@Param('userId') userId: string) {
    return this.service.getUserNotif(new Types.ObjectId(userId));
  }
}
