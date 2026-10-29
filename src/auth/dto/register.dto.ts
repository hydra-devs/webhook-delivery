import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  companyName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  companySlug: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  userName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}
