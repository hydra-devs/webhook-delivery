import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Delete,
  Param,
} from "@nestjs/common";
import { ApiKeyService } from "./api-key.service";
import { CreateApiKeyDto } from "./dto/api-key.dto";
import type { AuthenticatedRequest } from "../auth/interface/authenticated-request";
import { JwtAuthGuard } from "../auth/jwt-auth/jwt-auth.guard";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("Api Keys")
@Controller("api-key")
@UseGuards(JwtAuthGuard)
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  create(@Body() dto: CreateApiKeyDto, @Req() req: AuthenticatedRequest) {
    return this.apiKeyService.create(dto, req.user!.accountId);
  }
  @Get()
  @ApiOperation({
    summary: "List API keys belonging to the authenticated account",
  })
  @ApiResponse({
    status: 200,
    description: "API keys retrieved successfully.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized. A valid JWT is required.",
  })
  findAll(@Req() req: AuthenticatedRequest) {
    return this.apiKeyService.findAll(req.user!.accountId);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Revoke an API key",
  })
  @ApiResponse({
    status: 200,
    description: "API key revoked successfully.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized. A valid JWT is required.",
  })
  @ApiResponse({
    status: 404,
    description: "API key not found or already revoked.",
  })
  revoke(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.apiKeyService.revoke(req.user!.accountId, id);
  }
}
