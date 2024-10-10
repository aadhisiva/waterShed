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
import { Category } from "./category";
  
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
  
    @Column({ type: "nvarchar", length: 200, default: null })
    SectorName: number;
  
    @Column({ type: "nvarchar", length: 500 })
    SectorLogo: number;
  
    @Column({ type: "nvarchar", length: 5, default: null})
    IsCategory: string;
  
    @Column({ type: "int", default: null})
    SectorId: string;
  
    @Column({ type: "nvarchar", length: 20, default: null})
    RecordType: string;
  
    @Column({ type: "int" })
    ParentId: number;

    @CreateDateColumn()
    CreatedDate: Date;
  
    @UpdateDateColumn()
    UpdatedDate: Date;
    
    @OneToMany(() => Category, ac => ac.SectorId, {cascade: true, onDelete: 'CASCADE'})
    SectorToCategoryFK: Category[];
  };
  