import { Repository } from "typeorm";
import { AppDataSource } from "../../config/db/datasource";
import { Request, Response } from "express";
import Product from "../../entity/product.entity";
import ProductRepository from "../../repositories/product.repository";
import { client } from "../..";

export default class ProductController {
  private repository: ProductRepository;
  constructor(repository: ProductRepository) {
    this.repository = repository;
  }

  async getAllProducts(req: Request, res: Response) {
    const ambassadors = await this.repository.getAllRegister();

    res.send(ambassadors);
  }

  async createProduct(req: Request, res: Response) {
    const product = this.repository.createRegister(req.body);

    res.status(201).send(product);
  }

  async getProduct(req: Request, res: Response) {
    const { product_id } = req.params;
    const product = await this.repository.getOneRegister({ id: +product_id });

    res.send(product);
  }

  async updateProduct(req: Request, res: Response) {
    const product_id = <Partial<Product>>Number(req.params.product_id);

    const existProduct = await this.repository.getOneRegister({
      id: +product_id,
    });

    if (!existProduct)
      return res.status(400).send({ message: `Book not registered` });

    const newProduct = {
      ...existProduct,
      ...req.body,
    };

    const { affected } = await this.repository.updateRegister(
      product_id,
      req.body
    );

    if (!affected)
      return res.status(400).send({ message: `Book doesn't updated` });

    res.status(202).send(newProduct);
  }

  async deleteProduct(req: Request, res: Response) {
    const { product_id } = req.params;

    await this.repository.delete(+product_id);

    res.status(204).send(null);
  }

  async ProductsFrontend(req: Request, res: Response) {
    let products: Product[] = JSON.parse(
      (await client.get("products_frontend")) as string
    );

    if (!products) {
      products = await this.repository.getAllRegister();

      await client.set("products_frontend", JSON.stringify(products), {
        EX: 200,
      });
    }
    return res.send(products);
  }

  async Productsbackend(req: Request, res: Response) {
    let products: Product[] = JSON.parse(
      (await client.get("products_frontend")) as string
    );

    if (!products) {
      products = await this.repository.getAllRegister();

      await client.set("products_frontend", JSON.stringify(products), {
        EX: 200,
      });
    }

    if (req.query.s) {
      const s = req.query.s.toString().toLocaleLowerCase();

      products = products.filter(
        (product) =>
          product.title.toLocaleLowerCase().indexOf(s) >= 0 ||
          product.description.toLocaleLowerCase().indexOf(s) >= 0
      );
    }

    if (req.query.sort === 'asc' || req.query.sort === 'desc') {
      products = products.sort((a, b) => {
        const diff = Number(a.price) - Number(b.price);

        if (diff === 0) return 0

        const sign = Math.abs(diff) / diff // -1, 1

        return req.query.sort === 'asc' ? sign : -sign
      });
    }

    const page: number = parseInt(req.query.page as any) || 1
    const perPage = 9;
    const total = products.length

    // parameters slice: start/end/ 
    const data = products.slice((page - 1) * perPage, page * perPage)

    return res.send({
      data,
      total,
      page,
      last_page: Math.ceil(total / perPage)
    });
  }
}
