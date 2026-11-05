import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  IsBoolean,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateWebhookSubscriptionDto {
  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "ID of the webhook endpoint to subscribe",
  })
  @IsUUID()
  webhookEndpointId: string;

  @ApiProperty({
    example: "payment.successful",
    description: "The event type this endpoint should receive",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  eventType: string;
}

export class UpdateWebhookSubscriptionDto {
  @ApiProperty({
    example: false,
    description: "Enable or disable this webhook subscription",
  })
  @IsBoolean()
  isActive: boolean;
}
