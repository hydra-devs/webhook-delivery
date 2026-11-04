import { Module } from "@nestjs/common";
import { ApiKeyController } from "./api-key.controller";
import { ApiKeyService } from "./api-key.service";
import { AuthModule } from "../auth/auth.module";
import { JwtAuthGuard } from "../auth/jwt-auth/jwt-auth.guard";

@Module({
  controllers: [ApiKeyController],
  providers: [ApiKeyService, JwtAuthGuard],
  imports: [AuthModule],
})
export class ApiKeyModule {}
