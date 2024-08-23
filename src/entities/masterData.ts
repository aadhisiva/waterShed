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

    @Column({ default: null,  type: 'nvarchar', length: 50 })
    KGISVillageCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 50 })
    KGISDistrictCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 50 })
    KGISTalukCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 50 })
    KGISHobiCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 50 })
    LGDVillageCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 50 })
    LGDDistrictCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 50 })
    LGDTalukCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 50 })
    LGDHobCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 50 })
    DistrictCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 100 })
    DistrictName: string;

    @Column({ default: null,  type: 'nvarchar', length: 100 })
    DistrictNameKA: string;

    @Column({ default: null,  type: 'nvarchar', length: 50 })
    TalukCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 100 })
    TalukName: string;

    @Column({ default: null,  type: 'nvarchar', length: 100 })
    TalukNameKA: string;

    @Column({ default: null,  type: 'nvarchar', length: 50 })
    HobliCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 100 })
    HobliName: string;

    @Column({ default: null,  type: 'nvarchar', length: 100 })
    HobliNameKA: string;
    
    @Column({ default: null,  type: 'nvarchar', length: 50 })
    VillageCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 100 })
    VillageName: string;

    @Column({ default: null,  type: 'nvarchar', length: 100 })
    VillageNameKA: string;
    
    @Column({ default: null,  type: 'nvarchar', length: 50 })
    CircleCode: string;

    @Column({ default: null,  type: 'nvarchar', length: 100 })
    CircleName: string;

    @Column({ default: null,  type: 'nvarchar', length: 100 })
    CircleNameKN: string;

    @Column({ default: null,  type: 'nvarchar', length: 50 })
    Type: string;
    
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  