import {
  Controller,
  UseGuards,
  Body,
  Req,
  Post,
  Get,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth/jwt-auth.guard";
import { WebhookSubscriptionService } from "./webhook-subscription.service";
import {
  CreateWebhookSubscriptionDto,
  UpdateWebhookSubscriptionDto,
} from "./dto/create-webhook-sub.dto";
import type { AuthenticatedRequest } from "../auth/interface/authenticated-request";

@Controller("webhook-subscription")
@UseGuards(JwtAuthGuard)
export class WebhookSubscriptionController {
  constructor(private webhookSubscriptionService: WebhookSubscriptionService) {}

  @Post()
  create(
    @Body() dto: CreateWebhookSubscriptionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.webhookSubscriptionService.create(dto, req.user!.accountId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.webhookSubscriptionService.findAll(req.user!.accountId);
  }

  @Get(":id")
  findOne(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.webhookSubscriptionService.findOne(req.user!.accountId, id);
  }

  @Patch(":id")
  update(
    @Body() dto: UpdateWebhookSubscriptionDto,
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
  ) {
    return this.webhookSubscriptionService.update(req.user!.accountId, id, dto);
  }

  @Delete(":id")
  remove(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.webhookSubscriptionService.delete(req.user!.accountId, id);
  }
}
