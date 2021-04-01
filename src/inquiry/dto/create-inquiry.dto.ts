import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateInquiryDto {
  @IsNotEmpty()
  content!: string;

  @IsUUID()
  lectureId!: string;

  @IsBoolean()
  isAnonymity!: boolean;
}