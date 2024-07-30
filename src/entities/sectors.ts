import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
  } from "typeorm";
import { Departments } from "./department";
import { Schemes } from "./schemes";
import { Activity } from "./activity";
  
  @Entity( { name: "Sectors" })
  export class Sectors {
  
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Departments, dep => dep.Sectors)
    @JoinColumn({name: "DepartmentId"})
    DepartmentId: Departments

    @ManyToOne(() => Schemes, sc => sc.sectors)
    @JoinColumn({name: "SchemeId"})
    SchemeId: Schemes

    @OneToMany(() => Activity, ac => ac.SectorId, {cascade: true, onDelete: 'CASCADE'})
    activity: Activity[];
  
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
  