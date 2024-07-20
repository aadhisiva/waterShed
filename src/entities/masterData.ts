import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  @Entity()
  export class masterData {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ default: '',  type: 'nvarchar', length: 500})
    MicroWatershedCode: string;

    @Column({ default: '',  type: 'nvarchar', length: 500 })
    MicroWatershedName: string;

    @Column({ default: '',  type: 'nvarchar', length: 500 })
    SubWatershedCode: string;

    @Column({ default: '',  type: 'nvarchar', length: 500 })
    SubWatershedName: string;

    @Column({ default: '',  type: 'nvarchar', length: 500 })
    KGISVillageCode: string;

    @Column({ default: '',  type: 'nvarchar', length: 500 })
    KGISVillageName: string;

    @Column({ default: '',  type: 'nvarchar', length: 500 })
    DistrictCode: string;

    @Column({ default: '',  type: 'nvarchar', length: 500 })
    DistrictName: string;

    @Column({ default: '',  type: 'nvarchar', length: 500 })
    TalukCode: string;

    @Column({ default: '',  type: 'nvarchar', length: 500 })
    TalukName: string;

    @Column({ default: '',  type: 'nvarchar', length: 500 })
    HobliCode: string;

    @Column({ default: '',  type: 'nvarchar', length: 500 })
    HobliName: string;

    @Column({ default: '',  type: 'nvarchar', length: 500 })
    CENSUSVillageCode: string;

    @Column({ default: '',  type: 'nvarchar', length: 500 })
    CENSUSVillageName: string;
    
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  