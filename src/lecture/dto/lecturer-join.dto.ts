import { IsNotEmpty } from 'class-validator';

export class LecturerJoinDto {
  @IsNotEmpty()
  adminCode!: string;
}