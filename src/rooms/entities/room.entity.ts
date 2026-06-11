import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Package } from '../../packages/entities/package.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.roomId)
  @JoinColumn({ name: 'studentId' })
  users: User[];

  @OneToOne(() => User)
  @JoinColumn({ name: 'teacherId' })
  userId: User;

  @OneToMany(() => Package, (studentPackage) => studentPackage.roomId)
  @JoinColumn({ name: 'studentId' })
  packages: Package[];

  @CreateDateColumn()
  createdAt: Date;

  constructor(room: Partial<Room>) {
    Object.assign(this, room);
  }
}
