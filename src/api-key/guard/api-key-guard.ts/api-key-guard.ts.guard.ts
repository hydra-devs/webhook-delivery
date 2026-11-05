import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { createHash, timingSafeEqual } from "crypto";
import { PrismaService } from "../../../prisma/prisma.service";
import { ApiKeyAuthenticatedRequest } from "../../interface/api-key-auth-request.interface";

@Injectable()
export class ApiKeyGuardTsGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<ApiKeyAuthenticatedRequest>();

    const apiKey = request.headers["x-api-key"];

    if (typeof apiKey !== "string" || !apiKey) {
      throw new UnauthorizedException("API key is required");
    }

    const keyHash = createHash("sha256").update(apiKey).digest("hex");
    const storedKey = await this.prisma.apiKey.findUnique({
      where: {
        keyHash,
      },
    });
    if (!storedKey || storedKey.revokedAt) {
      throw new UnauthorizedException("Invalid or revoked API key");
    }
    const suppliedHash = Buffer.from(keyHash, "hex");
    const databaseHash = Buffer.from(storedKey.keyHash, "hex");
    if (
      suppliedHash.length !== databaseHash.length ||
      !timingSafeEqual(suppliedHash, databaseHash)
    ) {
      throw new UnauthorizedException("Invalid API key");
    }
    request.accountId = storedKey.accountId;

    await this.prisma.apiKey.update({
      where: { id: storedKey.id },
      data: { lastUsedAt: new Date() },
    });
    return true;
  }
}
