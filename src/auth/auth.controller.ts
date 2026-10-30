import { Controller, Post, Body, UseGuards, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() input: RegisterDto) {
    return this.authService.register(input);
  }

  // @UseGuards(JwtAuthGuard)
  @Post("login")
  login(@Body() input: LoginDto) {
    return this.authService.login(input);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  profile() {
    return "profile";
  }
}
