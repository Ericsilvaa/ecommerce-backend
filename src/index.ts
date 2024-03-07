import { config } from 'dotenv'; config()
import cookieParser from 'cookie-parser';
import express from "express";
import cors from "cors";
import routes from "./routes/index.routes";
import { AppDataSource } from "./db/datasource";


AppDataSource.initialize().then(() => {
  const app = express();

  app.use(cookieParser())
  app.use(express.json())
  app.use(cors({
    origin: ['http://localhost:3000']
  }))


  app.listen(8000, () => {
    console.log('listening to port 8000')
  })
  routes(app)
}).catch(err => console.error(err))

