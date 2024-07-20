import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Activity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable:true,  type: 'nvarchar', length: 500 })
  ActivityName: string;

  @Column({ nullable:true,  type: 'nvarchar', length: 500 })
  CategoryCode: string;

  @Column({ nullable:true,  type: 'nvarchar', length: 500 })
  SectorCode: string;

  @Column({ nullable:true,  type: 'nvarchar', length: 500 })
  SubSchemeCode: string;

  @Column({ nullable:true,  type: 'nvarchar', length: 500 })
  IsSubActivity: string;

  @Column({ nullable:true,  type: 'nvarchar', length: 500 })
  ActivityCode: string;

  @Column({ nullable:true,  type: 'nvarchar', length: 500 })
  SubActivityCode: string;

  @Column({ nullable:true,  type: 'nvarchar', length: 500 })
  FormateType: string;

  @Column({ nullable:true, type: 'text' })
  TypeOfPerson: string;

  @Column({ nullable:true, type: 'text' })
  TypeOfWork: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
};
