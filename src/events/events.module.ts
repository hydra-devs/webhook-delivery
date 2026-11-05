import { Module } from "@nestjs/common";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import { JwtAuthGuard } from "../auth/jwt-auth/jwt-auth.guard";
import { AuthModule } from "../auth/auth.module";
import { ApiKeyModule } from "../api-key/api-key.module";

@Module({
  controllers: [EventsController],
  providers: [EventsService, JwtAuthGuard],
  imports: [AuthModule, ApiKeyModule],
})
export class EventsModule {}
