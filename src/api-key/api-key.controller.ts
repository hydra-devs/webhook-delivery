import { Controller, Post, Get, Req, UseGuards } from "@nestjs/common";
import { ApiKeyService } from "./api-key.service";
import { CreateApiKeyDto } from "./dto/api-key.dto";
import type { AuthenticatedRequest } from "../auth/interface/authenticated-request";
import { JwtAuthGuard } from "../auth/jwt-auth/jwt-auth.guard";

@Controller("api-key")
@UseGuards(JwtAuthGuard)
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  create(dto: CreateApiKeyDto, @Req() req: AuthenticatedRequest) {
    return this.apiKeyService.create(dto, req.user!.accountId);
  }
}
