import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';

export enum PackageLocation {
  SECURITY = 'security_post',
  DORM = 'dormitory_office',
  TAKEN = 'taken',
}

@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.packages)
  @JoinColumn({ name: 'ownerId' })
  userId: User;

  @ManyToOne(() => Room, (room) => room.packages)
  @JoinColumn({ name: 'roomId' })
  roomId: Room;

  @Column()
  receivedDate: Date;

  @Column({
    type: 'enum',
    enum: PackageLocation,
    default: PackageLocation.SECURITY,
  })
  location: PackageLocation;

  @Column({ type: 'date', nullable: true })
  pickedUpDate: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  photoUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(studentPackage: Partial<Package>) {
    Object.assign(this, studentPackage);
  }
}
