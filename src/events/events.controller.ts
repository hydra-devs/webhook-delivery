import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { CreateEventDto } from "./dto/events.dto";
import { EventsService } from "./events.service";
import { JwtAuthGuard } from "../auth/jwt-auth/jwt-auth.guard";
import type { AuthenticatedRequest } from "../auth/interface/authenticated-request";
import { ApiKeyGuardTsGuard } from "../api-key/guard/api-key-guard.ts/api-key-guard.ts.guard";
import { BadRequestException } from "@nestjs/common";
import type { ApiKeyAuthenticatedRequest } from "../api-key/interface/api-key-auth-request.interface";

@Controller("events")
export class EventsController {
  //Validate filtering value (page & limit)
  private validatePagination(page?: string, limit?: string) {
    const parsedPage = Number(page ?? 1);
    const parsedLimit = Number(limit ?? 10);

    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      throw new BadRequestException("Page must be a positive integer");
    }

    if (
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1 ||
      parsedLimit > 100
    ) {
      throw new BadRequestException("Limit must be between 1 and 100");
    }

    return {
      page: parsedPage,
      limit: parsedLimit,
    };
  }
  constructor(private readonly eventService: EventsService) {}

  //Event Publishing Endpoint
  @Post()
  @UseGuards(ApiKeyGuardTsGuard)
  create(@Body() dto: CreateEventDto, @Req() req: ApiKeyAuthenticatedRequest) {
    return this.eventService.create(dto, req.accountId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query("eventType") eventType?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    //Avoid running method twice (this.val......)

    const pagination = this.validatePagination(page, limit);
    return this.eventService.findAll(
      req.user!.accountId,
      eventType,
      pagination.page,
      pagination.limit,
    );
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.eventService.findOne(id, req.user!.accountId);
  }
}
