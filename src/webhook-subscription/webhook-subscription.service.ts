import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateWebhookSubscriptionDto,
  UpdateWebhookSubscriptionDto,
} from "./dto/create-webhook-sub.dto";

@Injectable()
export class WebhookSubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWebhookSubscriptionDto, accountId: string) {
    const event = await this.prisma.webhookEndpoint.findFirst({
      where: {
        id: dto.webhookEndpointId,
        accountId,
      },
    });

    if (!event) {
      throw new NotFoundException("Webhook endpoint not found");
    }

    return this.prisma.webhookSubscription.create({
      data: {
        eventType: dto.eventType,
        webhookEndpointId: dto.webhookEndpointId,
      },
    });
  }

  async findAll(accountId: string) {
    return this.prisma.webhookSubscription.findMany({
      where: {
        webhookEndpoint: {
          accountId,
        },
      },
      include: {
        webhookEndpoint: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(accountId: string, id: string) {
    const subscription = await this.prisma.webhookSubscription.findFirst({
      where: {
        id,
        webhookEndpoint: {
          accountId,
        },
      },
      include: {
        webhookEndpoint: true,
      },
    });
    if (!subscription) {
      throw new NotFoundException("Subscription not found");
    }
    return subscription;
  }

  async update(
    accountId: string,
    id: string,
    dto: UpdateWebhookSubscriptionDto,
  ) {
    const result = await this.prisma.webhookSubscription.updateMany({
      where: {
        id,
        webhookEndpoint: {
          accountId,
        },
      },
      data: {
        isActive: dto.isActive,
      },
    });
    if (result.count === 0) {
      throw new NotFoundException("Subscription not found");
    }
    return this.findOne(accountId, id);
  }

  async delete(accountId: string, id: string) {
    const result = await this.prisma.webhookSubscription.deleteMany({
      where: {
        id,
        webhookEndpoint: {
          accountId,
        },
      },
    });
    if (result.count === 0) {
      throw new NotFoundException("Subscription not found");
    }
    return {
      message: "Subscription was successfully deleted",
    };
  }
}
