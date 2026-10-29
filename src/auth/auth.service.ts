import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import * as argon2 from "argon2";
import { AccountRole } from "../../generated/prisma/enums";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  private async hashPassword(password: string): Promise<string> {
    try {
      return await argon2.hash(password);
    } catch (error) {
      throw new InternalServerErrorException("Failed to process password");
    }
  }
  //Registration method
  async register(input: RegisterDto) {
    //Hash Password.
    const hashedPassword = await this.hashPassword(input.password);

    //Create the company and its Owner together.
    const account = await this.prisma.account.create({
      data: {
        name: input.companyName,
        slug: input.companySlug,

        user: {
          create: {
            name: input.userName,
            email: input.email,
            passwordHash: hashedPassword,
            role: AccountRole.OWNER,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });
    const accessToken = await this.jwtService.signAsync({
      sub: account.user[0].id,
      accountId: account.id,
      role: account.user[0].role,
    });

    return {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 900,
    };
  }

  async login(input: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });
    if (!user) {
      throw new UnauthorizedException("Email not found");
    }

    const passwordMatches = await argon2.verify(
      user.passwordHash,
      input.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      accountId: user.accountId,
      role: user.role,
    });

    return {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 900,
    };
  }
}
