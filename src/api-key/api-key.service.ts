import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateApiKeyDto } from "./dto/api-key.dto";
import { createHash, randomBytes } from "crypto";
import { NotFoundException } from "@nestjs/common";

@Injectable()
export class ApiKeyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateApiKeyDto, accountId: string) {
    // Generate a Random ApiKey
    const rawKey = randomBytes(32).toString("hex");

    //Hash the ApiKey
    const keyHash = createHash("sha256").update(rawKey).digest("hex");

    //Generate a short prefix for identification
    const keyPrefix = rawKey.substring(0, 8);

    //Store the ApiKey Hash

    const apiKey = await this.prisma.apiKey.create({
      data: {
        name: dto.name,
        keyPrefix,
        keyHash,
        accountId,
      },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        createdAt: true,
      },
    });

    //return the original key Once
    return {
      ...apiKey,
      apikey: rawKey,
    };
  }

  async findAll(accountId: string) {
    return this.prisma.apiKey.findMany({
      where: {
        accountId,
      },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        createdAt: true,
        lastUsedAt: true,
        revokedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async revoke(accountId: string, id: string) {
    const result = await this.prisma.apiKey.updateMany({
      where: {
        id,
        accountId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    if (result.count === 0) {
      throw new NotFoundException("API key not found or already revoked");
    }

    return {
      message: "API key revoked successfully",
    };
  }
}
