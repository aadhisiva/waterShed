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
export class SubActivity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '', type: "nvarchar", length: 1000 })
  SubActivityName: string;

  @Column({ default: '', type: "nvarchar", length: 500 })
  CategoryCode: string;

  @Column({ default: '', type: "nvarchar", length: 500 })
  SectorCode: string;

  @Column({ default: '', type: "nvarchar", length: 500 })
  SubSchemeCode: string;

  @Column({ default: "", type: "nvarchar", length: 500 })
  ActivityCode: string;

  @Column({ default: "", type: "nvarchar", length: 500 })
  SubActivityCode: string;

  @Column({ default: "", type: "nvarchar", length: 500  })
  FormateType: string;

  @Column({ default: "", type: "nvarchar", length: 500 })
  TypeOfPerson: string;

  @Column({ default: "", type: 'text' })
  TypeOfWork: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
};