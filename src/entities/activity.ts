import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
import { Departments } from "./department";
import { Sectors } from "./sectors";
  
  @Entity( { name: "Activity" })
  export class Activity {
  
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Departments, dep => dep.Activity)
    @JoinColumn({name: "DepartmentId"})
    DepartmentId: Departments;

    @ManyToOne(() => Sectors, sec => sec.activity)
    @JoinColumn({name: "SectorId"})
    SectorId: Sectors

    @Column({ type: "nvarchar", length: 200 })
    ActivityName: string;

    @Column({ type: "nvarchar", default: null, length: 200 })
    TypeOfWork: string;

    @Column({ type: "nvarchar", default: null, length: 200 })
    TypeOfLand: string;

    @Column({ type: "nvarchar", default: null, length: 200 })
    TypeOfStatus: string;
  
    @Column({ type: "int" })
    ParentId: string;
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  