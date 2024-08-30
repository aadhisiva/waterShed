import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  
  @Entity( { name: "QuestionMapping" })
  export class QuestionMapping {
  
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int", default: null })
    ActivityId: string;
  
    @Column({ type: "int", default: null })
    QuestionId: string;
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  };
  