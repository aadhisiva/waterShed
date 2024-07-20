import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Schemes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable:true, type: "nvarchar", length: 500 })
  SchemeName: string;

  @Column({nullable:true,type: "nvarchar", length: 500 })
  SchemeCode: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
