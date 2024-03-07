import { AppDataSource } from "../db/datasource";

import { faker } from '@faker-js/faker';
import Product from "../entity/product.entity";
import Link from "../entity/link.entity";
import User from "../entity/user.entity";
import { randomInt, randomUUID } from "crypto";

AppDataSource.initialize().then(async () => {
  const repository = AppDataSource.getRepository(Link)
  const repositoryUser = AppDataSource.getRepository(User)
  const repositoryProduct = AppDataSource.getRepository(Product)



  for (let i = 0; i < 5; i++) {
    const user = repositoryUser.create()
    user.id = i + 1

    const result = await repository.save({
      user,
      code: randomUUID().toString(),
    })
  }

  process.exit()
})
