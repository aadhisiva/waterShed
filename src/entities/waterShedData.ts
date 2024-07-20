import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn
  } from "typeorm";
  
  
  @Entity({name: "WaterShedData"})
  export class WaterShedData {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable:true })
    UserId: string;
  
    @Column({ nullable:true, type: 'nvarchar', length: 500 })
    UserRole: string;

    @Column({ nullable:true, type: 'nvarchar', length: 500 })
    Latitude: string;

    @Column({ nullable:true, type: 'nvarchar', length: 500 })
    Longitude: string;

    @Column({ nullable:true, type: 'nvarchar', length: 500 })
    CoOrdinatesType: string;

    @Column({ default: '', type: 'text' })
    FieldPhoto: string;

    @Column({ nullable:true, type: 'nvarchar', length: 500 })
    CapturedPhotoType: string;

    @CreateDateColumn()
    CreatedDate: Date;

    @Column({ nullable:true, type: 'nvarchar', length: 500  })
    CreatedBy: String;

    @Column({ nullable:true, type: 'nvarchar', length: 500 })
    UpdatedBy: String;

    @Column({ nullable:true })
    Status: String;

    @CreateDateColumn()
    UpdatedDate: Date;
  };
  