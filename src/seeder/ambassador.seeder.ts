import { AppDataSource } from "../config/db/datasource";
import User from "../entity/user.entity";
import bcryptjs from "bcryptjs";
import { faker } from '@faker-js/faker';

AppDataSource.initialize().then(async () => {
  const repository = AppDataSource.getRepository(User)

  const password = await bcryptjs.hash('1234', 10)

  for (let i = 0; i < 3; i++) {
    const user = repository.create({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password,
      is_ambassador: true
    })

    await repository.save(user)
  }



  process.exit()
})

// docker-compose exec <name-service> <comand>
// docker-compose exec backend sh
/*
  commands:
    * # ls
    * # npm run seed:ambassadors
*/