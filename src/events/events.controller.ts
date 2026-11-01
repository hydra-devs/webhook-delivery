import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Param,
} from "@nestjs/common";
import { CreateEventDto } from "./dto/events.dto";
import { EventsService } from "./events.service";
import { JwtAuthGuard } from "../auth/jwt-auth/jwt-auth.guard";
import type { AuthenticatedRequest } from "../auth/interface/authenticated-request";

@Controller("events")
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Post()
  create(@Body() dto: CreateEventDto, @Req() req: AuthenticatedRequest) {
    return this.eventService.create(dto, req.user!.accountId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.eventService.findAll(req.user!.accountId);
  }

  @Get(":id")
  findOne(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.eventService.findOne(id, req.user!.accountId);
  }
}
