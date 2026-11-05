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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("WebhookEndpoints")
@Controller("webhook-endpoints")
@UseGuards(JwtAuthGuard)
export class WebhookEndpointsController {
  constructor(
    private readonly webhookEndpointsService: WebhookEndpointsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: "Create a webhook endpoint",
  })
  @ApiResponse({
    status: 201,
    description: "Webhook endpoint created successfully.",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid endpoint URL or request body.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized. A valid JWT is required.",
  })
  create(
    @Body() dto: CreateWebhookEndpointDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.webhookEndpointsService.create(dto, req.user!.accountId);
  }

  @Get()
  @ApiOperation({
    summary: "List webhook endpoints belonging to the authenticated account",
  })
  @ApiResponse({
    status: 200,
    description: "Webhook endpoints retrieved successfully.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized. A valid JWT is required.",
  })
  findMany(@Req() req: AuthenticatedRequest) {
    return this.webhookEndpointsService.findMany(req.user!.accountId);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Retrieve a webhook endpoint by ID",
  })
  @ApiResponse({
    status: 200,
    description: "Webhook endpoint retrieved successfully.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized. A valid JWT is required.",
  })
  @ApiResponse({
    status: 404,
    description: "Webhook endpoint not found in the authenticated account.",
  })
  findOne(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.webhookEndpointsService.findOne(req.user!.accountId, id);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update a webhook endpoint",
  })
  @ApiResponse({
    status: 200,
    description: "Webhook endpoint updated successfully.",
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
    description: "Webhook endpoint not found in the authenticated account.",
  })
  update(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body()
    dto: UpdateWebhookEndpointDto,
  ) {
    return this.webhookEndpointsService.update(req.user!.accountId, id, dto);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete a webhook endpoint",
  })
  @ApiResponse({
    status: 200,
    description: "Webhook endpoint deleted successfully.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized. A valid JWT is required.",
  })
  @ApiResponse({
    status: 404,
    description: "Webhook endpoint not found in the authenticated account.",
  })
  remove(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.webhookEndpointsService.remove(req.user!.accountId, id);
  }
}
