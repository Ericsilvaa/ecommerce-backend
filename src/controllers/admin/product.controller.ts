import { Repository } from "typeorm";
import { AppDataSource } from "../../db/datasource";
import { Request, Response } from "express";
import Product from "../../entity/product.entity";
import ProductRepository from "../../repositories/product.repository";


export default class ProductController {
  private repository: ProductRepository
  constructor(repository: ProductRepository) {
    this.repository = repository;
  }

  async getAllProducts(req: Request, res: Response) {

    const ambassadors = await this.repository.getAllRegister()

    res.send(ambassadors)

  }

  async createProduct(req: Request, res: Response) {
    const product = this.repository.createRegister(req.body)

    res.status(201).send(product)
  }

  async getProduct(req: Request, res: Response) {
    const { product_id } = req.params
    const product = await this.repository.getOneRegister({ id: +product_id })

    res.send(product)
  }

  async updateProduct(req: Request, res: Response) {
    const product_id = <Partial<Product>>Number(req.params.product_id)

    const existProduct = await this.repository.getOneRegister({ id: +product_id })

    if (!existProduct) return res.status(400).send({ message: `Book not registered` });

    const newProduct = {
      ...existProduct,
      ...req.body
    }

    const { affected } = await this.repository.updateRegister(product_id, req.body)

    if (!affected) return res.status(400).send({ message: `Book doesn't updated` });

    res.status(202).send(newProduct)
  }

  async deleteProduct(req: Request, res: Response) {
    const { product_id } = req.params

    await this.repository.delete(+product_id)

    res.status(204).send(null)
  }
}