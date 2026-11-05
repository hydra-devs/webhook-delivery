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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("WebhookSubscription")
@Controller("webhook-subscription")
@UseGuards(JwtAuthGuard)
export class WebhookSubscriptionController {
  constructor(private webhookSubscriptionService: WebhookSubscriptionService) {}

  @Post()
  @ApiOperation({
    summary: "Create a webhook subscription",
  })
  @ApiResponse({
    status: 201,
    description: "Webhook subscription created successfully.",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid subscription data.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized. A valid JWT is required.",
  })
  @ApiResponse({
    status: 404,
    description: "Webhook endpoint not found in the authenticated account.",
  })
  create(
    @Body() dto: CreateWebhookSubscriptionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.webhookSubscriptionService.create(dto, req.user!.accountId);
  }

  @Get()
  @ApiOperation({
    summary:
      "List webhook subscriptions belonging to the authenticated account",
  })
  @ApiResponse({
    status: 200,
    description: "Webhook subscriptions retrieved successfully.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized. A valid JWT is required.",
  })
  findAll(@Req() req: AuthenticatedRequest) {
    return this.webhookSubscriptionService.findAll(req.user!.accountId);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Retrieve a webhook subscription by ID",
  })
  @ApiResponse({
    status: 200,
    description: "Webhook subscription retrieved successfully.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized. A valid JWT is required.",
  })
  @ApiResponse({
    status: 404,
    description: "Subscription not found in the authenticated account.",
  })
  findOne(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.webhookSubscriptionService.findOne(req.user!.accountId, id);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Activate or deactivate a webhook subscription",
  })
  @ApiResponse({
    status: 200,
    description: "Webhook subscription updated successfully.",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid update data.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized. A valid JWT is required.",
  })
  @ApiResponse({
    status: 404,
    description: "Subscription not found in the authenticated account.",
  })
  update(
    @Body() dto: UpdateWebhookSubscriptionDto,
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
  ) {
    return this.webhookSubscriptionService.update(req.user!.accountId, id, dto);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete a webhook subscription",
  })
  @ApiResponse({
    status: 200,
    description: "Webhook subscription deleted successfully.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized. A valid JWT is required.",
  })
  @ApiResponse({
    status: 404,
    description: "Subscription not found in the authenticated account.",
  })
  remove(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.webhookSubscriptionService.delete(req.user!.accountId, id);
  }
}
