import { config } from 'dotenv'; config()
import cookieParser from 'cookie-parser';
import express from "express";
import cors from "cors";
import routes from "./routes/index.routes";
import { AppDataSource } from "./config/db/datasource";
import { createClient } from 'redis';
import { createServer } from 'node:http';

const app = express();
const server = createServer(app)

export const client = createClient({
  url: 'redis://127.0.0.1:6379'
})

AppDataSource.initialize().then(async () => {
  await client.connect()

  app.use(cookieParser())
  app.use(express.json())
  app.use(cors({
    origin: ['http://localhost:3000']
  }))

  app.use('/api/v1', routes);
}).catch(err => console.error(err))

export default server