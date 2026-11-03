import { Module } from "@nestjs/common";
import { WebhookSubscriptionService } from "./webhook-subscription.service";
import { WebhookSubscriptionController } from "./webhook-subscription.controller";
import { AuthModule } from "../auth/auth.module";
import { JwtAuthGuard } from "../auth/jwt-auth/jwt-auth.guard";

@Module({
  providers: [WebhookSubscriptionService, JwtAuthGuard],
  controllers: [WebhookSubscriptionController],
  imports: [AuthModule],
})
export class WebhookSubscriptionModule {}
