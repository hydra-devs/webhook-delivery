import { IsEmail, IsString, IsNotEmpty, MaxLength } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "Must be a valid email address" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  @MaxLength(128, {
    message: "Password must not exceed 128 characters",
  })
  password: string;
}
