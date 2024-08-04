import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  
  @Entity({ name: "Questions"})
  export class Questions {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: "nvarchar", length: 200, default: null })
    QuestionId: string;
  
    @Column({ type: "nvarchar", length: 200, default: null })
    Question: string;
  
    @Column({ type: "nvarchar", length: 200, default: null })
    QuestionType: string;
  
    @Column({ type: "nvarchar", length: 200, default: null })
    DropDownValues: string;
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  