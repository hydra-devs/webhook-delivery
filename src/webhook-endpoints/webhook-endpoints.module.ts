import { Module } from "@nestjs/common";
import { WebhookEndpointsController } from "./webhook-endpoints.controller";
import { WebhookEndpointsService } from "./webhook-endpoints.service";
import { JwtAuthGuard } from "../auth/jwt-auth/jwt-auth.guard";
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [WebhookEndpointsController],
  providers: [WebhookEndpointsService, JwtAuthGuard],
  imports: [AuthModule],
})
export class WebhookEndpointsModule {}
