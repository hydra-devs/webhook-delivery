import { Module } from "@nestjs/common";
import { ApiKeyController } from "./api-key.controller";
import { ApiKeyService } from "./api-key.service";
import { AuthModule } from "../auth/auth.module";
import { JwtAuthGuard } from "../auth/jwt-auth/jwt-auth.guard";
import { ApiKeyGuardTsGuard } from "./guard/api-key-guard.ts/api-key-guard.ts.guard";

@Module({
  controllers: [ApiKeyController],
  providers: [ApiKeyService, JwtAuthGuard, ApiKeyGuardTsGuard],
  imports: [AuthModule],
  exports: [ApiKeyGuardTsGuard],
})
export class ApiKeyModule {}
