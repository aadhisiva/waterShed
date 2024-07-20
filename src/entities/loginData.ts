import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  
  @Entity()
  export class loginData {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ default: '', type: 'nvarchar', length: 100 })
    UserId: string;

    @Column({ default: '', type: 'nvarchar', length: 100 })
    UserRole: string;

    @Column({ default: '', type: 'nvarchar', length: 100 })
    Name: string;

    @Column({ default: '', type: 'nvarchar', length: 100 })
    UserCode: string;

    @Column({ default: '', type: 'nvarchar', length: 100 })
    Mobile: string;

    @Column({ default: '', type: 'nvarchar', length: 100 })
    Otp: string;

    @Column({ default: '', type: 'nvarchar', length: 100 })
    WebOtp: string;

    @Column({ default: '', type: 'nvarchar', length: 100 })
    Token: string;

    @Column({ default: '', type: 'nvarchar', length: 100 })
    WebToken: string;

    @Column({ default: '', type: 'nvarchar', length: 100 })
    TokenExpirationTime: string;

    @Column({ default: '', type: 'nvarchar', length: 100 })
    WebTokenExpirationTime: string;

    @Column({ default: '', type: 'nvarchar', length: 100 })
    DistrictCode: string;

    @Column({ default: '', type: 'nvarchar', length: 100 })
    TalukCode: string;

    @Column({ default: '', type: 'nvarchar', length: 100 })
    HobliCode: string;

    @Column({ default: '', type: 'nvarchar', length: 100 })
    DistrictName: string;

    @Column({ default: '', type: 'nvarchar', length: 100 })
    TalukName: string;

    @Column({ default: '', type: 'nvarchar', length: 100 })
    HobliName: string;

    @Column({ default: '', type: 'nvarchar', length: 100 })
    Status: string;

    @Column({ default: '', type: 'nvarchar', length: 100 })
    Allotted: string;

    @Column({ default: '', type: 'text' })
    Version: string;

    @Column({ default: '', type: 'text' })
    Assignment: string;

    @Column({ default: '', type: 'text' })
    WebVersion: string;
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  