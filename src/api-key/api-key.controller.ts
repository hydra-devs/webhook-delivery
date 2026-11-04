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

@Controller("api-key")
@UseGuards(JwtAuthGuard)
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  create(@Body() dto: CreateApiKeyDto, @Req() req: AuthenticatedRequest) {
    return this.apiKeyService.create(dto, req.user!.accountId);
  }
  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.apiKeyService.findAll(req.user!.accountId);
  }

  @Delete(":id")
  revoke(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.apiKeyService.revoke(req.user!.accountId, id);
  }
}
