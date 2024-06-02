/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './models/users.models';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Pole } from '../poles/models/poles.models';
import { Question } from '../questions/models/questions.models';
import * as Jimp from 'jimp';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Pole.name) private PoleModel: Model<Pole>,
    @InjectModel(Question.name) private QuestionModel: Model<Question>,
  ) {}
  async generateAvatar(initials: string): Promise<string> {
    const width = 100;
    const height = 100;
    const colorPairs = [
      ['#6a1b9a', '#f3e5f5'], // Améthyste foncé sur fond lilas clair
      ['#283593', '#ede7f6'], // Indigo foncé sur fond lavande clair
      ['#d32f2f', '#ffcdd2'], // Rouge fort sur fond rose clair
      ['#00796b', '#b2dfdb'], // Teal foncé sur fond menthe clair
      ['#f9a825', '#fffde7'], // Jaune moutarde sur fond jaune très clair
      ['#c2185b', '#fce4ec'], // Rose profond sur fond rose pâle
      ['#303f9f', '#c5cae9'], // Bleu roi sur fond bleu pastel
      ['#0288d1', '#b3e5fc'], // Bleu lumineux sur fond bleu ciel
      ['#7b1fa2', '#e1bee7'], // Violet foncé sur fond lavande
      ['#c62828', '#ffccbc'], // Rouge foncé sur fond abricot clair
      ['#2e7d32', '#a5d6a7'], // Vert sapin sur fond vert tendre
      ['#ad1457', '#f8bbd0'], // Magenta sur fond rose poudré
      ['#6a1b9a', '#e1bee7'], // Violet profond sur fond lavande pâle
      ['#1565c0', '#bbdefb'], // Bleu cobalt sur fond bleu pâle
      ['#00838f', '#b2ebf2'], // Cyan foncé sur fond cyan clair
    ];

    // Sélection aléatoire d'une paire de couleurs
    const [backgroundColor, textColor] =
      colorPairs[Math.floor(Math.random() * colorPairs.length)];
    const image = new Jimp(width, height, Jimp.cssColorToHex(backgroundColor));
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE); //32

    // Print white text to create a mask
    const textMask = new Jimp(width, height);
    textMask.print(
      font,
      0,
      0,
      {
        text: initials.toUpperCase(),
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      width,
      height,
    );

    // Créer une image de texte de couleur
    const textColorImage = new Jimp(
      width,
      height,
      Jimp.cssColorToHex(textColor),
    );
    textColorImage.mask(textMask, 0, 0); // Appliquer le masque de texte blanc

    // Superposer l'image de texte coloré sur l'image de fond
    image.composite(textColorImage, 0, 0, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacityDest: 1,
      opacitySource: 1,
    });

    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
    return `data:image/png;base64,${buffer.toString('base64')}`;
  }

  async add(body: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const initials = this.getInitials(body.fullname);
      const avatarUrl = await this.generateAvatar(initials);

      const newUser = new this.UserModel({
        ...body,
        password: hashedPassword,
        avatar: avatarUrl,
      });

      const createdUser = await newUser.save();
      await this.PoleModel.findOneAndUpdate(
        { name: body.pole },
        { $addToSet: { members: createdUser._id } },
        { new: true, upsert: true },
      );

      return createdUser;
    } catch (error) {
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        throw new BadRequestException('Email already used');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  getInitials(fullname: string): string {
    const parts = fullname.trim().split(/\s+/);
    const initials = parts.map((part) => part[0]).join('');
    return (
      initials.substring(0, 2).toUpperCase() ||
      initials.charAt(0).repeat(2).toUpperCase()
    );
  }
  findAll() {
    return this.UserModel.find();
  }
  /////////////////////////////////////////////////////////
  async findMostPosting(period: string): Promise<User[]> {
    const currentDate = new Date();

    let startDate: Date;
    if (period === 'week') {
      const day = currentDate.getDay();
      const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(currentDate.setDate(diff));
    } else if (period === 'month') {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
    } else if (period === 'year') {
      startDate = new Date(currentDate.getFullYear(), 0, 1);
    } else {
      throw new Error('Invalid period');
    }

    const mostPosting = await this.QuestionModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: currentDate },
        },
      },
      {
        $group: {
          _id: '$author',
          totalQuestions: { $sum: 1 },
        },
      },
      {
        $sort: { totalQuestions: -1 },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: '$user._id',
          fullname: '$user.fullname',
          email: '$user.email',
          role: '$user.role',
          avatar: '$user.avatar',
          totalQuestions: '$totalQuestions',
        },
      },
    ]);

    return mostPosting;
  }
  ////////////////////////////////////////////////////
  findOne(id: string) {
    //return this.UserModel.findOne({ _id: id });
    return this.UserModel.findById(id);
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.UserModel.findOne({ email }).select('+password').exec();
  }
  async findByResetToken(resetToken: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ resetToken }).exec();
  }
  delete(id: string) {
    return this.UserModel.findByIdAndDelete(id);
  }
  async update(id: string, body: UpdateUserDto) {
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    return this.UserModel.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true, runValidators: true },
    );
  }
  async updateAvatar(
    id: string,
    file?: Express.Multer.File,
    imageUrl?: string,
  ): Promise<User> {
    try {
      let avatarUrl: string;

      if (file) {
        //avatar à telecharger
        avatarUrl = `/path/to/saved/files/${file.filename}`;
      } else if (imageUrl) {
        //avatar a partir d'un lien
        avatarUrl = imageUrl;
      } else {
        throw new BadRequestException('No avatar provided');
      }

      // Update avatar URL dans la bd
      const updatedUser = await this.UserModel.findByIdAndUpdate(
        id,
        { avatar: avatarUrl },
        { new: true },
      );

      if (!updatedUser) {
        throw new InternalServerErrorException('User not found');
      }

      return updatedUser;
    } catch (error) {
      console.error('Error during avatar update: ', error);
      throw new InternalServerErrorException('Error updating avatar');
    }
  }

  search(key: string) {
    const keyword = key ? { name: { $regex: key, $options: 'i' } } : {};
    return this.UserModel.find(keyword);
  }
}
