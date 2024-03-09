import BaseRespository from "./base/base.repository";
import User from "../entity/user.entity";


export default class UserRepository extends BaseRespository<User> {
  constructor() {
    super(User)
  }
}