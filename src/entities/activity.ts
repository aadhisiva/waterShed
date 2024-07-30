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
    ActivityName: number;
  
    @Column({ type: "int" })
    ParentId: number;
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  