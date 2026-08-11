/**
 * Entitas Employee (karyawan/pegawai).
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  constructor(employee: Partial<Employee>) {
    Object.assign(this, employee);
  }
}
