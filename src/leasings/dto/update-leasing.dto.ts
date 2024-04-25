import { PartialType } from '@nestjs/mapped-types';
import { CreateLeasingDto } from './create-leasing.dto';

export class UpdateLeasingDto extends PartialType(CreateLeasingDto) {}
