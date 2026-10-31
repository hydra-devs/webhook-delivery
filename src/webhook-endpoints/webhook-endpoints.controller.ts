import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth/jwt-auth.guard";
import {
  CreateWebhookEndpointDto,
  UpdateWebhookEndpointDto,
} from "./dto/webhook-endpoints.dto";
import { WebhookEndpointsService } from "./webhook-endpoints.service";
import type { AuthenticatedRequest } from "../auth/interface/authenticated-request";

@Controller("webhook-endpoints")
@UseGuards(JwtAuthGuard)
export class WebhookEndpointsController {
  constructor(
    private readonly webhookEndpointsService: WebhookEndpointsService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateWebhookEndpointDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.webhookEndpointsService.create(dto, req.user!.accountId);
  }

  @Get()
  findMany(@Req() req: AuthenticatedRequest) {
    return this.webhookEndpointsService.findMany(req.user!.accountId);
  }

  @Get(":id")
  findOne(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.webhookEndpointsService.findOne(req.user!.accountId, id);
  }

  @Patch(":id")
  update(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body()
    dto: UpdateWebhookEndpointDto,
  ) {
    return this.webhookEndpointsService.update(req.user!.accountId, id, dto);
  }

  @Delete(":id")
  remove(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.webhookEndpointsService.remove(req.user!.accountId, id);
  }
}
