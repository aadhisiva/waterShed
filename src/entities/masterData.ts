import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  @Entity({name: "MasterData"})
  export class MasterData {
  
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: null,  type: 'nvarchar', length: 70 })
    VillageName: string;

    @Column({ default: null,  type: 'nvarchar', length: 70 })
    KGISMicroWatershedID: string;

    @Column({ default: null,  type: 'nvarchar', length: 70 })
    VillageCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 70 })
    DistrictCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 70 })
    TalukCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 70 })
    HobliCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 100 })
    DistrictName: string;
    
    @Column({ default: null,  type: 'nvarchar', length: 100 })
    TalukName: string;

    @Column({ default: null,  type: 'nvarchar', length: 100 })
    HobliName: string;

    @Column({ default: null,  type: 'nvarchar', length: 100 })
    MicroWatershedCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 100 })
    MicroWatershedName: string;

    @Column({ default: null,  type: 'nvarchar', length: 100 })
    SubWatershedCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 100 })
    SubWatershedName: string;

    @CreateDateColumn()
    CreatedDate: Date;
  
    @UpdateDateColumn()
    UpdatedDate: Date;
  };
  