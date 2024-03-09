import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  is_ambassador: boolean;

  constructor(
    first_name: string,
    password: string,
    email: string,
    last_name: string,
    is_ambassador: boolean
  ) {
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.password = password;
    this.is_ambassador = is_ambassador;
  }


  get name() {
    return `${this.first_name} ${this.last_name}`
  }



}
