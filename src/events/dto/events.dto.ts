import { IsNotEmpty, IsObject, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEventDto {
  @ApiProperty({
    example: "payment.successful",
    description: "The type of event being published",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  eventType: string;

  @ApiProperty({
    example: {
      paymentId: "pay_123",
      amount: 5000,
      currency: "USD",
    },
    description: "The event payload",
  })
  @IsObject()
  payload: Record<string, unknown>;
}
