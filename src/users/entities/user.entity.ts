import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';
import { Package } from '../../packages/entities/package.entity';

export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @ManyToOne(() => Room, (room) => room.users, { nullable: true })
  @JoinColumn({ name: 'roomId' })
  roomId: Room | null;

  @OneToMany(() => Package, (studentPackage) => studentPackage.userId)
  packages: Package[];

  @CreateDateColumn()
  createdAt: Date;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
