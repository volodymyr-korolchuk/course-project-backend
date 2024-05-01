import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RefreshDto {
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
  role: string;

  iat: string;
  exp: string;
}
