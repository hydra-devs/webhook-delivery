import { Controller, Post, Body, UseGuards, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth/jwt-auth.guard";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({
    summary: "Register a new company account and its owner",
  })
  @ApiResponse({
    status: 201,
    description: "Company account and owner registered successfully.",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid registration data.",
  })
  @ApiResponse({
    status: 409,
    description: "Email or company slug already exists.",
  })
  register(@Body() input: RegisterDto) {
    return this.authService.register(input);
  }

  // @UseGuards(JwtAuthGuard)
  @Post("login")
  @ApiOperation({
    summary: "Authenticate a user and generate a JWT",
  })
  @ApiResponse({
    status: 200,
    description: "Login successful. JWT access token returned.",
  })
  @ApiResponse({
    status: 401,
    description: "Invalid email or password.",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid login data.",
  })
  login(@Body() input: LoginDto) {
    return this.authService.login(input);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("me")
  profile() {
    return "Profile";
  }
}
