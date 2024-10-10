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
import { Sectors } from "./sectors";
import { Activity } from "./activity";
  
  @Entity( { name: "Category" })
  export class Category {
  
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Departments, dep => dep.DepToCategoryFK)
    @JoinColumn({name: "DepartmentId"})
    DepartmentId: Departments;

    @ManyToOne(() => Sectors, sec => sec.SectorToCategoryFK)
    @JoinColumn({name: "SectorId"})
    SectorId: Sectors

    @Column({ type: "nvarchar", length: 200 })
    CategoryName: string;
  
    @Column({ type: "int" })
    ParentId: string;

    @CreateDateColumn()
    CreatedDate: Date;
  
    @UpdateDateColumn()
    UpdatedDate: Date;

    @OneToMany(() => Activity, ac => ac.SectorId, {cascade: true, onDelete: 'CASCADE'})
    CategoryToActivityFK: Activity[];
  };
  