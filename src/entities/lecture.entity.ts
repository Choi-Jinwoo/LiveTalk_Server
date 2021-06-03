import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('lecture')
export class Lecture {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id!: string;

  @Column({
    name: 'title',
  })
  title!: string;

  @Column('varchar', {
    name: 'join_code',
    unique: true,
    nullable: true,
    select: false,
  })
  joinCode!: string | null;

  @Column({
    name: 'is_closed',
  })
  isClosed: boolean = false;

  @Column('varchar', {
    name: 'admin_code',
    unique: true,
    nullable: true,
    select: false,
  })
  adminCode!: string | null;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;
}