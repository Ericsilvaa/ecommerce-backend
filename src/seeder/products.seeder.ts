import { AppDataSource } from "../config/db/datasource";

import { faker } from '@faker-js/faker';
import Product from "../entity/product.entity";

AppDataSource.initialize().then(async () => {
  const repository = AppDataSource.getRepository(Product)

  for (let i = 0; i < 10; i++) {
    const price = faker.commerce.price({ min: 50, max: 350, dec: 2 })

    const product = repository.create({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      image: faker.image.url({ width: 200, height: 200 }),
      price
    })

    await repository.save(product)
  }

  process.exit()
})

