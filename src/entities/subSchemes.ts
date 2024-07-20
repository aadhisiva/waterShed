import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Sectors } from "./sectors";


@Entity()
export class SubSchemes {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable:true,  type: "nvarchar", length: 500 })
  SubSchemeName: string;

  @Column({ nullable:true,  type: "nvarchar", length: 500 })
  CategoryCode: string;

  @Column({ nullable:true,  type: "nvarchar", length: 500 })
  SectorCode: string;

  @Column({ nullable:true,  type: "nvarchar", length: 500 })
  IsCategory: string;

  @Column({ nullable:true,  type: "nvarchar", length: 500 })
  IsActivity: string;

  @Column({ nullable:true,  type: "nvarchar", length: 500 })
  IsSubActivity: string;

  @Column({ nullable:true,  type: "nvarchar", length: 500 })
  ActivityCode: string;

  @Column({ nullable:true,  type: "nvarchar", length: 500 })
  SubSchemeCode: string;

  @Column({ nullable:true,  type: "nvarchar", length: 500 })
  SubActivityCode: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
};
