import { Entity, Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    nullable: false,
    select: true,
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;

  @UpdateDateColumn({
    nullable: false,
    select: true,
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  updated_at: Date;

  @DeleteDateColumn({ nullable: false, select: true, type: "timestamp" })
  deleted_at: Date;

  @Column({ type: "varchar", nullable: false, default: "" })
  name: string;

  @Column({ type: "float", nullable: false, default: 0.0 })
  price: number;

  @Column({ type: "float", nullable: false, default: 0.0 })
  stock: number;
}
