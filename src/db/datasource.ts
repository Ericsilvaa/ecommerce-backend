import { join } from "path";
import { DataSource } from "typeorm";

const entitiesPath = join(__dirname, "../entity/");

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./src/db/database.sqlite",
  entities: [`${entitiesPath}*`],
  // entities: [UserEntity, AddressEntity],
  synchronize: true,
})