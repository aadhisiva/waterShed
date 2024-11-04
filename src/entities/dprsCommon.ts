import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity({ name: "DprsCommonLand" })
export class DprsCommonLand {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "nvarchar", length: 100, default: null })
  District: string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "MWS Code": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "MWS Name": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Village": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Survey No": string;

  @Column({ type: "nvarchar", length: 'max', default: null })
  "Identification / Ownership": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Activity type (SWC/HORTI FORT/DLT)": string;
  
  @Column({ type: "nvarchar", length: 400, default: null })
  "Unit Cost": string;
  
  @Column({ type: "nvarchar", length: 400, default: null })
  "Total Cost": string;
  
  @Column({ type: "nvarchar", length: 400, default: null })
  "Sub Activity": string;
  
  @Column({ type: "nvarchar", length: 400, default: null })
  "Dimention / Section": string;
  
  @Column({ type: "nvarchar", length: 400, default: null })
  "Location": string;

  @CreateDateColumn()
  CreatedDate: Date;

  @UpdateDateColumn()
  UpdatedDate: Date;
};
