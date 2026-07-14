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
} from 'typeorm';
import { Package } from '../../packages/entities/package.entity';
import { Role } from '../../auth/enum/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.TEACHER,
  })
  role: Role;

  @Column({ default: 0 })
  tokenVersion: number;

  @OneToMany(() => Package, (studentPackage) => studentPackage.createdBy)
  packages: Package[];

  @CreateDateColumn()
  createdAt: Date;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
