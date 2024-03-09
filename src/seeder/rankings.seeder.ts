import { createClient } from "redis";
import { AppDataSource } from "../config/db/datasource";
import User from "../entity/user.entity";
import Order from "../entity/order.entity";

const getUserOrders = async (
  userId: any,
  complete: boolean,
) => {
  const repository = AppDataSource.getRepository(Order);

  const orders = await repository.find({
    where: {
      user_id: userId,
      complete,
    },
    relations: ["order_items"],
  });

  const revenue = orders.reduce((s, o) => s + o.ambassador_revenue, 0);

  return { orders, revenue };
};

AppDataSource.initialize().then(async () => {
  const client = createClient({
    url: "redis://127.0.0.1:6379",
  });

  await client.connect();

  const ambassadors = await AppDataSource.getRepository(User).find({ where: { is_ambassador: true } });

  for (let i = 0; i < ambassadors.length; i++) {
    const { revenue } = await getUserOrders(
      ambassadors[i].id,
      true,
    );

    await client.zAdd('rankings', {
      value: ambassadors[i].name,
      score: revenue
    })
  }


  // const ranking = ambassadors.map(async (ambassador) => {
  //   const { revenue } = await getUserOrders(
  //     ambassador.id,
  //     true,
  //     repositoryOrder
  //   );

  //   return {
  //     name: ambassador.name,
  //     revenue,
  //   };
  // });
  process.exit()
});
