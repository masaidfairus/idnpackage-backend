/**
 * Entitas Employee (karyawan/pegawai).
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Package } from '../../packages/entities/package.entity';

/** Kelas Employee adalah entitas database. */
@Entity()
export class Employee {
  /** Properti id dengan tipe number. */
  @PrimaryGeneratedColumn()
  id!: number;

  /** Properti name dengan tipe string. */
  @Column()
  name!: string;

  /** Properti division dengan tipe string. */
  @Column()
  division!: string;

  /** Properti position dengan tipe string | undefined. */
  @Column({ nullable: true })
  position?: string;

  @OneToMany(() => Package, (employeePackage) => employeePackage.employeeId)
  packages?: Package[];

  /** Properti createdAt dengan tipe Date. */
  @CreateDateColumn()
  createdAt!: Date;

  /** Properti updatedAt dengan tipe Date. */
  @UpdateDateColumn()
  updatedAt!: Date;

  constructor(employee: Partial<Employee>) {
    Object.assign(this, employee);
  }
}
