import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  pw!: string;
}