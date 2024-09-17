import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
@Entity({ name: "QuestionDropdownTypes"})
export class QuestionDropdownTypes {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "nvarchar", length: 200, default: null })
  DropdownName: string;

  @Column({ type: "nvarchar", length: 200, default: null })
  DropdownType: string;

  @CreateDateColumn()
  CreatedDate: Date;

  @UpdateDateColumn()
  UpdatedDate: Date;
};
