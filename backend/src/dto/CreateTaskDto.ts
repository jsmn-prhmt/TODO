import { IsString, IsOptional, IsInt } from "class-validator";
import { Type } from "class-transformer";

export class CreateTaskDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  deadline?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  groupId?: number;
}