import { Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { PrismaService } from "../prisma/prisma.service";

@Controller("user")
export class UserController {
  constructor(
    private readonly showme: UserService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async getalluser() {
    return this.prisma.user.findMany();
  }

  @Post()
  createUser() {
    return "hello user";
  }
}
