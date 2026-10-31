import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateWebhookEndpointDto,
  UpdateWebhookEndpointDto,
} from "./dto/webhook-endpoints.dto";

@Injectable()
export class WebhookEndpointsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateWebhookEndpointDto, accountId: string) {
    return this.prisma.webhookEndpoint.create({
      data: {
        url: dto.url,
        accountId: accountId,
        description: dto.description,
      },
    });
  }

  async findMany(accountId: string) {
    return this.prisma.webhookEndpoint.findMany({
      where: { accountId: accountId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(accountId: string, id: string) {
    const endpoint = await this.prisma.webhookEndpoint.findFirst({
      where: { accountId, id },
    });
    if (!endpoint) {
      throw new NotFoundException("Not Found");
    }
    return endpoint;
  }

  async update(accountId: string, id: string, dto: UpdateWebhookEndpointDto) {
    const result = await this.prisma.webhookEndpoint.updateMany({
      where: {
        accountId,
        id,
      },
      data: dto,
    });

    if (result.count === 0) {
      throw new NotFoundException("Webhook endpoints not found");
    }

    return await this.prisma.webhookEndpoint.findFirst({
      where: { accountId, id },
    });
  }

  async remove(accountId: string, id: string) {
    const result = await this.prisma.webhookEndpoint.deleteMany({
      where: {
        accountId,
        id,
      },
    });
    if (result.count === 0) {
      throw new NotFoundException("Webhook endpoint not found");
    }
    return {
      message: "Webhook endpoint deleted successfully",
    };
  }
}
