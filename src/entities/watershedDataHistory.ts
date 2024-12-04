import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserData } from "./userData";
import { Roles } from "./roles";

@Entity({ name: "WaterShedDataHistory" })
export class WaterShedDataHistory {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserData, lr => lr.WaterShedDataHistoryFK)
  @JoinColumn({ name: "UserId" })
  UserId: string;

  @Column({ type: 'nvarchar', length: 200 })
  SubmissionId: string;

  @Column({ type: 'nvarchar', default: null, length: 200 })
  Scheme: string;

  @Column({ type: 'nvarchar', default: null, length: 200 })
  SchemeId: string;

  @Column({ type: 'nvarchar', default: null, length: 200 })
  SectorId: string;

  @Column({ type: 'nvarchar', default: null, length: 200 })
  CategoryId: string;

  @Column({ type: 'nvarchar', default: null, length: 200 })
  ActivityId: string;

  @Column({ type: 'nvarchar', default: null, length: 200 })
  SubActivityId: string;

  @Column({ type: 'nvarchar', default: null, length: 200 })
  Sector: string;

  @Column({ type: 'nvarchar', default: null, length: 200 })
  District: string;

  @Column({ type: 'nvarchar', default: null, length: 200 })
  Taluk: string;

  @Column({ type: 'nvarchar', default: null, length: 250 })
  SubWatershedName: string;

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

  @Column({ type: 'nvarchar', default: null, length: 200 })
  Seeds: string;

  @Column({ type: 'nvarchar', default: null, length: 15 })
  CreatedMobile: string;

  @Column({ type: 'nvarchar', default: null, length: 50 })
  CreatedRole: string;

  @Column({ type: 'nvarchar', default: null, length: 50 })
  CreatedName: string;

  @Column({ type: 'nvarchar', default: null, length: 15 })
  VerifiedMobile: string;

  @Column({ type: 'nvarchar', default: null, length: 50 })
  VerifiedRole: string;

  @Column({ type: 'nvarchar', default: null, length: 50 })
  VerifiedName: string;

  @Column({ type: 'nvarchar', default: null, length: 100 })
  SubWatershedCode: string;

  @Column({ type: 'nvarchar', default: null, length: 100 })
  MicroWatershedCode: string;

  @Column({ type: 'nvarchar', default: null, length: 200 })
  AmountutilizedfromtheProjectfundsInRs: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  BankLinkagetoavailLoan: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  Dateofconducted: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  DEWSworkID: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  GeneralCount: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  OBCCategoryCount: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  Otherscount: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  OthersGenderCount: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  SCCount: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  TSPCount: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  Unitin: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  FemaleCount: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  GPLFNRLMLinkage: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  Latitude: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  Longitude: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  Malecount: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  NameofSHG: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  Nameofusergroup: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  NoOfDisability: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  NoofSHGmembersAttended: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  NoofmembersinSHG: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  Noofpeopleattended: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  Usergroupmembers: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  Remarks: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  Section: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  ShareofBeneficiariesInRs: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  Topicintraining: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  UnitCost: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  UnitRmt: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  Waterstoragecapacity: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  WDF: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  Convergence: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  ApplicantDistrict: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  ApplicantTaluk: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  ApplicantHobli: string;

  @Column({ type: 'nvarchar', default: null, length: 400 })
  ApplicantVillage: string;

  @Column({ type: 'nvarchar', default: null, length: 500 })
  History: string;

  @Column({ type: 'nvarchar', default: null, length: 'max' })
  HistoryRemarks: string;

  @Column({ type: 'nvarchar', default: null, length: 255 })
  Convergence_Scheme: string;

  @Column({ type: 'nvarchar', default: null, length: 255 })
  Convergence_Amount: string;

  @Column({ type: 'nvarchar', default: null, length: 255 })
  Convergence_Person_Days: string;

  @Column({ type: 'nvarchar', default: null, length: 50 })
  ApplicationStatus: string;

  @Column({ type: 'nvarchar', default: null, length: 200 })
  ManualLocation: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  Polybagfilling: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  Nurseryseedling: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  NumberofPlants: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  CowsNo: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  BuffaloNo: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  PoultryNo: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  DuckeryNo: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  TypeofTrees: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  NoOfTrees: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  AmountInRs: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  TypeOfFodder: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  PhysicalNo: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  AnimalTreated: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  NumberOfGoats: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  AreaCoveredinHa: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  DPRUnitcost: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  DPRTotalCost: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  length: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  Width: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  Depth: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  TotalMeasurement: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  NameOfTheBeneficiaries: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  ProtectiveIrrigationLand: string;

  @Column({ type: 'nvarchar', default: null, length: 300 })
  NumberOfVents: string;
  
  @Column({ type: 'nvarchar', default: null, length: 300 })
  Comments: string;

  @ManyToOne(() => Roles, lr => lr.waterShedDataHistoryFK)
  @JoinColumn({ name: "CurrentLevelId" })
  RoleId: string;

  @Column({ type: 'int', default: null })
  VerifiedId: number;

  @CreateDateColumn()
  CreatedDate: Date;

  @UpdateDateColumn()
  UpdatedDate: Date;
};
