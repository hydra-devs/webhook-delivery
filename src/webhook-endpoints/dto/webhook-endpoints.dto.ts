import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateWebhookEndpointDto {
  @ApiProperty({
    example: "https://company-b.com/webhooks",
    description: "The URL that will receive webhook events",
  })
  @IsString()
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  url: string;

  @ApiPropertyOptional({
    example: "Production payment webhook",
    description: "A description of this webhook endpoint",
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description?: string;
}

export class UpdateWebhookEndpointDto {
  @ApiPropertyOptional({
    example: "https://company-b.com/webhooks",
    description: "Updated webhook endpoint URL",
  })
  @IsOptional()
  @IsString()
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  url?: string;

  @ApiPropertyOptional({
    example: "Updated production webhook",
    description: "Updated endpoint description",
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
