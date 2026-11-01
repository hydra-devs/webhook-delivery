import { Module } from "@nestjs/common";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import { JwtAuthGuard } from "../auth/jwt-auth/jwt-auth.guard";
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [EventsController],
  providers: [EventsService, JwtAuthGuard],
  imports: [AuthModule],
})
export class EventsModule {}
