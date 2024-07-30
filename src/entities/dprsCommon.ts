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

  @Column({ type: "nvarchar", length: 400, default: null })
  "MWS Code": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "MWS Name": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Village": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Survey No.": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Identification / Ownership": string;

  @Column({ type: "nvarchar", length: 400, default: null })
  "Activity type (SWC/HORTI FORT/DLT)": string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
};
