import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(63)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(63)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(63)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  password: string;
}
