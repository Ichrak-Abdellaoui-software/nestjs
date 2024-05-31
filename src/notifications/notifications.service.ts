import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './models/notifications.models';
import { NotificationType } from '../enums/notifications-type.enum';
import { User } from '../users/models/users.models';
import { CreateNotificationDto } from './dto/create-notification.dto';
@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private NotificationModel: Model<Notification>,
    @InjectModel(User.name)
    private UserModel: Model<User>,
  ) {}

  async createNotification(
    dto: CreateNotificationDto,
    userId: string,
  ): Promise<Notification> {
    const userObjectId = new Types.ObjectId(userId);
    const targetObjectId = new Types.ObjectId(dto.targetId);
    const creator = await this.fetchUserById(userObjectId);

    const message = this.formatNotificationMessage(
      creator.fullname,
      dto.type,
      targetObjectId,
    );
    const newNotificationData = {
      ...dto,
      title: message,
      creatorId: userObjectId,
      targetId: targetObjectId,
    };
    const newNotification = new this.NotificationModel(newNotificationData);
    return newNotification.save();
  }

  async fetchUserById(userId: Types.ObjectId): Promise<any> {
    return this.UserModel.findById(userId).exec();
  }

  // Générer le texte de la notification
  formatNotificationMessage(
    creatorName: string,
    type: NotificationType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    targetId: Types.ObjectId,
  ): string {
    let action = '';
    switch (type) {
      case NotificationType.LIKE:
        action = 'liked';
        break;
      case NotificationType.UNLIKE:
        action = 'unliked';
        break;
      case NotificationType.COMMENT:
        action = 'commented on';
        break;
      case NotificationType.ANSWER:
        action = 'answered';
        break;
      case NotificationType.APPROVE:
        action = 'approved';
        break;
      case NotificationType.DISAPPROVE:
        action = 'disapproved';
        break;
      default:
        action = 'interacted with';
    }
    return `User ${creatorName} has ${action} your solution.`;
  }

  async getUserNotif(userId: Types.ObjectId): Promise<Notification[]> {
    return this.NotificationModel.find({ userId })
      .populate(['creatorId', 'questionId', 'targetId'])
      .exec();
  }
}
