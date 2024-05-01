import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(63)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  password: string;
}
