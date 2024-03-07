import Product from "../entity/product.entity";
import BaseRespository from "./base/base.repository";


export default class ProductRepository extends BaseRespository<Product> {
  constructor() {
    super(Product)
  }
}