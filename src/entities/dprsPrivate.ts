import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity({ name: "DprsPrivateLand" })
export class DprsPrivateLand {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "nvarchar", length: 400, default: null })
  "MWS CODE": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "MWS Name": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Hobli": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "G.P Name": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Village": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Survey hissa": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Area (acre)": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Gunta": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Area (ha)": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Owner Name": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Gender (M/F)": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Caste (SC/ST/OBC/MIN/ GEN)": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Category (MF/SF/ MEF/LF)": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Farmer code": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Area Group (AG) Name": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Fruit ID": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Soil Phase": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Soil & Water Conservation (SWC)": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "SWC Farmer Requirement": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Size / Section (in mtr Sqr)": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Farmer Section Requirement   (in mtr Sqr)": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Actual RMT  (in mtr)": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Per Rmt cost (Rs.)": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "SWC Cost (Rs.)": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "No. of  Waste weir (WW)": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "WW Cost (Rs.)": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "SWC+ WW Cost (Rs.)": string;

  @CreateDateColumn()
  CreatedDate: Date;

  @UpdateDateColumn()
  UpdatedDate: Date;
};
