import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryColumn({
    name: 'id',
  })
  id!: string;

  @Column({
    name: 'token',
  })
  token!: string;
}