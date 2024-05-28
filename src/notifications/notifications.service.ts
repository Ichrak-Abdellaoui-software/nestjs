import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './models/notifications.models';
import { NotificationType } from '../enums/notifications-type.enum';
import { User } from '../users/models/users.models';
@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private NotificationModel: Model<Notification>,
    @InjectModel(User.name)
    private UserModel: Model<User>,
  ) {}

  async createNotification(dto: any): Promise<Notification> {
    // Récupérer les informations du créateur avant de créer la notification
    const creator = await this.fetchUserById(dto.creatorId);
    const message = this.formatNotificationMessage(
      creator.fullname, // Utiliser le nom complet
      dto.type,
      dto.targetId,
    );
    dto.title = message; // Assigner le message formaté au titre de la notification
    const newNotification = new this.NotificationModel(dto);
    return newNotification.save();
  }

  // Méthode pour récupérer les détails d'un utilisateur
  async fetchUserById(userId: Types.ObjectId): Promise<any> {
    // Suppose que vous avez un modèle User accessible ici
    // Cette méthode doit être adaptée selon votre structure
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
