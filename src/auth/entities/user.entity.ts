/**
 * Entity User (system user).
 *
 * Relasi:
 * - packages: satu user dapat membuat banyak package (sebagai operator/createdBy)
 *
 * Catatan:
 * - tokenVersion digunakan untuk logout invalidation (setiap login JWT baru
 *   membekukan tokenVersion saat itu; increment = semua JWT lama invalid).
 * - Role default: TEACHER.
 */
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Package } from '../../packages/entities/package.entity';
import { Room } from '../../rooms/entities/room.entity';
import { Role } from '../../auth/enum/role.enum';

/** Kelas User adalah entitas database. */
@Entity()
export class User {
  /** Properti id dengan tipe number. */
    @PrimaryGeneratedColumn()
  id!: number;

  /** Properti name dengan tipe string. */
    @Column()
  name: string;

  /** Properti email dengan tipe string. */
    @Column({ unique: true })
  email: string;

  /** Properti password dengan tipe string. */
    @Column()
  password: string;

  /** Properti role dengan tipe import("E:/Main/Code/idnpackage-backend/src/auth/enum/role.enum").Role. */
    @Column({
    type: 'enum',
    enum: Role,
    default: Role.TEACHER,
  })
  role: Role;

  /** Properti tokenVersion dengan tipe number. */
    @Column({ default: 0 })
  tokenVersion: number;

  /** Properti packages dengan tipe import("E:/Main/Code/idnpackage-backend/src/packages/entities/package.entity").Package[]. */
    @OneToMany(() => Package, (studentPackage) => studentPackage.createdBy)
  packages: Package[];

  /** Properti room dengan tipe import("E:/Main/Code/idnpackage-backend/src/rooms/entities/room.entity").Room | null. */
    @ManyToOne(() => Room, { nullable: true })
  @JoinColumn({ name: 'roomId' })
  room: Room | null;

  /** Properti roomId dengan tipe number | null. */
    @Column({ nullable: true })
  roomId: number | null;

  /** Properti createdAt dengan tipe Date. */
    @CreateDateColumn()
  createdAt: Date;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
