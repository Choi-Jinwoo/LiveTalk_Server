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
}