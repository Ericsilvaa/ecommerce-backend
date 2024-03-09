import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  image: string

  @Column()
  price: string


  constructor(
    title: string,
    description: string,
    image: string,
    price: string,
  ) {
    this.title = title;
    this.description = description;
    this.image = image;
    this.price = price;
  }


}