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
  
  @Entity( { name: "Sectors" })
  export class Sectors {
  
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Departments, dep => dep.Sectors)
    @JoinColumn({name: "DepartmentId"})
    DepartmentId: Departments
  
    @Column({ type: "nvarchar", length: 500 })
    Description: number;
  
    @Column({ type: "nvarchar", length: 200 })
    SectorName: number;
  
    @Column({ type: "nvarchar", length: 500 })
    SectorLogo: number;
  
    @Column({ type: "int" })
    ParentId: number;
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  