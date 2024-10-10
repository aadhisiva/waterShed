import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { Roles } from "./roles";
import { WaterShedData } from "./watershedData";
import { WaterShedDataHistory } from "./watershedDataHistory";

@Entity({ name: "UserData" })
export class UserData {

  @PrimaryGeneratedColumn("uuid")
  UserId: string;

  @Column({ type: "nvarchar", length: 50, default: null })
  DistrictCode: string;

  @Column({ type: "nvarchar", length: 50, default: null })
  TalukCode: string;

  @Column({ type: "nvarchar", length: 50, default: null })
  HobliCode: string;

  @Column({ type: "nvarchar", length: 50, default: null })
  VillageCode: string;

  @Column({ type: "nvarchar", length: 50, default: null })
  Name: string;

  @Column({ type: "nvarchar", length: 15, default: null })
  Mobile: string;

  @Column({ type: "nvarchar", length: 50, default: null })
  Otp: string;

  @ManyToOne(() => Roles, lr => lr.AssignedMasterFK)
  @JoinColumn({ name: "RoleId" })
  RoleId: Roles;

  @Column({ type: "nvarchar", length: 50, default: null })
  ListType: string;

  @Column({ type: "nvarchar", length: 50, default: null })
  Version: string;

  @Column({ type: "nvarchar", length: 20, default: null })
  CreatedMobile: string;

  @Column({ type: "nvarchar", length: 30, default: null })
  CreatedRole: string;

  @CreateDateColumn()
  CreatedDate: Date;

  @UpdateDateColumn()
  UpdatedDate: Date;

  @OneToMany(() => WaterShedData, user => user.UserId, {cascade: true, onDelete: 'CASCADE'})
  WaterShedDataFK: WaterShedData[]

  @OneToMany(() => WaterShedDataHistory, user => user.UserId, {cascade: true, onDelete: 'CASCADE'})
  WaterShedDataHistoryFK: WaterShedDataHistory[]

};
