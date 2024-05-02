import { PartialType } from '@nestjs/mapped-types';
import { PoleDto } from './poles.dto';
export class UpdatePoleDto extends PartialType(PoleDto) {}
