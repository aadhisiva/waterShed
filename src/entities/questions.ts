import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
  } from "typeorm";
import { QuestionMapping } from "./QuestionMapping";
  
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
  
    @Column({ type: "nvarchar", length: 10, default: null })
    IsMandatory: string;

    @OneToMany(() => QuestionMapping, qm => qm.ActivityId, {cascade: true, onDelete: 'CASCADE'})
    QuestionIdToQuestionMappingFK: QuestionMapping[];

    @CreateDateColumn()
    CreatedDate: Date;
  
    @UpdateDateColumn()
    UpdatedDate: Date;
  };
  