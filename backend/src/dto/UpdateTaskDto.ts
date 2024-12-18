import { IsOptional, IsString, IsBoolean, IsInt } from "class-validator";
import { Type } from "class-transformer";

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  deadline?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  groupId?: number;
}
