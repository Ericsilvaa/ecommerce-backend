interface User {
  id: number
}

declare namespace Express {
  interface Request {
    user: User;
  }
}