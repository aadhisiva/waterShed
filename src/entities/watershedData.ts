import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { UserData } from "./userData";

@Entity({ name: "WaterShedData" })
export class WaterShedData {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "nvarchar", default: null })
  SchemeId: number;

  @Column({ type: "nvarchar", default: null })
  SectorId: number;

  @Column({ type: "nvarchar", default: null })
  ActivityId: number;

  @Column({ type: "nvarchar", default: null })
  SuActivityId: number;

  @Column({ type: "nvarchar", default: null })
  RoleId: number;

  @ManyToOne(() => UserData, dep => dep.wateshedData)
  @JoinColumn({ name: "UserId" })
  UserId: UserData

  @Column({ type: 'nvarchar', default: null, length: 200 })
  SubmissionId: string;

  @Column({ type: 'nvarchar', default: null, length: 200 })
  Scheme: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  Sector: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  District: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  Taluk: string;
  
  @Column({ type: 'nvarchar', default: null, length: 250 })
  ProjectNameSubWatershed: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  GramPanchayat: string;

  @Column({ type: 'nvarchar', default: null, length: 200 })
  Hobli: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  MicroWatershed: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  Village: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  SurveyNumber: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  TypeOfLand: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  ActivityType: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  Crops: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  FinancialYear: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  UnitHa: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  UnitNos: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  FruitsId: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  BeneficaryName: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  Gender: string;
  
  @Column({ type: 'nvarchar', default: null, length: 250 })
  Category: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  MobileNumber: string;
  
  @Column({ type: 'nvarchar', default: null, length: 300 })
  StatusOfWork: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  WorkStarted: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  WorkCompleted: string;
  
  @Column({ type: 'nvarchar', default: null, length: 250 })
  WorkOrderNumber: string;
  
  @Column({ type: 'nvarchar', default: null, length: 250 })
  SanctionNumber: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  EstimatedCost: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  Expenditure: string;
  
  @Column({ type: 'nvarchar', default: null, length: 300 })
  Latitude: string;
  
  @Column({ type: 'nvarchar', default: null, length: 300 })
  Longitude: string;
  
  @Column({ type: 'nvarchar', default: null, length: 1000 })
  FieldPhotoWithBeneficiary: string;
  
  @Column({ type: 'nvarchar', default: null, length: 200 })
  Seeds: string;


  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
};
