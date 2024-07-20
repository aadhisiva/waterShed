import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Schemes } from "./schemes";

@Entity()
export class Sectors {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable:true, type: "nvarchar", length: 500 })
  SectorName: string;

  @Column({ nullable:true, type: "nvarchar", length: 500 })
  SchemeCode: string;

  @Column({ nullable:true, type: "nvarchar", length: 500 })
  IsSubScheme: string;

  @Column({ nullable:true, type: "nvarchar", length: 500 })
  IsCategory: string;

  @Column({ nullable:true, type: "nvarchar", length: 500 })
  IsActivity: string;

  @Column({ nullable:true, type: "nvarchar", length: 500 })
  IsSubActivity: string;

  @Column({ nullable:true, type: "nvarchar", length: 500 })
  ActivityCode: string;

  @Column({ nullable:true, type: "nvarchar", length: 500 })
  SubSchemeCode: string;

  @Column({ nullable:true, type: "nvarchar", length: 500 })
  SubActivityCode: string;

  @Column({ nullable:true, type: "nvarchar", length: 500 })
  CategoryCode: string;

  @Column({ nullable:true, type: "nvarchar", length: 500 })
  UserId: string;

  @Column({ nullable:true, type: "nvarchar", length: 500 })
  UserRole: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
