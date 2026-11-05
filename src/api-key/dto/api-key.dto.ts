import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateApiKeyDto {
  @ApiProperty({
    example: "Payment Service",
    description: "A descriptive name for identifying this API key",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
