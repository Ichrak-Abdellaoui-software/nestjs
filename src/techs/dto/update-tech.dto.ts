import { PartialType } from '@nestjs/mapped-types';
import { TechDto } from './techs.dto';

export class UpdateTechDto extends PartialType(TechDto) {}
