import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateApiKeyDto } from "./dto/api-key.dto";
import { createHash, randomBytes } from "crypto";

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
}
