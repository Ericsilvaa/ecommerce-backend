import { Server } from 'http';
import { createClient } from 'redis';
import supertest, { SuperTest, Test } from 'supertest';


describe('API Suite Test', () => {
  let app: Server;
  let client: any;

  beforeAll(async () => {
    const importedModule = await import('../../src/index');
    app = importedModule.default;
    await new Promise<void>((resolve) => {
      app.listen(8000, () => {
        console.log('Server is running');
        resolve();
      });
      const client = createClient({
        url: 'redis://127.0.0.1:6379'
      })


    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      app.close(() => {
        console.log('Server is closed');
        resolve();
      });
    });

    if (client) {
      client.quit(() => {
        console.log('Redis client is closed');
      });
    }
  });

  test('should return status 200', async () => {
    const response = await supertest(app).get('/').expect(200);

    expect(response.status).toBe(200)
  })



})