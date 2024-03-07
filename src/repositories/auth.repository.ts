import User from "../entity/user.entity";
import BaseRespository from "./base/base.repository";


export default class AuthRepository extends BaseRespository<User> {
  constructor() {
    super(User)
  }
}