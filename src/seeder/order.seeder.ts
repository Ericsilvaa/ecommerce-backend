import { AppDataSource } from "../config/db/datasource";

import { faker } from "@faker-js/faker";
import { randomInt, randomUUID } from "crypto";
import Order from "../entity/order.entity";
import OrderItem from "../entity/order-item.entity";

AppDataSource.initialize().then(async () => {
  const repositoryOrder = AppDataSource.getRepository(Order);
  const repositoryOrderItem = AppDataSource.getRepository(OrderItem);

  for (let i = 0; i < 5; i++) {
    const order = repositoryOrder.create({
      user_id: randomInt(2, 5),
      code: randomUUID().toString(),
      ambassador_email: faker.internet.email(),
      first_name: faker.person.firstName(),
      last_name: faker.person.firstName(),
      email: faker.internet.email(),
      complete: true,
    });

    await repositoryOrder.save(order);

    for (let j = 0; j < randomInt(1, 5); j++) {
      const price = faker.commerce.price({ min: 50, max: 350, dec: 2, symbol: 'R$' })
      await repositoryOrderItem.save({
        order,
        price,
        product_title: faker.lorem.words(3),
        quantity: randomInt(1, 5),
        admin_revenue: randomInt(1, 5),
        ambassador_revenue: randomInt(1, 100),

      });
    }
  }

  process.exit();
});
