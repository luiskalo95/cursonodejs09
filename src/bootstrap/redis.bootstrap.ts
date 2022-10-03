import IORedis from 'ioredis';
import yenv from 'yenv';
import Bootstrap from './bootstrap';

const env = yenv();
export default class RedisBootstrap extends Bootstrap {
  private client: IORedis.Redis;
  static client_general: any;

  initialize(): Promise<any> {
    return new Promise((resolve, reject) => {
      const connectionParameters = {
        host: env.DATABASES.REDIS.HOST,
        port: env.DATABASES.REDIS.PORT,
        password: env.DATABASES.REDIS.PASS,
        maxRetriesPerRequest: 5,
      };
      this.client = new IORedis(connectionParameters);
      this.client
        .on('connect', () => {
          console.log('Redis connected');
          resolve(true);
        })
        .on('error', (error: Error) => {
          console.log('Redis error', error);
          reject(error);
        });
      RedisBootstrap.client_general = this.client;
    });
  }

  getConnection(): IORedis.Redis {
    return this.client;
  }

  static async get(key: string): Promise<any> {
    return await this.client_general.get(key);
  }

  static async set(key: string, value: string): Promise<void> {
    await this.client_general.set(key, value, 'PX', 24 * 60 * 60 * 1000);
  }

  static async clear(prefix = ''): Promise<any> {
    const keys = await this.client_general.keys(`${prefix}*`);
    const pipeline = this.client_general.pipeline();
    keys.forEach((key: string) => {
      pipeline.del(key);
    });
    return pipeline.exec();
  }
}
