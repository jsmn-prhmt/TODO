import { IsString, Length } from "class-validator";

export class LoginUserDto {
  @IsString()
  username!: string;

  @IsString()
  @Length(6, 100)
  password!: string;
}