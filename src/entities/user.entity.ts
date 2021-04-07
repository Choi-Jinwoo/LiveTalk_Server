import { DodamAccessLevels } from 'third-party/dodam.enum';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryColumn({
    name: 'id',
  })
  id!: string;

  @Column({
    name: 'dodam_token',
    select: false,
  })
  dodamToken!: string;

  @Column('int', {
    name: 'grade',
    nullable: true,
  })
  grade!: number | null;

  @Column('int', {
    name: 'room',
    nullable: true,
  })
  room!: number | null;

  @Column('int', {
    name: 'number',
    nullable: true,
  })
  number!: number | null;

  @Column('enum', {
    name: 'access_level',
    enum: DodamAccessLevels,
  })
  accessLevel!: DodamAccessLevels;

  @Column('varchar', {
    name: 'profile_image',
  })
  profileImage!: string | null;
}