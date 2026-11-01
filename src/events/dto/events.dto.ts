import { IsNotEmpty, IsObject, IsString, MaxLength } from "class-validator";

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  eventType: string;

  @IsObject()
  payload: Record<string, unknown>;
}
