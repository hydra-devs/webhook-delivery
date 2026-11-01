import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateEventDto } from "./dto/events.dto";
import { Prisma } from "../../generated/prisma/client";

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEventDto, accountId: string) {
    return await this.prisma.event.create({
      data: {
        eventType: dto.eventType,
        payload: dto.payload as Prisma.InputJsonValue,
        accountId: accountId,
      },
    });
  }

  async findAll(accountId: string) {
    return await this.prisma.event.findMany({
      where: {
        accountId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: string, accountId: string) {
    const events = await this.prisma.event.findFirst({
      where: {
        accountId,
        id,
      },
    });

    if (!events) {
      throw new NotFoundException("No events found.");
    }

    return events;
  }
}
