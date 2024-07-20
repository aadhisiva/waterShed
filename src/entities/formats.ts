import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  
  @Entity()
  export class formats {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable:true, type: 'nvarchar', length: 500 })
    QuestionId: string;

    @Column({ nullable:true, type: 'nvarchar', length: 500 })
    QuestionType: string;

    @Column({ nullable:true, type: 'text' })
    QuestionValues: string;

    @Column({ nullable:true,  type: 'nvarchar', length: 500 })
    Question: string;

    @Column({ nullable:true,  type: 'nvarchar', length: 500 })
    formateType: string;

    @Column({ nullable:true,  type: 'nvarchar', length: 500 })
    IsApiRequired: string;

    @Column({ nullable:true,  type: 'nvarchar', length: 500 })
    SectorName: string;
    
    @Column({ nullable:true,  type: 'nvarchar', length: 500 })
    TypeOfPerson: string;

    @Column({ nullable:true,  type: 'nvarchar', length: 500 })
    ActivityName: string;

    @Column({ nullable:true,  type: 'nvarchar', length: 500 })
    SubActivityName: string;
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  