import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  IsBoolean,
} from "class-validator";

export class CreateWebhookSubscriptionDto {
  @IsUUID()
  webhookEndpointId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  eventType: string;
}

export class UpdateWebhookSubscriptionDto {
  @IsBoolean()
  isActive: boolean;
}
